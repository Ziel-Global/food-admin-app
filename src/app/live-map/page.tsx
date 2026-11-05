"use client";

import { useState } from "react";
import { Badge, Button, PageTitle, Panel, Person, SearchBox, SelectField, StatCard } from "@/components/ui";
import { Icons } from "@/components/icons";

const riders = [
  { name: "Sam Rivera", order: "FD-2047", zone: "Central · 0.8 km from pickup", initials: "SR", status: "On delivery" },
  { name: "Nora Ali", order: "FD-2045", zone: "North · 1.4 km from restaurant", initials: "NA", status: "On delivery" },
  { name: "Jules Park", order: "Available", zone: "Central · online 18 min", initials: "JP", status: "Active" },
  { name: "Mika Shah", order: "Available", zone: "West · online 32 min", initials: "MS", status: "Active" },
];

const zoneOptions = ["All zones", "Central", "North", "West"];

export default function LiveMapPage() {
  const [zone, setZone] = useState("All zones");

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Dispatch"
        title="Live map"
        description="View active riders and deliveries across service zones."
        action={
          <div className="flex items-center gap-2">
            <SelectField
              value={zone}
              onChange={setZone}
              options={zoneOptions}
              size="sm"
              className="w-[150px]"
            />
            <Button variant="secondary">Refresh ⟳</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Online riders" value="124" tone="lime" />
        <StatCard label="Active deliveries" value="86" tone="orange" />
        <StatCard label="Unassigned orders" value="18" tone="ink" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Panel
          title="Rider coverage"
          description={`${zone} · Map provider will be connected when city is selected`}
          action={<span className="rounded-lg bg-lime px-2.5 py-1.5 text-[10px] font-bold text-ink">Map preview</span>}
        >
          <div
            className="relative min-h-[470px] overflow-hidden bg-[#ececec]"
            style={{
              backgroundImage:
                "linear-gradient(34deg, transparent 47%, #fff 48%, #fff 51%, transparent 52%), linear-gradient(112deg, transparent 38%, #fff 39%, #fff 42%, transparent 43%), linear-gradient(6deg, transparent 67%, #fff 68%, #fff 70%, transparent 71%), linear-gradient(90deg, rgba(17,17,17,.04) 1px, transparent 1px), linear-gradient(rgba(17,17,17,.04) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 100% 100%, 100% 100%, 36px 36px, 36px 36px",
            }}
          >
            <div className="absolute left-[20%] top-[23%] grid size-11 place-items-center rounded-full border-4 border-white bg-ink text-lime shadow-lg">
              <Icons.riders size={16} />
            </div>
            <div className="absolute left-[62%] top-[18%] grid size-11 place-items-center rounded-full border-4 border-white bg-ink text-lime shadow-lg">
              <Icons.riders size={16} />
            </div>
            <div className="absolute left-[44%] top-[48%] grid size-11 place-items-center rounded-full border-4 border-white bg-orange text-white shadow-lg">
              <Icons.orders size={14} />
            </div>
            <div className="absolute left-[75%] top-[68%] grid size-11 place-items-center rounded-full border-4 border-white bg-ink text-lime shadow-lg">
              <Icons.riders size={16} />
            </div>
            <div className="absolute left-[28%] top-[72%] size-3 rounded-full bg-red ring-4 ring-white/80" />
            <div className="absolute bottom-4 left-4 flex gap-4 rounded-xl bg-card/95 px-4 py-2.5 text-[11px] shadow-sm backdrop-blur">
              <span className="flex items-center gap-1.5">
                <i className="size-2 rounded-full bg-ink" />
                Available rider
              </span>
              <span className="flex items-center gap-1.5">
                <i className="size-2 rounded-full bg-orange" />
                On delivery
              </span>
              <span className="flex items-center gap-1.5">
                <i className="size-2 rounded-full bg-red" />
                Restaurant
              </span>
            </div>
          </div>
        </Panel>

        <Panel title="Riders nearby" description="Updated moments ago" action={<SearchBox placeholder="Find a rider…" />}>
          <div className="divide-y divide-line">
            {riders.map((rider) => (
              <div key={rider.name} className="flex items-center gap-3 px-4 py-4">
                <Person initials={rider.initials} name={rider.name} meta={rider.zone} />
                <span className="ml-auto">
                  <Badge label={rider.status === "Active" ? "Active" : "On delivery"} />
                </span>
              </div>
            ))}
          </div>
          <div className="p-4">
            <Button variant="secondary">Dispatch queue →</Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
