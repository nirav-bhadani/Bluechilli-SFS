import { Fragment, type ReactNode } from "react";

// Tiny, dependency-free markdown renderer covering what the assistant emits:
// links, **bold**, `code`, and unordered/ordered lists. Escapes everything
// else so no raw HTML is injected.

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Tokens: links, bold, inline code.
  const pattern =
    /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|#[^\s)]*)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(<Fragment key={`${keyPrefix}-t${i}`}>{text.slice(last, match.index)}</Fragment>);
    }
    if (match[1]) {
      nodes.push(
        <a key={`${keyPrefix}-a${i}`} href={match[3]} target={match[3].startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {match[2]}
        </a>,
      );
    } else if (match[4]) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{match[5]}</strong>);
    } else if (match[6]) {
      nodes.push(<code key={`${keyPrefix}-c${i}`}>{match[7]}</code>);
    }
    last = pattern.lastIndex;
    i += 1;
  }
  if (last < text.length) {
    nodes.push(<Fragment key={`${keyPrefix}-end`}>{text.slice(last)}</Fragment>);
  }
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let listBuffer: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (!listBuffer) return;
    const items = listBuffer.items;
    const ordered = listBuffer.ordered;
    blocks.push(
      ordered ? (
        <ol key={`ol-${key++}`}>
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `li-${key}-${idx}`)}</li>
          ))}
        </ol>
      ) : (
        <ul key={`ul-${key++}`}>
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `li-${key}-${idx}`)}</li>
          ))}
        </ul>
      ),
    );
    listBuffer = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const ulMatch = /^\s*[-*]\s+(.*)$/.exec(line);
    const olMatch = /^\s*\d+\.\s+(.*)$/.exec(line);

    if (ulMatch) {
      if (!listBuffer || listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: false, items: [] };
      }
      listBuffer.items.push(ulMatch[1]);
      continue;
    }
    if (olMatch) {
      if (!listBuffer || !listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: true, items: [] };
      }
      listBuffer.items.push(olMatch[1]);
      continue;
    }

    flushList();
    if (line.trim() === "") continue;
    blocks.push(<p key={`p-${key++}`}>{renderInline(line, `p-${key}`)}</p>);
  }
  flushList();

  return <div className="markdown-body">{blocks}</div>;
}
