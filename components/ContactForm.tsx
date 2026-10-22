"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnimateIn } from "@/components/ui/AnimateIn";

type FieldName = "name" | "email" | "company" | "message";
type FieldErrors = Partial<Record<FieldName, string[]>>;
type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-md border border-border bg-bg2 px-4 py-3 font-inter text-sm text-text " +
  "placeholder:text-muted/60 transition-colors duration-200 " +
  "hover:border-subtle focus:border-accent focus:outline-none";

const labelClass =
  "mb-2 block font-inter text-xs font-medium uppercase tracking-[0.12em] text-muted";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setNotice("");
    setFieldErrors({});

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setFieldErrors(data.fieldErrors ?? {});
        setNotice(
          [data.error ?? "Something went wrong. Please try again.", data.detail]
            .filter(Boolean)
            .join(" — "),
        );
        return;
      }

      form.reset();
      setStatus("sent");
      setNotice("Thank you — your message is with us. We'll reply within one business day.");
    } catch {
      setStatus("error");
      setNotice("Network error. Please check your connection and try again.");
    }
  }

  const err = (field: FieldName) => fieldErrors[field]?.[0];

  return (
    <AnimateIn delay={0.3}>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto mt-14 max-w-xl text-left"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              aria-invalid={Boolean(err("name"))}
              className={fieldClass}
              placeholder="Your full name"
            />
            {err("name") && (
              <p className="mt-2 font-inter text-xs text-red-400">{err("name")}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              aria-invalid={Boolean(err("email"))}
              className={fieldClass}
              placeholder="you@company.com"
            />
            {err("email") && (
              <p className="mt-2 font-inter text-xs text-red-400">{err("email")}</p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="company" className={labelClass}>
            Company{" "}
            <span className="normal-case tracking-normal text-subtle">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={fieldClass}
            placeholder="Where you work"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="message" className={labelClass}>
            How can we help?
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            aria-invalid={Boolean(err("message"))}
            className={`${fieldClass} resize-y`}
            placeholder="Tell us where you are and where you want to be."
          />
          {err("message") && (
            <p className="mt-2 font-inter text-xs text-red-400">{err("message")}</p>
          )}
        </div>

        {/* Honeypot — off-screen for people, tempting to bots. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileHover={status === "sending" ? undefined : { scale: 1.02 }}
          whileTap={status === "sending" ? undefined : { scale: 0.98 }}
          className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-accent px-8 py-3.5 font-inter text-sm font-medium text-white transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </motion.button>

        {notice && (
          <p
            role="status"
            aria-live="polite"
            className={`mt-5 font-inter text-sm ${
              status === "sent" ? "text-accent" : "text-red-400"
            }`}
          >
            {notice}
          </p>
        )}
      </form>
    </AnimateIn>
  );
}
