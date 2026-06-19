"use client";

/**
 * Generic Elementor form renderer — fields/widths/placeholders verbatim from the
 * page JSON; submit stubbed to /api/contact (honeypot + thank-you UX; Resend at
 * cutover per Moxi launch sequence). Success/error copy verbatim from the widget.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { EkitIcon } from "@/components/ui/ekit-icons";

const FIELD =
  "w-full rounded-[11px] border-0 bg-field-fill px-4 py-[15px] text-[14px] font-medium text-black placeholder:text-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-brand-purple";

export function StubForm({ el }: { el: { id: string; settings: any } }) {
  const s = el.settings;
  const fields: any[] = (s.form_fields || []).filter(
    (f: any) => !["step", "html", "hidden", "recaptcha", "recaptcha_v3"].includes(f.field_type)
  );
  const success =
    s.success_message ||
    "Thank you for your submission. A team member will reach out shortly!";
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const hasUpload = fields.some((f: any) => f.field_type === "upload");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setBusy(true);
    try {
      if (hasUpload) {
        // multipart so the resume/CV file reaches the API (careers form)
        const fd = new FormData(e.currentTarget);
        fd.append("form", s.form_name || el.id);
        await fetch("/api/contact", { method: "POST", body: fd });
      } else {
        const data = Object.fromEntries(new FormData(e.currentTarget).entries());
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form: s.form_name || el.id, ...data }),
        });
      }
    } catch {
      /* stub mode */
    }
    setBusy(false);
    setDone(true);
  }

  if (done) {
    return <p className="py-8 text-center text-[16px] font-medium text-brand-purple">{success}</p>;
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`el-${el.id} flex w-full flex-wrap gap-[15px]`}>
      <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {fields.map((f: any) => {
        const width = Number(f.width || 100);
        // .si-stub-field forces flex-basis 100% ≤767px (Joel: one field per line on mobile)
        const style = { flexBasis: `calc(${width}% - 15px)`, flexGrow: 1 } as const;
        const required = f.required === "true" || f.required === true;
        const common = {
          name: f.custom_id || f._id,
          placeholder: f.placeholder || f.field_label,
          required,
          "aria-label": f.field_label,
          className: FIELD + " si-stub-field",
        };
        if (f.field_type === "select") {
          const opts = (f.field_options || "").split("\n").filter(Boolean);
          return (
            <select key={f._id} {...common} defaultValue="" style={style}>
              <option value="" disabled>
                {opts[0] || f.field_label}
              </option>
              {opts.slice(1).map((o: string) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          );
        }
        if (f.field_type === "textarea") {
          return <textarea key={f._id} {...common} rows={f.rows || 4} style={style} />;
        }
        if (f.field_type === "checkbox") {
          const opts = (f.field_options || "").split("\n").filter(Boolean);
          return (
            <fieldset key={f._id} style={style} className="si-stub-field flex flex-col gap-2">
              {f.field_label && <legend className="mb-1 text-[14px] text-brand-text">{f.field_label}</legend>}
              {(opts.length ? opts : [f.field_label]).map((o: string) => (
                <label key={o} className="flex items-start gap-2 text-[14px] leading-[1.5] text-brand-text">
                  <input
                    type="checkbox"
                    name={`${f.custom_id || f._id}[]`}
                    value={o}
                    required={required && opts.length <= 1}
                    className="mt-[3px] h-4 w-4 shrink-0 accent-brand-purple"
                  />
                  {o}
                </label>
              ))}
            </fieldset>
          );
        }
        if (f.field_type === "upload") {
          return (
            <label key={f._id} style={style} className="si-stub-field flex flex-col gap-2 text-[14px] text-brand-text">
              {f.field_label}
              <input
                type="file"
                name={f.custom_id || f._id}
                required={required}
                accept=".pdf,.doc,.docx,.txt,.rtf,.pages"
                aria-label={f.field_label}
                className="w-full rounded-[11px] bg-field-fill px-4 py-[12px] text-[14px] file:mr-4 file:rounded-md file:border-0 file:bg-brand-purple file:px-4 file:py-2 file:text-[13px] file:font-medium file:text-white"
              />
            </label>
          );
        }
        return (
          <input
            key={f._id}
            {...common}
            type={f.field_type === "email" ? "email" : f.field_type === "tel" ? "tel" : f.field_type === "number" ? "number" : "text"}
            style={style}
          />
        );
      })}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center gap-[7px] rounded-[10px] bg-brand-red px-[36px] py-[18px] text-[14px] leading-none text-white transition-colors duration-200 hover:bg-brand-purple disabled:opacity-60"
        style={{ flexBasis: `calc(${Number(s.button_width || 100)}% - 15px)`, flexGrow: 1 }}
      >
        {busy ? "Sending…" : s.button_text || "Submit"}
        <EkitIcon name="right-arrow" className="h-4 w-4" />
      </button>
    </form>
  );
}
