# Contact form

Replaces the `mailto:` links that previously served as the site's only contact
route.

## Why this exists

As of 22 Oct 2026, DNS for solvo-lab.com looked like this:

| Lookup | Result |
|---|---|
| `solvo-lab.com` NS | `ns1.vercel-dns.com`, `ns2.vercel-dns.com` |
| `solvo-lab.com` MX | **none** |
| `solvo-lab.com` TXT | **none** (no SPF) |
| `send.solvo-lab.com` MX | **none** |
| `_dmarc.solvo-lab.com` TXT | **none** |

No MX record means `info@solvo-lab.com` does not receive mail. Every
`mailto:` link on the site pointed there, so enquiries were bouncing.

## Files

| Path | Role |
|---|---|
| `app/api/contact/route.ts` | Validation, throttling, sending |
| `lib/email-templates.ts` | HTML for the notification and auto-reply |
| `components/ContactForm.tsx` | The form |
| `components/CTA.tsx` | Hosts the form, anchors `#contact` |

`Nav`, `Hero` and the `Footer` nav list now link to `#contact`.

## Remaining setup

### 1. A mailbox that exists

`CONTACT_INBOX` must be a real, deliverable address. Either:

- **Zoho free tier** — real mailbox on the domain, up to 5 users. Adds MX + SPF
  at the root. The proper answer.
- **ImprovMX** — Vercel has a DNS preset; forwards `info@` to an existing
  Gmail. Fast, but replies come from the Gmail address unless send-as is
  configured too.
- **A plain Gmail** — set `CONTACT_INBOX` to it and skip domain mail for now.

### 2. Resend

Add **solvo-lab.com** (root) at resend.com/domains. Leave the return path as
the default `send`. Then add in Vercel → Domains → solvo-lab.com:

| Name | Type | Value |
|---|---|---|
| `resend._domainkey` | TXT | DKIM key from Resend |
| `send` | MX | `feedback-smtp.<region>.amazonses.com`, priority 10 |
| `send` | TXT | `v=spf1 include:amazonses.com ~all` |

Enter only the subdomain in **Name** — `send`, not `send.solvo-lab.com`.
Appending the domain is the most common cause of failed verification.

A mailbox provider's MX and SPF go at the root (`@`) and do not collide with
the above: MX records only affect the name they sit on.

After Resend verifies:

| Name | Type | Value |
|---|---|---|
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:dmarc@solvo-lab.com` |

Keep `p=none` for a couple of weeks and read the reports before tightening.
The `rua` address needs a real mailbox behind it.

### 3. Environment

`.env.local` locally (gitignored), and the same three in Vercel → Settings →
Environment Variables:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_INBOX=<a mailbox that exists>
CONTACT_FROM=Solvo Lab <info@solvo-lab.com>
CONTACT_AUTOREPLY=true
```

`CONTACT_FROM` only needs the **domain** verified in Resend — no mailbox
required. `CONTACT_INBOX` does need one. The route returns 500 and logs the
missing names if any are unset; there are no fallback addresses by design,
because a default of `info@solvo-lab.com` would bounce silently.

## Notes

- **Rate limiting** is an in-memory Map, per serverless instance. It slows
  casual abuse, not a determined flood. Move to Upstash Redis or Vercel KV if
  the form gets hit.
- **Honeypot**: a hidden `website` field. Filled submissions get `200` with
  nothing sent, so bots cannot tell they were caught.
- **Replies**: the notification sets `replyTo` to the enquirer, so replying
  from the Solvo Lab inbox reaches them, not Resend.
- **`Footer.tsx` still displays `info@solvo-lab.com`** as a literal address.
  Left in place deliberately — it becomes correct the moment a mailbox exists.
- **Go-live test**: submit once for real and confirm it lands in the inbox, not
  spam. If spam, check DKIM passes in the message headers first.
