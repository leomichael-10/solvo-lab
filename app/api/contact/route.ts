import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { notificationEmail, autoReplyEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

// No fallback addresses on purpose. As of 22 Oct 2026 solvo-lab.com publishes
// no MX record, so defaulting CONTACT_INBOX to info@solvo-lab.com would make
// every enquiry hard-bounce while the form still reported success. Fail loudly.
const FROM = process.env.CONTACT_FROM;
const INBOX = process.env.CONTACT_INBOX;
const AUTOREPLY = process.env.CONTACT_AUTOREPLY === "true";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().min(1, "Please enter your email").max(254)
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address"),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(20, "Tell us a little more — 20 characters minimum").max(5000),
  // Honeypot: people never see this field, bots usually fill it.
  website: z.string().max(0).optional(),
});

type FieldName = "name" | "email" | "company" | "message";

// Built by hand rather than with flatten()/treeifyError() so this does not
// depend on which Zod major is installed.
function fieldErrorsFrom(error: z.ZodError): Partial<Record<FieldName, string[]>> {
  const out: Partial<Record<FieldName, string[]>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;
    const field = key as FieldName;
    (out[field] ??= []).push(issue.message);
  }
  return out;
}

// Per-instance throttle. Serverless instances are not shared, so this slows
// casual abuse but is not a real rate limiter — see docs/CONTACT-FORM.md.
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const missing = [
    !process.env.RESEND_API_KEY && "RESEND_API_KEY",
    !FROM && "CONTACT_FROM",
    !INBOX && "CONTACT_INBOX",
  ].filter(Boolean);

  if (missing.length > 0) {
    console.error(`[contact] missing env: ${missing.join(", ")}`);
    return NextResponse.json(
      { error: "The contact form is not configured yet." },
      { status: 500 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form.", fieldErrors: fieldErrorsFrom(parsed.error) },
      { status: 422 },
    );
  }

  const { name, email, company, message, website } = parsed.data;

  // Honeypot tripped — accept silently so the bot learns nothing.
  if (website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: FROM!,
      to: INBOX!,
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` — ${company}` : ""}`,
      html: notificationEmail({ name, email, company, message, ip }),
      text: [
        `From: ${name} <${email}>`,
        company ? `Company: ${company}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("[contact] notification failed", error);
      return NextResponse.json(
        {
          error: "Could not send your message. Please email us directly.",
          // Dev only: the provider's real reason, so a misconfigured sender or
          // inbox is visible in the browser instead of buried in the terminal.
          ...(process.env.NODE_ENV !== "production"
            ? { detail: `${error.name}: ${error.message}` }
            : {}),
        },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] notification threw", err);
    return NextResponse.json(
      { error: "Could not send your message. Please email us directly." },
      { status: 502 },
    );
  }

  // Best-effort: the enquiry already landed, so a failed auto-reply must not
  // surface as an error to the person who filled in the form.
  if (AUTOREPLY) {
    try {
      await resend.emails.send({
        from: FROM!,
        to: email,
        replyTo: INBOX!,
        subject: "We've received your message — Solvo Lab",
        html: autoReplyEmail({ name }),
        text: `Hi ${name},\n\nThanks for getting in touch with Solvo Lab. We've received your message and someone will come back to you within one business day.\n\n— Solvo Lab`,
      });
    } catch (err) {
      console.error("[contact] auto-reply failed", err);
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
