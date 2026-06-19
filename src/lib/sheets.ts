/**
 * Google Sheets lead append — replicates the live site's ElementorFormSheets
 * plugin so the sheet sees ZERO format change at cutover.
 *
 * Live mechanism (same plugin/service account as the Texas sister site):
 * - Service account: form-writer@ordinal-crowbar-492916-d8.iam.gserviceaccount.com
 *   (each target sheet is already shared with it as Editor — reuse the SAME
 *   account; generate a fresh JSON key in GCP at cutover, no resharing needed).
 * - AIO Schedule Inspection Form → spreadsheet 1vwK8u_VpbdYowzXuobuFN0nyh2XwznoohcOzkI4amOc, tab "AllInOne" (include_html)
 * - Contact Form               → spreadsheet 1uQnp36ws555SJ5MNL9pn-oDZF47Ng5uP_k3ImDcHl54, tab "AllInOne"
 * - NO feedback sheet, NO careers sheet on this site.
 *
 * Row format follows the Texas pattern (timestamp first, then this form's fields
 * in live form-field order; static html-field texts included for the schedule
 * form; Total = the live JS total text). FLAG: mapping needs verification
 * against a real queue payload before cutover (qa-report.md).
 *
 * Timestamp: the live WP install uses a FIXED UTC-5 offset (manual offset, not
 * DST-aware) — replicated here verbatim and FLAGGED in qa-report.md.
 *
 * Env (cutover): GOOGLE_SA_EMAIL + GOOGLE_SA_PRIVATE_KEY (from the service-account
 * JSON key; private key with literal \n sequences supported). Until set, callers
 * skip the append (stub mode).
 */
import { createSign } from "node:crypto";

const SHEETS = {
  schedule: { id: "1vwK8u_VpbdYowzXuobuFN0nyh2XwznoohcOzkI4amOc", tab: "AllInOne" },
  contact: { id: "1uQnp36ws555SJ5MNL9pn-oDZF47Ng5uP_k3ImDcHl54", tab: "AllInOne" },
} as const;

export function sheetsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SA_EMAIL && process.env.GOOGLE_SA_PRIVATE_KEY);
}

/**
 * "YYYY-MM-DD HH:MM:SS" at FIXED UTC-5 — matches the live WP timestamps
 * (manual UTC-5 offset, NOT DST-aware; flagged in qa-report.md).
 */
export function sheetTimestamp(d = new Date()): string {
  const t = new Date(d.getTime() - 5 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())} ${p(t.getUTCHours())}:${p(t.getUTCMinutes())}:${p(t.getUTCSeconds())}`;
}

async function accessToken(): Promise<string> {
  const email = process.env.GOOGLE_SA_EMAIL!;
  const key = process.env.GOOGLE_SA_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned =
    b64({ alg: "RS256", typ: "JWT" }) +
    "." +
    b64({
      iss: email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    });
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token as string;
}

/** Append one row. `form` picks the spreadsheet; values must already be in column order. */
export async function appendRow(form: keyof typeof SHEETS, values: (string | number)[]) {
  const { id, tab } = SHEETS[form];
  const token = await accessToken();
  const range = encodeURIComponent(`${tab}!A1`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [values] }),
    }
  );
  if (!res.ok) throw new Error(`Sheets append failed: ${res.status} ${await res.text()}`);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Build the Schedule Inspection row from the /api/schedule payload — live
 * form-field order (AIO form has NO location field): Timestamp | Full Name |
 * Email | Phone | Full Address | City | State | Zip Code | Square Feet |
 * Inspection Type | Year Home Built (+20 Yrs: $50) | Foundation Type |
 * Home Age $50 | Pier & Beam $100 | Subtotal | Service Add-Ons | Total |
 * How did you hear about us?
 * (include_html: static html-field texts submitted regardless of visibility.)
 */
export function scheduleRow(p: Record<string, any>): string[] {
  return [
    sheetTimestamp(),
    String(p.name ?? ""),
    String(p.email ?? ""),
    String(p.phone ?? ""),
    String(p.address ?? ""),
    String(p.city ?? ""),
    String(p.state ?? ""),
    String(p.zip ?? ""),
    String(p.sqftscheduling ?? ""),
    String(p.inspectionType ?? ""),
    String(p.yearBuilt ?? ""),
    String(p.foundation ?? ""),
    "Home Older Than 20 Years: $50.00",
    "Pier and Beam Foundation\r\nPrice: $100.00",
    "Total: $000",
    Array.isArray(p.addOns) ? p.addOns.join(", ") : String(p.addOns ?? ""),
    `Total: ${String(p.total ?? "").replace(/^Total:\s*/, "")}`,
    String(p.hearAbout ?? ""),
  ];
}

/** Build the Contact Form row: Timestamp | First Name | Last Name | Email | Phone | Message. */
export function contactRow(p: Record<string, any>): string[] {
  return [
    sheetTimestamp(),
    String(p.name ?? ""),
    String(p.field_88e4430 ?? p.lastName ?? ""),
    String(p.email ?? ""),
    String(p.field_7e539c7 ?? p.phone ?? ""),
    String(p.field_a9792e5 ?? p.message ?? ""),
  ];
}
