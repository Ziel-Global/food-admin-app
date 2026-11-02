"use client";

import { useState } from "react";
import { Badge, Button, Notice, PageTitle, Panel, StatCard, Table, TableCell } from "@/components/ui";

type Promotion = { code: string; description: string; type: string; value: string; uses: string; status: "Active" | "Paused" };

const initial: Promotion[] = [
  { code: "WELCOME15", description: "New customer first order", type: "Percentage", value: "15%", uses: "284 / 500", status: "Active" },
  { code: "FREESHIP", description: "Delivery fee discount", type: "Free delivery", value: "—", uses: "1,042 / 2,000", status: "Active" },
  { code: "LUNCH10", description: "Weekday lunch offer", type: "Fixed amount", value: "10 local", uses: "96 / 250", status: "Paused" },
];

export default function PromotionsPage() {
  const [rows, setRows] = useState(initial);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [kind, setKind] = useState("Percentage");
  const [notice, setNotice] = useState("");

  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRows((current) => [
      {
        code: code.toUpperCase(),
        description: "Platform promotion",
        type: kind,
        value: kind === "Free delivery" ? "—" : "Not set",
        uses: "0 / —",
        status: "Active",
      },
      ...current,
    ]);
    setCode("");
    setOpen(false);
    setNotice("Promotion added to the preview list.");
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Growth / Promotions"
        title="Promotions"
        description="Create platform-wide or restaurant-specific discounts and monitor redemption limits."
        action={<Button onClick={() => setOpen(!open)}>{open ? "Close" : "Create promotion +"}</Button>}
      />
      {notice ? <Notice>{notice}</Notice> : null}

      {open ? (
        <form onSubmit={add} className="grid gap-3 rounded-2xl border border-line bg-card p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="text-[12px] font-bold text-ink">
            Promotion code
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. WELCOME20"
              className="mt-2 h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-[13px] uppercase outline-none focus:border-ink"
            />
          </label>
          <label className="text-[12px] font-bold text-ink">
            Discount type
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-line-strong bg-card px-3 text-[13px] outline-none"
            >
              <option>Percentage</option>
              <option>Fixed amount</option>
              <option>Free delivery</option>
            </select>
          </label>
          <Button type="submit">Add promotion</Button>
        </form>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Active promotions" value={rows.filter((row) => row.status === "Active").length.toString()} tone="lime" />
        <StatCard label="Redemptions this month" value="1,422" tone="orange" />
        <StatCard label="Discounts funded" value="Configured" tone="ink" />
      </div>

      <Panel title="Promotion codes" description="Track start and expiry dates, use limits and eligibility">
        <Table headers={["Code", "Description", "Discount", "Redemptions", "Status", ""]}>
          {rows.map((row) => (
            <tr key={row.code} className="transition hover:bg-surface/70">
              <TableCell>
                <span className="rounded-lg bg-ink px-2.5 py-1 font-mono text-[11px] font-bold text-lime">{row.code}</span>
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                {row.type} · {row.value}
              </TableCell>
              <TableCell>{row.uses}</TableCell>
              <TableCell>
                <Badge label={row.status} />
              </TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setRows((current) =>
                      current.map((item) =>
                        item.code === row.code ? { ...item, status: item.status === "Active" ? "Paused" : "Active" } : item,
                      ),
                    )
                  }
                >
                  {row.status === "Active" ? "Pause" : "Activate"}
                </Button>
              </TableCell>
            </tr>
          ))}
        </Table>
      </Panel>
      <p className="text-[12px] text-muted">Discount values and eligibility should be confirmed before the campaign is published.</p>
    </div>
  );
}
