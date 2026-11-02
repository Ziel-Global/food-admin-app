"use client";

import { useState } from "react";
import { Avatar, Badge, Button, Notice, PageTitle, Panel, SearchBox, StatCard, Table, TableCell } from "@/components/ui";

const users = [
  { name: "Maya Chen", phone: "+1 ••• ••• 4108", orders: "42", spent: "36,820", joined: "Jun 12, 2026", status: "Active" },
  { name: "Noah Williams", phone: "+1 ••• ••• 8821", orders: "18", spent: "14,540", joined: "Jul 04, 2026", status: "Active" },
  { name: "Amira Khan", phone: "+1 ••• ••• 2907", orders: "64", spent: "52,100", joined: "Apr 18, 2026", status: "Active" },
  { name: "Luca Moretti", phone: "+1 ••• ••• 6731", orders: "3", spent: "2,810", joined: "Oct 20, 2026", status: "Blocked" },
];

export default function CustomersPage() {
  const [rows, setRows] = useState(users);
  const [notice, setNotice] = useState("");

  function toggle(name: string) {
    setRows((items) =>
      items.map((item) => (item.name === name ? { ...item, status: item.status === "Active" ? "Blocked" : "Active" } : item)),
    );
    setNotice(`${name} access updated in this preview.`);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Customers"
        title="Customers"
        description="Review customer accounts and order history, and restrict accounts when needed."
        action={<Button variant="secondary">Export customers ↓</Button>}
      />
      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total customers" value="24,806" tone="ink" />
        <StatCard label="New this month" value="1,248" tone="lime" />
        <StatCard label="Repeat order rate" value="68.4%" tone="orange" />
      </div>

      <Panel title="Customer directory" description="Contact details are masked in this preview" action={<SearchBox placeholder="Name, phone, or ID…" />}>
        <Table headers={["Customer", "Phone", "Orders", "Order value", "Joined", "Status", ""]}>
          {rows.map((row) => (
            <tr key={row.name} className="transition hover:bg-surface/70">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar initials={row.name.split(" ").map((x) => x[0]).join("")} />
                  <span className="font-bold text-ink">{row.name}</span>
                </div>
              </TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.orders}</TableCell>
              <TableCell>
                {row.spent} <span className="text-[11px] text-soft">local currency</span>
              </TableCell>
              <TableCell>{row.joined}</TableCell>
              <TableCell>
                <Badge label={row.status} />
              </TableCell>
              <TableCell>
                <Button variant={row.status === "Active" ? "danger" : "secondary"} onClick={() => toggle(row.name)}>
                  {row.status === "Active" ? "Block" : "Unblock"}
                </Button>
              </TableCell>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
