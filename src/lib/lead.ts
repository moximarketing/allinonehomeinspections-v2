import { NextResponse } from "next/server";
import { appendRow, contactRow, scheduleRow, sheetsConfigured } from "./sheets";

/**
 * Shared lead handler for all form API routes.
 *
 * STAGING (no env keys): honeypot-drops bots, logs payloads to function logs,
 * returns 200 so the form shows its thank-you state (Moxi launch sequence —
 * keys go in at final domain cutover).
 *
 * CUTOVER (env set): Google Sheets append (live ElementorFormSheets format —
 * see lib/sheets.ts) + Resend email.
 *
 * Resend env (cutover): RESEND_API_KEY, RESEND_FROM (BARE address only —
 * display name applied here at runtime), RESEND_BCC=hello@thisismoxi.com.
 *
 * Recipients (live form widget settings):
 *   schedule + contact → office@allinonehomeinspections.com
 *   careers → careers@yoursuperinspector.com (live setting — clone artifact?
 *   FLAGGED in qa-report.md for Joel to confirm)
 *   hello@thisismoxi.com BCC on everything.
 *
 * Subject: live uses the clone-artifact 'New message from "Super Inspector
 * Texas | Home Inspection Company"' on contact/careers and "New message from
 * All In One Home Inspections" on schedule — unified here to the AIO subject
 * for ALL forms (artifact flagged in qa-report.md).
 */

const FROM_NAME = "All In One Home Inspections";
const SUBJECT = "New message from All In One Home Inspections";

const RECIPIENTS: Record<string, string[]> = {
  schedule: ["office@allinonehomeinspections.com"],
  contact: ["office@allinonehomeinspections.com"],
  careers: ["careers@yoursuperinspector.com"],
};

export type LeadAttachment = { filename: string; content: string }; // base64

export function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

function esc(v: unknown): string {
  return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Live email body is [all-fields] — render every submitted field as label: value rows. */
function allFieldsHtml(payload: Record<string, unknown>): string {
  const rows = Object.entries(payload)
    .filter(([k]) => k !== "honeypot")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:600;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0">${esc(Array.isArray(v) ? v.join(", ") : v)}</td></tr>`
    )
    .join("");
  return `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>`;
}

export async function sendLeadEmail(
  formName: string,
  payload: Record<string, unknown>,
  attachments: LeadAttachment[] = []
): Promise<string> {
  if (!resendConfigured()) return "skipped";
  const to = RECIPIENTS[formName] ?? RECIPIENTS.contact;
  const bcc = process.env.RESEND_BCC;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // RESEND_FROM must be the BARE address — display name applied here
      from: `${FROM_NAME} <${process.env.RESEND_FROM}>`,
      to,
      ...(bcc ? { bcc: [bcc] } : {}),
      reply_to: typeof payload.email === "string" && payload.email ? payload.email : undefined,
      subject: SUBJECT,
      html: allFieldsHtml(payload),
      ...(attachments.length ? { attachments } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return "sent";
}

const MAX_UPLOAD = 8 * 1024 * 1024; // 8MB resume cap

/** Parse JSON or multipart (careers resume) into payload + attachments. */
async function parseRequest(req: Request): Promise<{
  payload: Record<string, unknown>;
  attachments: LeadAttachment[];
} | null> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    const payload: Record<string, unknown> = {};
    const attachments: LeadAttachment[] = [];
    for (const [key, value] of fd.entries()) {
      if (value instanceof File) {
        if (value.size === 0) continue;
        if (value.size > MAX_UPLOAD) {
          payload[key] = `(file too large: ${value.name})`;
          continue;
        }
        const buf = Buffer.from(await value.arrayBuffer());
        attachments.push({ filename: value.name, content: buf.toString("base64") });
        payload[key] = value.name;
      } else if (key.endsWith("[]")) {
        const k = key.slice(0, -2);
        payload[k] = [...((payload[k] as string[]) ?? []), String(value)];
      } else {
        payload[key] = String(value);
      }
    }
    return { payload, attachments };
  }
  try {
    return { payload: await req.json(), attachments: [] };
  } catch {
    return null;
  }
}

export async function handleLead(req: Request, formName: string) {
  const parsed = await parseRequest(req);
  if (!parsed) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  const { payload, attachments } = parsed;

  // Honeypot: bots fill the hidden field. Pretend success, drop silently.
  if (typeof payload.honeypot === "string" && payload.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true, mode: "dropped" });
  }
  const { honeypot: _honeypot, ...rest } = payload;
  void _honeypot;

  // Careers detection: the generic /api/contact route serves multiple forms
  const effective =
    formName === "contact" && typeof rest.form === "string" && /job application/i.test(rest.form)
      ? "careers"
      : formName;

  // Google Sheets append — same sheet/format as the live ElementorFormSheets plugin.
  // Only the schedule form and the contact-page form are connected on live; the
  // utilities-page "New Form" is NOT (it would produce a malformed contact row).
  const sheetEligible =
    effective === "schedule" ||
    (effective === "contact" && (!rest.form || /contact form/i.test(String(rest.form))));
  let sheetMode = "skipped";
  if (sheetsConfigured() && sheetEligible) {
    try {
      await appendRow(
        effective as "schedule" | "contact",
        effective === "schedule" ? scheduleRow(rest) : contactRow(rest)
      );
      sheetMode = "appended";
    } catch (err) {
      console.error(`[lead:${effective}] Sheets append FAILED:`, err);
      sheetMode = "failed";
    }
  }

  // Resend email
  let emailMode = "skipped";
  if (resendConfigured()) {
    try {
      emailMode = await sendLeadEmail(effective, rest, attachments);
    } catch (err) {
      console.error(`[lead:${effective}] Resend send FAILED:`, err);
      emailMode = "failed";
    }
  }

  if (emailMode === "skipped" && sheetMode === "skipped") {
    console.log(
      `[lead:${effective}] (stub mode)`,
      JSON.stringify(rest),
      attachments.length ? `+${attachments.length} attachment(s): ${attachments.map((a) => a.filename).join(", ")}` : ""
    );
    return NextResponse.json({ ok: true, mode: "stub" });
  }
  return NextResponse.json({ ok: true, mode: "live", sheets: sheetMode, email: emailMode });
}
