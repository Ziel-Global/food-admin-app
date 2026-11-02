"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AdminLogin() {
  const [show, setShow] = useState(false);

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-charcoal text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0">
          <Image src="/images/login-hero.jpg" alt="" fill className="object-cover opacity-35" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/92 to-charcoal/70" />
          <div className="absolute inset-0 crave-grid opacity-40" />
          <div className="absolute -left-20 top-24 size-72 rounded-full bg-lime/20 blur-3xl" />
          <div className="absolute bottom-10 right-0 size-80 rounded-full bg-lime/10 blur-3xl" />
        </div>

        <div className="relative z-10 p-12">
          <Link href="/" className="inline-flex">
            <Image
              src="/brand/crave-logo-white.png"
              alt="Crave"
              width={160}
              height={54}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        <div className="relative z-10 max-w-xl px-12 pb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-lime">Platform command center</p>
          <h1 className="font-display mt-5 text-5xl font-bold leading-[1.05] tracking-[-0.05em]">
            Good operations make great delivery.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-white/60">
            One premium workspace to support every customer, restaurant, and rider on Crave.
          </p>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-6 px-12 pb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Crave · Operations</p>
          <Image
            src="/images/lime-scooter.png"
            alt=""
            width={180}
            height={180}
            className="h-28 w-auto object-contain opacity-90"
          />
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <form
          className="w-full max-w-[420px] rounded-[28px] border border-line bg-card p-8 shadow-[0_24px_80px_rgba(17,17,17,0.08)] sm:p-10"
          onSubmit={(event) => {
            event.preventDefault();
            window.location.href = "/";
          }}
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="rounded-xl bg-charcoal px-3 py-2">
              <Image src="/brand/crave-logo-white.png" alt="Crave" width={100} height={34} className="h-6 w-auto" />
            </div>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Administrator access</p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink">Welcome back</h2>
          <p className="mt-2 text-[13px] text-muted">Sign in to your Crave platform workspace.</p>

          <label className="mt-8 block text-[12px] font-bold text-ink">
            Work email
            <input
              type="email"
              required
              placeholder="you@crave.app"
              className="mt-2 h-12 w-full rounded-xl border border-line-strong bg-surface px-4 text-[13px] outline-none transition focus:border-ink focus:bg-card"
            />
          </label>

          <label className="mt-4 block text-[12px] font-bold text-ink">
            Password
            <span className="relative mt-2 block">
              <input
                type={show ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-line-strong bg-surface px-4 pr-16 text-[13px] outline-none transition focus:border-ink focus:bg-card"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-3.5 text-[12px] font-semibold text-muted hover:text-ink"
              >
                {show ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          <div className="mt-4 flex items-center justify-between text-[12px]">
            <label className="flex items-center gap-2 text-muted">
              <input type="checkbox" className="size-4 accent-ink" />
              Remember me
            </label>
            <a href="#" className="font-bold text-ink hover:underline">
              Forgot password?
            </a>
          </div>

          <button className="mt-7 h-12 w-full rounded-xl bg-ink text-[13px] font-bold text-lime transition hover:bg-charcoal-soft">
            Sign in securely
          </button>
          <p className="mt-5 text-center text-[11px] text-soft">
            Administrator accounts are provisioned by the platform owner.
          </p>
        </form>
      </section>
    </main>
  );
}
