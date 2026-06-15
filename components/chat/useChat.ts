"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Attachment,
  ChatMessage,
  Conversation,
  StorageResult,
  SuggestedAction,
} from "@/lib/types";
import {
  buildUserMessage,
  createConversation,
  deleteConversation,
  listConversations,
  loadConversation,
  saveMessage,
  sendMessage,
  stopResponse,
  streamResponse,
  requestHumanHandover,
} from "@/lib/agentService";

export interface UseChat {
  conversationId: string | null;
  messages: ChatMessage[];
  conversations: Conversation[];
  isStreaming: boolean;
  error: string | null;
  send: (text: string, attachments?: Attachment[]) => Promise<void>;
  stop: () => void;
  retry: () => void;
  newConversation: () => void;
  selectConversation: (id: string) => void;
  removeConversation: (id: string) => void;
  handover: () => Promise<void>;
}

function patch(
  list: ChatMessage[],
  id: string,
  updater: (m: ChatMessage) => ChatMessage,
): ChatMessage[] {
  return list.map((m) => (m.id === id ? updater(m) : m));
}

export function useChat(): UseChat {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const lastUserRef = useRef<ChatMessage | null>(null);

  const refreshConversations = useCallback(() => {
    setConversations(listConversations());
  }, []);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const ensureConversation = useCallback((): string => {
    if (conversationId) return conversationId;
    const conv = createConversation();
    setConversationId(conv.id);
    refreshConversations();
    return conv.id;
  }, [conversationId, refreshConversations]);

  const runStream = useCallback(
    async (convId: string, history: ChatMessage[]) => {
      setError(null);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      // Placeholder assistant bubble that we stream into.
      const placeholderId = `pending_${Date.now()}`;
      const placeholder: ChatMessage = {
        id: placeholderId,
        conversationId: convId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        status: "streaming",
        attachments: [],
        metadata: {},
      };
      setMessages((prev) => [...prev, placeholder]);

      try {
        const final = await streamResponse(convId, history, {
          signal: controller.signal,
          onToken: (token) => {
            setMessages((prev) =>
              patch(prev, placeholderId, (m) => ({ ...m, content: m.content + token })),
            );
          },
          onResults: (results: StorageResult[]) => {
            setMessages((prev) =>
              patch(prev, placeholderId, (m) => ({
                ...m,
                metadata: { ...m.metadata, results },
              })),
            );
          },
          onSuggestedActions: (actions: SuggestedAction[]) => {
            setMessages((prev) =>
              patch(prev, placeholderId, (m) => ({ ...m, suggestedActions: actions })),
            );
          },
        });

        // Swap the placeholder for the canonical final message.
        setMessages((prev) =>
          patch(prev, placeholderId, () => ({ ...final })),
        );
      } catch (err) {
        const partial = (err as { partial?: ChatMessage }).partial;
        setMessages((prev) =>
          patch(prev, placeholderId, (m) => ({
            ...(partial ?? m),
            id: placeholderId,
            status: "error",
          })),
        );
        setError(
          "Something went wrong reaching the assistant. Please try again.",
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
        refreshConversations();
      }
    },
    [refreshConversations],
  );

  const send = useCallback(
    async (text: string, attachments: Attachment[] = []) => {
      const trimmed = text.trim();
      if ((!trimmed && attachments.length === 0) || isStreaming) return;

      const convId = ensureConversation();
      const userMessage = buildUserMessage(convId, trimmed, attachments);
      lastUserRef.current = userMessage;

      setMessages((prev) => [...prev, userMessage]);
      sendMessage(userMessage);

      const history = [...messages, userMessage];
      await runStream(convId, history);
    },
    [ensureConversation, isStreaming, messages, runStream],
  );

  const stop = useCallback(() => {
    if (abortRef.current && conversationId) {
      stopResponse(abortRef.current, conversationId);
    }
  }, [conversationId]);

  const retry = useCallback(() => {
    if (isStreaming || !conversationId) return;
    // Drop the errored assistant bubble and re-stream from the last user turn.
    const cleaned = messages.filter((m) => m.status !== "error");
    setMessages(cleaned);
    void runStream(conversationId, cleaned);
  }, [conversationId, isStreaming, messages, runStream]);

  const newConversation = useCallback(() => {
    abortRef.current?.abort();
    const conv = createConversation();
    setConversationId(conv.id);
    setMessages([]);
    setError(null);
    refreshConversations();
  }, [refreshConversations]);

  const selectConversation = useCallback(
    (id: string) => {
      abortRef.current?.abort();
      const conv = loadConversation(id);
      if (!conv) return;
      setConversationId(conv.id);
      setMessages(conv.messages);
      setError(null);
    },
    [],
  );

  const removeConversation = useCallback(
    (id: string) => {
      deleteConversation(id);
      if (id === conversationId) {
        setConversationId(null);
        setMessages([]);
      }
      refreshConversations();
    },
    [conversationId, refreshConversations],
  );

  const handover = useCallback(async () => {
    const convId = ensureConversation();
    const res = await requestHumanHandover(convId);
    const note: ChatMessage = {
      id: `sys_${Date.now()}`,
      conversationId: convId,
      role: "assistant",
      content: res.message,
      timestamp: Date.now(),
      status: "complete",
      attachments: [],
    };
    setMessages((prev) => [...prev, note]);
    saveMessage(convId, note);
    refreshConversations();
  }, [ensureConversation, refreshConversations]);

  return {
    conversationId,
    messages,
    conversations,
    isStreaming,
    error,
    send,
    stop,
    retry,
    newConversation,
    selectConversation,
    removeConversation,
    handover,
  };
}
