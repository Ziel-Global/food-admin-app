"use client";

import { useState } from "react";
import { Button, Notice, PageTitle, Panel } from "@/components/ui";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Configuration"
        title="Platform settings"
        description="Manage platform defaults, regional operations, safety limits and communication preferences."
        action={<Button onClick={() => setSaved(true)}>Save settings</Button>}
      />
      {saved ? <Notice>Settings saved in this preview. Connect the settings API to persist them.</Notice> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Platform profile" description="Names and regional defaults">
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {[
              { label: "Platform name", placeholder: "Crave" },
              { label: "Support email", placeholder: "support@crave.app" },
              { label: "Default country", placeholder: "Choose at launch" },
              { label: "Currency", placeholder: "Set with launch region" },
              { label: "Timezone", placeholder: "Choose city timezone" },
              { label: "Default language", placeholder: "English" },
            ].map((field) => (
              <label key={field.label} className="text-[12px] font-bold text-ink">
                {field.label}
                <input
                  placeholder={field.placeholder}
                  className="mt-2 h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-[13px] font-normal outline-none focus:border-ink focus:bg-card"
                />
              </label>
            ))}
          </div>
        </Panel>

        <Panel title="Order & rider safeguards" description="Operational limits that protect customers and partners">
          <div className="divide-y divide-line">
            {[
              { title: "Restaurant response window", sub: "Escalate orders awaiting acceptance", value: "2 min" },
              { title: "Rider cash holding limit", sub: "Pause new COD offers above this amount", value: "Not set" },
              { title: "Customer cancellation policy", sub: "Configure before and after restaurant acceptance", value: "Review rules →" },
              { title: "Require delivery PIN", sub: "Confirm handoff for selected orders", value: "Optional" },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between gap-4 px-5 py-4">
                <span>
                  <span className="block text-[13px] font-bold text-ink">{item.title}</span>
                  <span className="mt-1 block text-[12px] text-muted">{item.sub}</span>
                </span>
                <button className="rounded-xl border border-line-strong px-3 py-2 text-[11px] font-semibold text-muted hover:bg-surface">
                  {item.value}
                </button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Payment methods" description="Online gateways will be configured after cash-on-delivery flows">
          <div className="space-y-3 p-5">
            {[
              { name: "Cash on delivery", status: "Available for launch" },
              { name: "Card payments", status: "Add gateway later" },
              { name: "Wallet", status: "Not configured" },
            ].map((item, index) => (
              <div key={item.name} className="flex items-center gap-3 rounded-xl bg-surface p-3">
                <span
                  className={`grid size-9 place-items-center rounded-lg text-[12px] font-bold ${
                    index === 0 ? "bg-lime text-ink" : "bg-card text-muted border border-line"
                  }`}
                >
                  {index === 0 ? "✓" : "＋"}
                </span>
                <span className="flex-1 text-[13px] font-bold text-ink">{item.name}</span>
                <span className="text-[12px] text-muted">{item.status}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Notifications" description="Service channels and escalation settings">
          <div className="divide-y divide-line">
            {["Order placed and status updates", "Restaurant order alerts", "Rider offer expiry", "Support ticket assignment"].map((item) => (
              <label key={item} className="flex items-center justify-between px-5 py-4 text-[13px] font-semibold text-ink">
                {item}
                <input type="checkbox" defaultChecked className="size-4 accent-ink" />
              </label>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
