/**
 * Plain HTML email templates.
 *
 * Deliberately dependency-free and deliberately NOT Tailwind: mail clients
 * strip most modern CSS, so these use tables, inline styles and web-safe font
 * stacks. Colours are duplicated from the @theme tokens in app/globals.css
 * because an email cannot read CSS variables from the site.
 */

const BLUE = "#2F81F7";
const INK = "#0D1117";
const MUTED = "#7D8590";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shell(inner: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#F6F8FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #D0D7DE;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:${INK};padding:20px 24px;">
          <span style="color:#FFFFFF;font-size:18px;font-weight:600;letter-spacing:0.02em;">Solvo<span style="color:${BLUE};">&nbsp;Lab</span></span>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;color:${INK};font-size:15px;line-height:1.6;">
          ${inner}
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;border-top:1px solid #E6EDF3;color:${MUTED};font-size:12px;">
          Solvo Lab FZE LLC &middot; Ajman Free Zone, UAE &middot; solvo-lab.com
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function notificationEmail(input: {
  name: string;
  email: string;
  company?: string;
  message: string;
  ip?: string;
}): string {
  const { name, email, company, message, ip } = input;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;color:${MUTED};font-size:13px;width:90px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:14px;">${value}</td>
    </tr>`;

  return shell(`
    <p style="margin:0 0 16px;font-size:16px;font-weight:600;">New enquiry from the website</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:20px;">
      ${row("Name", escapeHtml(name))}
      ${row("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${BLUE};text-decoration:none;">${escapeHtml(email)}</a>`)}
      ${company ? row("Company", escapeHtml(company)) : ""}
    </table>
    <div style="padding:16px;background:#F6F8FA;border-left:3px solid ${BLUE};border-radius:4px;white-space:pre-wrap;font-size:14px;">${escapeHtml(message)}</div>
    <p style="margin:20px 0 0;color:${MUTED};font-size:12px;">
      Reply directly to this email to respond to ${escapeHtml(name)}.${ip ? ` Submitted from ${escapeHtml(ip)}.` : ""}
    </p>
  `);
}

export function autoReplyEmail(input: { name: string }): string {
  const { name } = input;

  return shell(`
    <p style="margin:0 0 16px;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 16px;">
      Thanks for getting in touch with Solvo Lab. Your message has reached us and
      someone from the team will come back to you within one business day.
    </p>
    <p style="margin:0 0 16px;">
      If anything is urgent in the meantime, reply to this email and it will land
      in the same place.
    </p>
    <p style="margin:0;color:${MUTED};">&mdash; Solvo Lab</p>
  `);
}
