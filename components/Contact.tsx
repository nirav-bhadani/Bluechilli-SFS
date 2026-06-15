"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { submitLead } from "@/lib/agentService";
import { CheckIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";
import { Reveal } from "./Reveal";

type Status = "idle" | "submitting" | "success" | "error";

const serviceOptions = [
  "Warehousing & storage",
  "Pallet storage",
  "Fulfilment",
  "Co-packing",
  "Transport & distribution",
  "Reverse logistics",
];

const durationOptions = [
  "Under 3 months",
  "3–6 months",
  "6–12 months",
  "12+ months / ongoing",
  "Not sure yet",
];

const contactMethods = ["Email", "Phone", "WhatsApp", "No preference"];

export function Contact() {
  const { contact } = siteConfig;
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await submitLead({
        name: String(data.get("name") ?? ""),
        company: String(data.get("company") ?? ""),
        email: String(data.get("email") ?? ""),
        telephone: String(data.get("telephone") ?? ""),
        location: String(data.get("location") ?? ""),
        spaceRequired: String(data.get("spaceRequired") ?? ""),
        goodsType: String(data.get("goodsType") ?? ""),
        startDate: String(data.get("startDate") ?? ""),
        duration: String(data.get("duration") ?? ""),
        additionalServices: data.getAll("additionalServices").map(String),
        preferredContact: String(data.get("preferredContact") ?? ""),
        consent: data.get("consent") === "on",
        message: String(data.get("message") ?? ""),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section bg-[color:var(--surface-muted)]"
    >
      <div className="container-content">
        {/* Centred intro */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Get in touch</p>
          <h2 id="contact-heading" className="mt-4 text-3xl text-secondary md:text-4xl">
            Tell us about your requirement
          </h2>
          <p className="mt-5 text-lg text-body">
            Share a few details and our team will come back quickly with a
            tailored proposal - capacity, location and KPI reporting included.
            The more you tell us, the more specific our response.
          </p>
        </Reveal>

        {/* Contact-info strip */}
        <Reveal delay={80}>
          <div className="mt-12 grid gap-4 min-[992px]:grid-cols-3">
            <div className="flex items-start gap-4 rounded-[8px] border border-[color:var(--hairline)] bg-white p-5 shadow-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PinIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold uppercase tracking-[0.12em] text-body/60">
                  Visit us
                </span>
                <address className="mt-1 not-italic text-base leading-relaxed text-secondary">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </span>
            </div>

            <div className="flex items-start gap-4 rounded-[8px] border border-[color:var(--hairline)] bg-white p-5 shadow-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold uppercase tracking-[0.12em] text-body/60">
                  Call us
                </span>
                <a
                  href={`tel:${contact.phoneE164}`}
                  className="mt-1 block break-words text-base font-medium text-secondary transition-colors hover:text-primary"
                >
                  {contact.phone}
                </a>
              </span>
            </div>

            <div className="flex items-start gap-4 rounded-[8px] border border-[color:var(--hairline)] bg-white p-5 shadow-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MailIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold uppercase tracking-[0.12em] text-body/60">
                  Email us
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-1 block text-base font-medium text-secondary transition-colors hover:text-primary [overflow-wrap:anywhere]"
                >
                  {contact.email}
                </a>
              </span>
            </div>
          </div>
        </Reveal>

        {/* Full-width form card */}
        <Reveal delay={120}>
          <div className="mt-6 rounded-[8px] border border-[color:var(--hairline)] bg-white px-5 py-7 shadow-card min-[375px]:px-7 sm:p-10">
            <div className="flex flex-col gap-4 border-b border-[color:var(--hairline)] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-secondary">Request a free quote</h3>
                <p className="mt-2 text-base text-body">
                  Fields marked <span className="text-primary">*</span> are required.
                </p>
              </div>
              <p className="inline-flex items-center gap-2 self-start rounded-2xl bg-primary/[0.06] px-4 py-2 text-base font-medium text-secondary sm:self-auto">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                No obligation - we reply within one working day
              </p>
            </div>

            <form className="mt-8 space-y-9" onSubmit={onSubmit}>
              {/* Your details */}
              <fieldset className="space-y-5">
                <legend className="text-sm font-semibold uppercase tracking-[0.12em] text-body/70">
                  Your details
                </legend>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Name" name="name" autoComplete="name" required />
                  <Field label="Company" name="company" autoComplete="organization" />
                  <Field label="Email" name="email" type="email" autoComplete="email" required />
                  <Field label="Telephone" name="telephone" type="tel" autoComplete="tel" />
                  <SelectField label="Preferred contact method" name="preferredContact">
                    <option value="">No preference</option>
                    {contactMethods.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </SelectField>
                </div>
              </fieldset>

              {/* Your requirement */}
              <fieldset className="space-y-5">
                <legend className="text-sm font-semibold uppercase tracking-[0.12em] text-body/70">
                  Your requirement
                </legend>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Field
                    label="Required location"
                    name="location"
                    placeholder="e.g. near Birmingham"
                  />
                  <Field
                    label="Space required"
                    name="spaceRequired"
                    placeholder="e.g. 10,000 sq ft / 200 pallets"
                  />
                  <Field
                    label="Type of goods"
                    name="goodsType"
                    placeholder="e.g. palletised retail stock"
                  />
                  <Field label="Start date" name="startDate" type="date" />
                  <SelectField label="Required duration" name="duration">
                    <option value="">Select duration</option>
                    {durationOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </SelectField>
                </div>

                <div>
                  <span className="mb-3 block text-base font-medium text-secondary">
                    Additional services
                  </span>
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {serviceOptions.map((svc) => (
                      <label
                        key={svc}
                        className="flex h-12 cursor-pointer items-center gap-2.5 rounded-none border border-[color:var(--field-border)] bg-white px-3 text-base text-secondary transition-colors hover:border-[color:var(--field-border-hover)] has-[:checked]:border-primary has-[:checked]:bg-primary/[0.04]"
                      >
                        <input
                          type="checkbox"
                          name="additionalServices"
                          value={svc}
                          className="h-4 w-4 shrink-0 accent-primary"
                        />
                        {svc}
                      </label>
                    ))}
                  </div>
                </div>
              </fieldset>

              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-2 block text-base font-medium text-secondary">
                  Anything else?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Tell us anything else that would help us help you…"
                  className="field resize-y"
                />
              </div>

              {/* Consent + submit */}
              <div className="flex flex-col gap-5 border-t border-[color:var(--hairline)] pt-7 min-[992px]:flex-row min-[992px]:items-center min-[992px]:justify-between">
                <label className="flex cursor-pointer items-start gap-3 text-base text-body">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-primary"
                  />
                  <span className="sm:whitespace-nowrap">
                    I agree to be contacted about my enquiry and accept the{" "}
                    <a href="/privacy" className="font-medium text-primary hover:underline">
                      Privacy Policy
                    </a>
                    . <span className="text-primary">*</span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary w-full px-8 sm:w-auto"
                >
                  {status === "submitting" ? "Sending…" : "Request a quote"}
                </button>
              </div>

              <div aria-live="polite">
                {status === "success" && (
                  <p className="rounded-xl bg-green-50 px-4 py-3 text-base text-green-800">
                    Thanks - we&apos;ve received your request and will be in touch shortly.
                  </p>
                )}
                {status === "error" && (
                  <p className="rounded-xl bg-primary/5 px-4 py-3 text-base text-secondary">
                    Sorry, something went wrong. Please call {contact.phone} or try again.
                  </p>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-base font-medium text-secondary">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="field h-12 py-0 leading-none"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-base font-medium text-secondary">
        {label}
      </label>
      <select id={name} name={name} className="field field-select h-12 py-0 leading-none cursor-pointer" defaultValue="">
        {children}
      </select>
    </div>
  );
}
