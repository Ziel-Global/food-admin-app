"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icons } from "./icons";

const navigation = [
  { label: "Overview", href: "/", icon: Icons.overview, group: "Workspace" },
  { label: "Orders", href: "/orders", icon: Icons.orders, badge: "12" },
  { label: "Restaurants", href: "/restaurants", icon: Icons.restaurants },
  { label: "Riders", href: "/riders", icon: Icons.riders },
  { label: "Customers", href: "/customers", icon: Icons.customers },
  { label: "Live map", href: "/live-map", icon: Icons.map },
  { label: "Pricing & zones", href: "/pricing", icon: Icons.pricing, group: "Growth & finance" },
  { label: "Promotions", href: "/promotions", icon: Icons.promotions },
  { label: "Payouts", href: "/payouts", icon: Icons.payouts },
  { label: "Support", href: "/support", icon: Icons.support, group: "Platform" },
  { label: "Settings", href: "/settings", icon: Icons.settings },
];

const notifications = [
  {
    id: "n1",
    title: "12 orders need attention",
    body: "Delayed handoffs across Central City zones",
    time: "2 min ago",
    tone: "orange" as const,
    href: "/orders",
    icon: Icons.orders,
  },
  {
    id: "n2",
    title: "Support ticket escalated",
    body: "Customer refund request · #SUP-1842",
    time: "8 min ago",
    tone: "orange" as const,
    href: "/support",
    icon: Icons.support,
  },
  {
    id: "n3",
    title: "Rider capacity low",
    body: "North zone has 3 available riders",
    time: "14 min ago",
    tone: "lime" as const,
    href: "/riders",
    icon: Icons.riders,
  },
  {
    id: "n4",
    title: "Restaurant went offline",
    body: "Olive & Thyme paused accepting orders",
    time: "21 min ago",
    tone: "lime" as const,
    href: "/restaurants",
    icon: Icons.restaurants,
  },
];

