"use client";

import { useState } from "react";
import { Badge, Button, Notice, PageTitle, Panel, Table, TableCell } from "@/components/ui";

const seed = [
  { ref: "PO-73081", account: "Olive & Thyme", type: "Restaurant", period: "Oct 20 – Oct 26", gross: "184,200", deductions: "36,840", net: "147,360", status: "Pending" },
  { ref: "PO-73080", account: "Northside Grill", type: "Restaurant", period: "Oct 20 – Oct 26", gross: "152,400", deductions: "—", net: "121,920", status: "Processing" },
  { ref: "PO-73079", account: "Sam Rivera", type: "Rider", period: "Oct 20 – Oct 26", gross: "18,460", deductions: "2,800 cash", net: "15,660", status: "Paid" },
  { ref: "PO-73078", account: "Little Saffron", type: "Restaurant", period: "Oct 13 – Oct 19", gross: "210,500", deductions: "42,100", net: "168,400", status: "Paid" },
];

export default function PayoutsPage() {
  const [rows, setRows] = useState(seed);
  const [notice, setNotice] = useState("");

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Finance / Payouts"
        title="Payouts & settlements"
        description="Review restaurant and rider balances, payout status, and cash collected by riders."
        action={<Button variant="secondary">Export statement ↓</Button>}
      />
      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Pending payouts", value: "312,840" },
          { label: "Processing", value: "121,920" },
          { label: "Paid this week", value: "2.48m" },
          { label: "Rider cash outstanding", value: "46,200" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-line bg-card p-4">
            <p className="text-[12px] text-muted">{m.label}</p>
            <p className="font-display mt-2 text-xl font-bold text-ink">{m.value}</p>
            <p className="mt-1 text-[11px] text-soft">Configured local currency</p>
          </div>
        ))}
      </div>

      <Panel
        title="Payout ledger"
        description="Append-only ledger entries are the source for balances"
        action={
          <Button onClick={() => setNotice("Payout batch prepared in the preview. Connect the payout provider before processing real transfers.")}>
            Prepare payout batch
          </Button>
        }
      >
        <Table headers={["Reference", "Payee", "Period", "Gross", "Deductions", "Net", "Status", ""]}>
          {rows.map((row) => (
            <tr key={row.ref} className="transition hover:bg-surface/70">
              <TableCell>
                <span className="font-bold text-ink">{row.ref}</span>
              </TableCell>
              <TableCell>
                <span className="font-bold text-ink">{row.account}</span>
                <span className="mt-1 block text-[11px] text-muted">{row.type}</span>
              </TableCell>
              <TableCell>{row.period}</TableCell>
              <TableCell>{row.gross}</TableCell>
              <TableCell>{row.deductions}</TableCell>
              <TableCell className="font-bold text-ink">{row.net}</TableCell>
              <TableCell>
                <Badge label={row.status} />
              </TableCell>
              <TableCell>
                {row.status === "Pending" ? (
                  <Button onClick={() => setRows((current) => current.map((item) => (item.ref === row.ref ? { ...item, status: "Processing" } : item)))}>
                    Process
                  </Button>
                ) : (
                  <Button variant="secondary">Statement</Button>
                )}
              </TableCell>
            </tr>
          ))}
        </Table>
      </Panel>
      <div className="rounded-2xl border border-line bg-surface p-4 text-[12px] leading-5 text-muted">
        Rider COD cash is reconciled against earnings and recorded as a settlement entry. Never overwrite ledger balances; use reversing entries for corrections.
      </div>
    </div>
  );
}
