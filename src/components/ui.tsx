"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icons } from "./icons";

export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lime">
          <span className="size-1.5 rounded-full bg-lime" />
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 text-[28px] font-bold tracking-[-0.04em] text-ink sm:text-[34px]">{title}</h1>
        <p className="mt-2 max-w-2xl text-[13px] leading-5 text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Metric({
  label,
  value,
  delta,
  note,
  icon,
  trend = "up",
}: {
  label: string;
  value: string;
  delta?: string;
  note?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <article className="group rounded-2xl border border-line bg-card p-5 transition hover:border-charcoal/15 hover:shadow-[0_12px_40px_rgba(17,17,17,0.06)]">
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-medium text-muted">{label}</p>
        <span className="grid size-10 place-items-center rounded-xl bg-ink text-lime transition group-hover:scale-105">
          {icon}
        </span>
      </div>
      <p className="font-display mt-4 text-[28px] font-bold tracking-[-0.045em] text-ink">{value}</p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`rounded-md px-2 py-1 text-[10px] font-bold ${
            trend === "up"
              ? "bg-lime-soft text-ink"
              : trend === "down"
                ? "bg-[#ffe8e0] text-red"
                : "bg-surface text-muted"
          }`}
        >
          {delta ?? "—"}
        </span>
        <span className="text-[11px] text-soft">{note ?? "Compared with prior period"}</span>
      </div>
    </article>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-line bg-card shadow-[0_10px_30px_rgba(17,17,17,0.03)] ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[linear-gradient(180deg,#fbfef4_0%,#ffffff_100%)] px-5 py-4 sm:px-6">
        <div className="flex gap-3">
          <span className="mt-1 h-8 w-1 shrink-0 rounded-full bg-lime" />
          <div>
            <h2 className="font-display text-[15px] font-bold tracking-tight text-ink">{title}</h2>
            {description ? <p className="mt-1 text-[12px] text-muted">{description}</p> : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const tones: Record<string, string> = {
  New: "bg-[#fff3e6] text-[#a76225]",
  Placed: "bg-[#fff3e6] text-[#a76225]",
  Pending: "bg-[#fff3e6] text-[#a76225]",
  Preparing: "bg-[#eaf1ff] text-[#506a9f]",
  Accepted: "bg-[#eaf1ff] text-[#506a9f]",
  Active: "bg-lime-soft text-ink",
  Delivered: "bg-lime-soft text-ink",
  Ready: "bg-[#e8f4f0] text-[#347762]",
  "Ready for pickup": "bg-[#e8f4f0] text-[#347762]",
  Rejected: "bg-[#fcebea] text-[#ad5752]",
  Blocked: "bg-[#fcebea] text-[#ad5752]",
  Suspended: "bg-[#fcebea] text-[#ad5752]",
  Paid: "bg-lime-soft text-ink",
  Processing: "bg-[#eaf1ff] text-[#506a9f]",
  Open: "bg-[#fff3e6] text-[#a76225]",
  Resolved: "bg-lime-soft text-ink",
  Closed: "bg-surface text-muted",
  Paused: "bg-surface text-muted",
  Cancelled: "bg-[#fcebea] text-[#ad5752]",
  "In progress": "bg-[#eaf1ff] text-[#506a9f]",
  "On delivery": "bg-[#fff3e6] text-[#a76225]",
  Success: "bg-lime-soft text-ink",
  Failed: "bg-[#fcebea] text-[#ad5752]",
  Warning: "bg-[#fff3e6] text-[#a76225]",
};

export function Badge({ label }: { label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${tones[label] ?? "bg-surface text-muted"}`}>
      {label}
    </span>
  );
}

export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-[#f4f8eb]">
            {headers.map((header) => (
              <th key={header} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#6f7a63]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line [&_tr]:transition [&_tr:hover]:bg-[#f8fbee]">{children}</tbody>
      </table>
    </div>
  );
}

export function TableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-4 align-middle text-[13px] text-[#555] ${className}`}>{children}</td>;
}

export function Avatar({
  initials,
  color = "bg-ink text-lime",
  className = "size-9 text-[11px]",
}: {
  initials: string;
  color?: string;
  className?: string;
}) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-bold ${color} ${className}`}>
      {initials}
    </span>
  );
}

export function Person({ initials, name, meta }: { initials: string; name: string; meta: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar initials={initials} />
      <span>
        <span className="block text-[13px] font-semibold text-ink">{name}</span>
        <span className="mt-0.5 block text-[11px] text-muted">{meta}</span>
      </span>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  form,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  form?: string;
}) {
  const styles = {
    primary: "bg-ink text-lime hover:bg-charcoal-soft disabled:opacity-50",
    secondary: "border border-line-strong bg-card text-ink hover:bg-surface disabled:opacity-50",
    ghost: "text-muted hover:bg-surface hover:text-ink disabled:opacity-50",
    danger: "bg-[#fff0ed] text-red hover:bg-[#ffe6e1] disabled:opacity-50",
  }[variant];
  const cls = `inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-bold transition disabled:pointer-events-none ${styles} ${className}`;
  return href ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <button type={type} form={form} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function SelectPill({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="inline-flex rounded-xl bg-[#eef3e4] p-1 ring-1 ring-[#dbe5cc]">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${
            selected === option ? "bg-ink text-lime shadow-sm" : "text-muted hover:bg-white/70 hover:text-ink"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function SearchBox({
  placeholder = "Search…",
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="flex h-10 min-w-[200px] items-center gap-2 rounded-xl border border-line bg-card px-3 text-muted focus-within:border-ink">
      <Icons.search size={16} />
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-soft"
      />
    </label>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-ink text-lime">
        <Icons.orders size={20} />
      </div>
      <p className="mt-4 text-[14px] font-bold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-[12px] leading-5 text-muted">{description}</p>
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-line bg-surface px-3 py-2 text-[12px] leading-5 text-muted">{children}</p>;
}

const statTones = {
  lime: { value: "text-ink", chip: "bg-ink text-lime", dot: "bg-lime" },
  orange: { value: "text-orange", chip: "bg-ink text-orange", dot: "bg-orange" },
  blue: { value: "text-[#4a63a0]", chip: "bg-ink text-[#9db4ff]", dot: "bg-[#6b86c9]" },
  ink: { value: "text-ink", chip: "bg-ink text-lime", dot: "bg-ink" },
} as const;

export function StatCard({
  label,
  value,
  accent,
  tone = "lime",
  icon,
}: {
  label: string;
  value: string;
  accent?: string;
  tone?: keyof typeof statTones;
  icon?: React.ReactNode;
}) {
  const t = statTones[tone];
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_8px_24px_rgba(17,17,17,0.03)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`size-1.5 rounded-full ${t.dot}`} />
          <p className="text-[12px] font-medium text-muted">{label}</p>
        </div>
        {icon ? <span className={`grid size-8 place-items-center rounded-lg ${t.chip}`}>{icon}</span> : null}
      </div>
      <p className={`font-display mt-3 text-2xl font-bold tracking-tight ${accent ?? t.value}`}>{value}</p>
    </div>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="rounded-xl border border-lime/40 bg-lime-soft px-4 py-3 text-[12px] font-semibold text-ink">
      {children}
    </p>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  required,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">
        {label}
        {required ? <span className="text-orange">*</span> : null}
      </span>
      {children}
      {error ? <span className="block text-[11px] font-medium text-red">{error}</span> : null}
      {!error && hint ? <span className="block text-[11px] leading-4 text-soft">{hint}</span> : null}
    </label>
  );
}

const controlClass =
  "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[13px] text-ink outline-none transition placeholder:text-soft focus:border-ink focus:ring-2 focus:ring-ink/5 disabled:bg-surface";

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  name,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "number";
  required?: boolean;
  name?: string;
  autoFocus?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      required={required}
      autoFocus={autoFocus}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={controlClass}
    />
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = "Select…",
  className = "",
  required,
  name,
  size = "md",
}: {
  label?: string;
  value: string;
  options: string[] | { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  name?: string;
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuBox, setMenuBox] = useState<{ top: number; left: number; width: number; openUp: boolean } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
  const selected = normalized.find((option) => option.value === value);

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateMenuBox() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const estimatedHeight = Math.min(normalized.length * 44 + 16, 320);
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < estimatedHeight && rect.top > spaceBelow;
    setMenuBox({
      top: openUp ? rect.top - 8 : rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 160),
      openUp,
    });
  }

  useEffect(() => {
    if (!open) return;
    updateMenuBox();
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onReposition() {
      updateMenuBox();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, normalized.length]);

  const menu =
    open && menuBox && mounted
      ? createPortal(
          <div
            ref={menuRef}
            id={listId}
            role="listbox"
            aria-label={label ?? "Options"}
            style={{
              position: "fixed",
              top: menuBox.openUp ? undefined : menuBox.top,
              bottom: menuBox.openUp ? window.innerHeight - menuBox.top : undefined,
              left: menuBox.left,
              width: menuBox.width,
            }}
            className="z-[120] max-h-80 overflow-y-auto rounded-2xl border border-line bg-card p-1.5 shadow-[0_24px_60px_rgba(17,17,17,0.22)]"
          >
            {normalized.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${
                    active ? "bg-ink text-lime" : "font-medium text-ink hover:bg-surface"
                  }`}
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-md ${
                      active ? "bg-lime text-ink" : "bg-surface text-transparent ring-1 ring-line"
                    }`}
                  >
                    <Icons.check size={12} />
                  </span>
                  <span className={`truncate ${active ? "font-bold" : ""}`}>{option.label}</span>
                </button>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label ? <p className="text-[12px] font-bold text-ink">{label}</p> : null}
      {name ? <input type="hidden" name={name} value={value} readOnly /> : null}
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-required={required || undefined}
        onClick={() => setOpen((current) => !current)}
        className={`${label ? "mt-2" : ""} flex w-full items-center justify-between gap-3 rounded-xl border bg-white text-left transition ${
          size === "sm" ? "h-10 px-3 text-[12px]" : "h-11 px-3.5 text-[13px]"
        } ${
          open
            ? "border-ink shadow-[0_0_0_3px_rgba(200,255,0,0.18)]"
            : "border-line hover:border-ink/40 focus:border-ink"
        }`}
      >
        <span className={`truncate ${selected ? "font-semibold text-ink" : "text-soft"}`}>
          {selected?.label ?? placeholder}
        </span>
        <span
          className={`grid shrink-0 place-items-center rounded-lg transition ${
            size === "sm" ? "size-6" : "size-7"
          } ${open ? "bg-ink text-lime" : "bg-surface text-muted ring-1 ring-line"}`}
        >
          <Icons.chevron size={14} className={`transition ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {menu}
    </div>
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
  name,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  name?: string;
}) {
  return (
    <textarea
      name={name}
      value={value}
      required={required}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full resize-none rounded-xl border border-line bg-white px-3.5 py-3 text-[13px] text-ink outline-none transition placeholder:text-soft focus:border-ink focus:ring-2 focus:ring-ink/5"
    />
  );
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  icon,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg";
  icon?: React.ReactNode;
}) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const width = size === "lg" ? "max-w-[640px]" : "max-w-[520px]";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6" role="presentation">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[#111111]/45 backdrop-blur-[2px] animate-fade-up"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 flex max-h-[min(92vh,820px)] w-full ${width} flex-col overflow-hidden rounded-t-[24px] border border-line bg-card shadow-[0_24px_80px_rgba(17,17,17,0.22)] outline-none animate-fade-up sm:rounded-[24px]`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line bg-[linear-gradient(180deg,#fbfef4_0%,#ffffff_100%)] px-5 py-4 sm:px-6">
          <div className="flex gap-3">
            <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-ink text-lime">
              {icon ?? <Icons.support size={16} />}
            </span>
            <div>
              <h2 id={titleId} className="font-display text-[17px] font-bold tracking-tight text-ink">
                {title}
              </h2>
              {description ? <p className="mt-1 text-[12px] leading-5 text-muted">{description}</p> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-line text-muted transition hover:bg-surface hover:text-ink"
            aria-label="Close"
          >
            <Icons.close size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer ? <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-[#fbfef4]/80 px-5 py-4 sm:px-6">{footer}</div> : null}
      </div>
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-[13px] font-bold text-ink">{title}</h3>
        {description ? <p className="mt-1 text-[12px] text-muted">{description}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
