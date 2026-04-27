import { useEffect, useState, type FormEvent } from "react";
import { Loader2, RefreshCw, Send, CheckCircle2, AlertTriangle } from "lucide-react";

const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "https://admin.jotoai.com";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

interface CaptchaState {
  captchaId: string;
  svg: string;
}

export default function ContactForm() {
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
    } catch (err) {
      setCaptcha(null);
      setSubmit({
        kind: "error",
        message: "验证码加载失败，请刷新重试",
      });
    } finally {
      setCaptchaLoading(false);
    }
  }

  useEffect(() => {
    loadCaptcha();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captcha) return;
    setSubmit({ kind: "submitting" });
    try {
      const res = await fetch(`${API_BASE}/api/zengwins/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          message,
          source: typeof window !== "undefined" ? window.location.href : "zengwins.com",
          captchaId: captcha.captchaId,
          captcha: captchaInput,
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (data.success) {
        setSubmit({ kind: "success", message: data.message ?? "已收到，我们将尽快与您联系" });
        setName("");
        setCompany("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setSubmit({ kind: "error", message: data.error ?? "提交失败，请稍后重试" });
      }
      loadCaptcha();
    } catch {
      setSubmit({ kind: "error", message: "网络错误，请稍后重试" });
      loadCaptcha();
    }
  }

  const submitting = submit.kind === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      className="p-10 rounded-[2.5rem] bg-white border border-neutral-200 shadow-xl shadow-brand-500/5 flex flex-col gap-5"
    >
      <h3 className="text-2xl font-black text-neutral-900 mb-2">在线留言</h3>
      <p className="text-sm font-medium text-neutral-500 mb-2">
        填写需求，工程师将在 24 小时内回复初步方案建议。
      </p>

      <div className="grid grid-cols-2 gap-4">
        <FieldText
          label="姓名"
          value={name}
          onChange={setName}
          required
          placeholder="您的姓名"
        />
        <FieldText
          label="公司/机构"
          value={company}
          onChange={setCompany}
          required
          placeholder="所在公司"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldText
          label="邮箱"
          type="email"
          value={email}
          onChange={setEmail}
          required
          placeholder="name@company.com"
        />
        <FieldText
          label="电话"
          type="tel"
          value={phone}
          onChange={setPhone}
          required
          placeholder="+86 ..."
        />
      </div>

      <div>
        <label className="text-xs font-black uppercase tracking-widest text-neutral-700 mb-2 block">
          需求说明
        </label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="例：12 国分支机构 SD-WAN 升级，预算 200w，希望 Q3 完成。"
          className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-brand-500 focus:outline-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
        <FieldText
          label="验证码"
          value={captchaInput}
          onChange={setCaptchaInput}
          required
          placeholder="输入图中字符"
        />
        <div className="flex items-center gap-2">
          {captcha ? (
            <img
              src={captcha.svg}
              alt="captcha"
              className="h-12 rounded-xl border border-neutral-200 bg-white cursor-pointer"
              onClick={loadCaptcha}
            />
          ) : (
            <div className="h-12 w-[120px] rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-400">
              {captchaLoading ? <Loader2 size={16} className="animate-spin" /> : "—"}
            </div>
          )}
          <button
            type="button"
            onClick={loadCaptcha}
            aria-label="刷新验证码"
            className="w-10 h-12 rounded-xl border border-neutral-200 text-neutral-500 hover:text-brand-600 hover:border-brand-300 transition-colors flex items-center justify-center"
          >
            <RefreshCw size={16} className={captchaLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !captcha}
        className="mt-2 inline-flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-brand-500/20 disabled:bg-neutral-300 disabled:shadow-none disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> 提交中
          </>
        ) : (
          <>
            <Send size={18} /> 提交咨询
          </>
        )}
      </button>

      {submit.kind === "success" && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          <CheckCircle2 size={18} className="shrink-0" />
          {submit.message}
        </div>
      )}
      {submit.kind === "error" && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          <AlertTriangle size={18} className="shrink-0" />
          {submit.message}
        </div>
      )}
    </form>
  );
}

interface FieldTextProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "email" | "tel";
}

function FieldText({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: FieldTextProps) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-widest text-neutral-700 mb-2 block">
        {label}
        {required && <span className="text-brand-600">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-brand-500 focus:outline-none text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
      />
    </div>
  );
}
