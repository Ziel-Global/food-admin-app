import Link from "next/link";
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

export function Avatar({ initials, color = "bg-ink text-lime" }: { initials: string; color?: string }) {
  return <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-bold ${color}`}>{initials}</span>;
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
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const styles = {
    primary: "bg-ink text-lime hover:bg-charcoal-soft",
    secondary: "border border-line-strong bg-card text-ink hover:bg-surface",
    ghost: "text-muted hover:bg-surface hover:text-ink",
    danger: "bg-[#fff0ed] text-red hover:bg-[#ffe6e1]",
  }[variant];
  const cls = `inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-bold transition ${styles}`;
  return href ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={cls}>
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

export function SearchBox({ placeholder = "Search…" }: { placeholder?: string }) {
  return (
    <label className="flex h-10 min-w-[200px] items-center gap-2 rounded-xl border border-line bg-card px-3 text-muted focus-within:border-ink">
      <Icons.search size={16} />
      <input
        placeholder={placeholder}
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
