"use client";

import { useState } from "react";
import { Button, Notice, PageTitle, Panel } from "@/components/ui";

export default function PricingPage() {
  const [saved, setSaved] = useState(false);
  const [commission, setCommission] = useState("");

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Configuration"
        title="Pricing & delivery zones"
        description="Set platform fees, commission defaults, city currencies and dispatch coverage. Rates remain configurable by restaurant."
        action={<Button onClick={() => setSaved(true)}>Save changes</Button>}
      />
      {saved ? <Notice>Preview settings saved locally. Connect the settings API to persist them.</Notice> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Platform fee defaults" description="These defaults apply only when a city or restaurant has no override">
          <div className="space-y-4 p-5 sm:p-6">
            {[
              { label: "Default restaurant commission", value: commission, set: setCommission, suffix: "%", help: "Restaurant-specific commission rates take precedence." },
              { label: "Service fee", value: "", set: () => {}, suffix: "local currency", help: "Shown to customers at checkout." },
              { label: "Tax rate", value: "", set: () => {}, suffix: "%", help: "Tax rules depend on the launch country." },
              { label: "Base delivery fee", value: "", set: () => {}, suffix: "local currency", help: "Delivery zone values can override this default." },
            ].map((field) => (
              <label key={field.label} className="block">
                <span className="text-[12px] font-bold text-ink">{field.label}</span>
                <div className="mt-2 flex">
                  <input
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    placeholder="Not configured"
                    className="h-11 flex-1 rounded-l-xl border border-r-0 border-line-strong bg-surface px-3 text-[13px] outline-none focus:border-ink focus:bg-card"
                  />
                  <span className="flex min-w-28 items-center justify-center rounded-r-xl border border-line-strong bg-card px-2 text-[11px] text-muted">
                    {field.suffix}
                  </span>
                </div>
                <span className="mt-1.5 block text-[11px] text-soft">{field.help}</span>
              </label>
            ))}
          </div>
        </Panel>

        <Panel title="Dispatch policy" description="Control how delivery offers are sent to riders">
          <div className="space-y-4 p-5 sm:p-6">
            {[
              { label: "Initial rider search radius", value: "5", unit: "km" },
              { label: "Offer response time", value: "30", unit: "seconds" },
              { label: "Maximum offer attempts", value: "5", unit: "riders" },
              { label: "Idle rider timeout", value: "10", unit: "minutes" },
            ].map((field) => (
              <label key={field.label} className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-ink">{field.label}</span>
                <span className="flex items-center gap-2">
                  <input
                    defaultValue={field.value}
                    className="h-10 w-20 rounded-xl border border-line-strong bg-surface px-2 text-center text-[13px] outline-none focus:border-ink"
                  />
                  <span className="w-16 text-[11px] text-muted">{field.unit}</span>
                </span>
              </label>
            ))}
            <div className="rounded-xl bg-surface p-3 text-[12px] leading-5 text-muted">
              When no rider accepts, the search radius widens and the dispatch queue appears here for operations review.
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Configured cities & zones" description="Local currency and service boundaries are set per launch city" action={<Button variant="secondary">Add city +</Button>}>
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { city: "Central City", country: "Launch city", currency: "Not set", zones: "4 delivery zones" },
            { city: "North District", country: "Central City", currency: "Uses city currency", zones: "2 delivery zones" },
            { city: "West District", country: "Central City", currency: "Uses city currency", zones: "3 delivery zones" },
          ].map((zone) => (
            <div key={zone.city} className="rounded-2xl border border-line p-4 transition hover:border-ink/20 hover:shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold text-ink">{zone.city}</p>
                <button className="text-soft">•••</button>
              </div>
              <p className="mt-2 text-[12px] text-muted">
                {zone.country} · {zone.currency}
              </p>
              <p className="mt-4 text-[12px] font-semibold text-ink">{zone.zones} →</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