type HeaderMenu = "notifications" | "profile" | null;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [headerMenu, setHeaderMenu] = useState<HeaderMenu>(null);
  const headerMenusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeaderMenu(null);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!headerMenusRef.current?.contains(event.target as Node)) {
        setHeaderMenu(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setHeaderMenu(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (pathname === "/login") return <>{children}</>;

  const current = navigation.find((item) => item.href === pathname);
  const unreadCount = notifications.length;

  return (
    <div className="min-h-screen bg-background text-ink">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-white/[0.06] bg-[#111111] text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="px-5 pb-4 pt-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-lime/40"
          >
            <span className="relative flex h-11 items-center overflow-hidden">
              <Image
                src="/brand/crave-logo-white.png"
                alt="Crave"
                width={148}
                height={50}
                className="h-[34px] w-auto object-contain object-left brightness-110 contrast-125"
                priority
              />
            </span>
          </Link>
          <div className="mt-3.5 flex items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-lime/50 via-white/10 to-transparent" />
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
              Admin
            </span>
          </div>
        </div>

        {/* Workspace */}
        <button
          type="button"
          className="mx-3 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 text-left transition hover:border-white/12 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/30"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-lime/15 text-lime ring-1 ring-lime/25">
            <Icons.map size={14} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-semibold tracking-tight">All locations</span>
            <span className="mt-0.5 block text-[10px] text-white/35">Platform workspace</span>
          </span>
          <Icons.chevron size={13} className="text-white/25" />
        </button>

        {/* Nav */}
        <nav className="sidebar-scroll mt-4 flex-1 space-y-0.5 overflow-y-auto px-2.5 pb-3" aria-label="Admin navigation">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <div key={item.href}>
                {item.group ? (
                  <p className="px-3 pb-2 pt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                    {item.group}
                  </p>
                ) : null}
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-lime/35 ${
                    active
                      ? "bg-white/[0.07] text-white"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white/90"
                  }`}
                >
                  {active ? (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-lime shadow-[0_0_12px_rgba(200,255,0,0.55)]" />
                  ) : null}
                  <span
                    className={`grid size-7 place-items-center rounded-lg transition ${
                      active
                        ? "bg-lime text-ink shadow-[0_0_16px_rgba(200,255,0,0.25)]"
                        : "text-white/40 group-hover:text-lime"
                    }`}
                  >
                    <Icon size={15} />
                  </span>
                  <span className={active ? "font-semibold" : ""}>{item.label}</span>
                  {item.badge ? (
                    <span
                      className={`ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                        active ? "bg-lime/20 text-lime" : "bg-white/[0.08] text-white/45"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Status */}
        <div className="mx-3 mb-2 rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-lime/50" />
              <span className="relative size-2 rounded-full bg-lime" />
            </span>
            <span className="text-[11px] font-semibold tracking-tight">Operations live</span>
          </div>
          <ApiHealth />
        </div>

        {/* User */}
        <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
          <div className="grid size-8 place-items-center rounded-full bg-lime text-[10px] font-bold text-ink">AM</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold tracking-tight">Alex Morgan</p>
            <p className="mt-0.5 truncate text-[10px] text-white/35">Super admin</p>
          </div>
          <Link
            href="/login"
            aria-label="Sign out"
            className="rounded-lg p-1.5 text-white/30 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/35"
          >
            <Icons.logout size={15} />
          </Link>
        </div>
      </aside>

      {open ? (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(200,255,0,0.08),transparent_28%),linear-gradient(180deg,#f3f5ef_0%,#eef1ea_100%)] lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/85 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-xl border border-line text-ink lg:hidden"
              aria-label="Open navigation"
            >
              <Icons.menu size={18} />
            </button>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Crave operations</p>
              <p className="mt-0.5 text-[14px] font-bold text-ink">{current?.label ?? "Admin workspace"}</p>
            </div>
          </div>
          <div ref={headerMenusRef} className="flex items-center gap-2 sm:gap-3">
            <div className="hidden h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-[12px] text-muted md:flex">
              <Icons.search size={15} />
              <span>Search anything</span>
              <kbd className="ml-6 rounded-md border border-line-strong bg-card px-1.5 py-0.5 text-[10px] font-semibold text-soft">
                ⌘K
              </kbd>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={headerMenu === "notifications"}
                aria-haspopup="dialog"
                onClick={() => setHeaderMenu((currentMenu) => (currentMenu === "notifications" ? null : "notifications"))}
                className={`relative grid size-10 place-items-center rounded-xl border text-ink transition ${
                  headerMenu === "notifications" ? "border-ink bg-surface" : "border-line hover:bg-surface"
                }`}
              >
                <Icons.bell size={17} />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-orange px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>

              {headerMenu === "notifications" ? (
                <div
                  role="dialog"
                  aria-label="Notifications"
                  className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-card shadow-[0_24px_60px_rgba(17,17,17,0.14)] animate-fade-up"
                >
                  <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <div>
                      <p className="text-[13px] font-bold text-ink">Notifications</p>
                      <p className="mt-0.5 text-[11px] text-muted">{unreadCount} items need review</p>
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setHeaderMenu(null)}
                      className="text-[11px] font-bold text-ink hover:underline"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="max-h-[22rem] overflow-y-auto">
                    {notifications.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setHeaderMenu(null)}
                          className="flex gap-3 border-b border-line px-4 py-3 transition last:border-b-0 hover:bg-surface"
                        >
                          <span
                            className={`mt-1 grid size-8 shrink-0 place-items-center rounded-xl ${
                              item.tone === "orange" ? "bg-[#fff1e9] text-orange" : "bg-lime-soft text-ink"
                            }`}
                          >
                            <Icon size={14} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-start justify-between gap-3">
                              <span className="text-[12px] font-bold text-ink">{item.title}</span>
                              <span className="shrink-0 text-[10px] text-soft">{item.time}</span>
                            </span>
                            <span className="mt-1 block truncate text-[11px] text-muted">{item.body}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={headerMenu === "profile"}
                aria-haspopup="menu"
                onClick={() => setHeaderMenu((currentMenu) => (currentMenu === "profile" ? null : "profile"))}
                className={`flex items-center gap-2 rounded-xl border px-1.5 py-1.5 transition sm:pr-2.5 ${
                  headerMenu === "profile" ? "border-ink bg-surface" : "border-line hover:bg-surface"
                }`}
              >
                <span className="grid size-8 place-items-center rounded-full bg-ink text-[11px] font-bold text-lime">
                  AM
                </span>
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block truncate text-[12px] font-bold text-ink">Alex Morgan</span>
                  <span className="block text-[10px] text-muted">Super admin</span>
                </span>
                <Icons.chevron
                  size={14}
                  className={`hidden text-muted transition sm:block ${headerMenu === "profile" ? "rotate-180" : ""}`}
                />
              </button>

              {headerMenu === "profile" ? (
                <div
                  role="menu"
                  aria-label="Profile menu"
                  className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-card shadow-[0_24px_60px_rgba(17,17,17,0.14)] animate-fade-up"
                >
                  <div className="border-b border-line px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-ink text-[12px] font-bold text-lime">
                        AM
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-ink">Alex Morgan</p>
                        <p className="mt-0.5 truncate text-[11px] text-muted">alex@crave.app</p>
                      </div>
                    </div>
                    <p className="mt-3 rounded-xl bg-surface px-3 py-2 text-[11px] text-muted">
                      Crave · Platform super admin
                    </p>
                  </div>

                  <div className="p-2">
                    {[
                      { href: "/settings", label: "Account settings", icon: Icons.settings },
                      { href: "/support", label: "Support inbox", icon: Icons.support },
                      { href: "/payouts", label: "Payouts", icon: Icons.payouts },
                      { href: "/live-map", label: "Live operations", icon: Icons.map },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setHeaderMenu(null)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-ink transition hover:bg-surface"
                        >
                          <span className="grid size-7 place-items-center rounded-lg bg-surface text-muted">
                            <Icon size={14} />
                          </span>
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-t border-line p-2">
                    <Link
                      href="/login"
                      role="menuitem"
                      onClick={() => setHeaderMenu(null)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-red transition hover:bg-[#fff0ed]"
                    >
                      <span className="grid size-7 place-items-center rounded-lg bg-[#fff0ed] text-red">
                        <Icons.logout size={14} />
                      </span>
                      Sign out
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="hidden h-9 items-center gap-2 rounded-full bg-ink px-3.5 text-[11px] font-bold text-lime sm:flex">
              <span className="size-1.5 rounded-full bg-lime animate-pulse-dot" />
              Live preview
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1480px] px-5 py-7 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

function ApiHealth() {
  const [state, setState] = useState<"checking" | "online" | "offline">("checking");
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
    fetch(`${base.replace(/\/$/, "")}/health`)
      .then((response) => setState(response.ok ? "online" : "offline"))
      .catch(() => setState("offline"));
  }, []);
  return (
    <p className="mt-2 text-[10px] leading-4 text-white/35">
      API{" "}
      <span className={state === "online" ? "text-lime" : state === "offline" ? "text-orange" : "text-white/50"}>
        {state === "checking" ? "checking…" : state === "online" ? "connected" : "not connected"}
      </span>
    </p>
  );
}
