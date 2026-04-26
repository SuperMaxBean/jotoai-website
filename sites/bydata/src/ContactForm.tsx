import { useEffect, useState, type FormEvent } from "react";

const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "https://admin.jotoai.com";

export interface ContactFormLabels {
  title: string;
  subtitle: string;
  name: string;
  namePlaceholder: string;
  company: string;
  companyPlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  message: string;
  messagePlaceholder: string;
  captcha: string;
  captchaPlaceholder: string;
  refresh: string;
  submit: string;
  submitting: string;
  success: string;
  errorGeneric: string;
  errorCaptcha: string;
  errorNetwork: string;
}

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

interface CaptchaState {
  captchaId: string;
  svg: string;
}

interface ContactFormProps {
  site: "bydata" | "zengwins";
  labels: ContactFormLabels;
}

export default function ContactForm({ site, labels }: ContactFormProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState<CaptchaState | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });

  async function loadCaptcha() {
    setCaptchaLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/captcha`);
      if (!res.ok) throw new Error(`captcha ${res.status}`);
      const data = (await res.json()) as CaptchaState;
      setCaptcha({ captchaId: data.captchaId, svg: data.svg });
      setCaptchaInput("");
    } catch {
      setCaptcha(null);
      setSubmit({ kind: "error", message: labels.errorCaptcha });
    } finally {
      setCaptchaLoading(false);
    }
  }

  useEffect(() => {
    loadCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captcha) return;
    setSubmit({ kind: "submitting" });
    try {
      const res = await fetch(`${API_BASE}/api/${site}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          message,
          source: typeof window !== "undefined" ? window.location.href : `${site}.com`,
          captchaId: captcha.captchaId,
          captcha: captchaInput,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };
      if (data.success) {
        setSubmit({ kind: "success", message: data.message ?? labels.success });
        setName("");
        setCompany("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setSubmit({ kind: "error", message: data.error ?? labels.errorGeneric });
      }
      loadCaptcha();
    } catch {
      setSubmit({ kind: "error", message: labels.errorNetwork });
      loadCaptcha();
    }
  }

  const submitting = submit.kind === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white text-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl space-y-4"
    >
      <div className="mb-2">
        <h3 className="text-xl font-black tracking-tight">{labels.title}</h3>
        <p className="text-sm text-slate-500 font-medium mt-1">{labels.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={labels.name}
          value={name}
          onChange={setName}
          placeholder={labels.namePlaceholder}
          required
        />
        <Field
          label={labels.company}
          value={company}
          onChange={setCompany}
          placeholder={labels.companyPlaceholder}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={labels.email}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={labels.emailPlaceholder}
          required
        />
        <Field
          label={labels.phone}
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder={labels.phonePlaceholder}
          required
        />
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
          {labels.message}
        </label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder={labels.messagePlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm placeholder:text-slate-400 resize-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
        <Field
          label={labels.captcha}
          value={captchaInput}
          onChange={setCaptchaInput}
          placeholder={labels.captchaPlaceholder}
          required
        />
        <div className="flex items-center gap-2">
          {captcha ? (
            <img
              src={captcha.svg}
              alt={labels.captcha}
              onClick={loadCaptcha}
              className="h-11 rounded-lg border border-slate-200 bg-white cursor-pointer"
            />
          ) : (
            <div className="h-11 w-[120px] rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
              {captchaLoading ? "…" : "—"}
            </div>
          )}
          <button
            type="button"
            onClick={loadCaptcha}
            aria-label={labels.refresh}
            title={labels.refresh}
            className="w-9 h-11 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors flex items-center justify-center"
          >
            <svg
              className={`w-4 h-4 ${captchaLoading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !captcha}
        className="w-full inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {submitting ? labels.submitting : labels.submit}
      </button>

      {submit.kind === "success" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          <span aria-hidden="true">✓</span>
          {submit.message}
        </div>
      )}
      {submit.kind === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          <span aria-hidden="true">!</span>
          {submit.message}
        </div>
      )}
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "email" | "tel";
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: FieldProps) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
        {label}
        {required && <span className="text-blue-600 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm placeholder:text-slate-400 transition-colors"
      />
    </div>
  );
}
