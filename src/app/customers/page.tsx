"use client";

import { useEffect, useState } from "react";
import { Avatar, Badge, Button, Notice, PageTitle, Panel, SearchBox, StatCard, Table, TableCell } from "@/components/ui";
import { initials, listCustomers, upsertCustomer, type Customer } from "@/lib/customers";

export default function CustomersPage() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setRows(listCustomers());
  }, []);

  function toggle(id: string) {
    setRows((items) => {
      const next = items.map((item) =>
        item.id === id ? { ...item, status: item.status === "Active" ? ("Blocked" as const) : ("Active" as const) } : item,
      );
      const updated = next.find((item) => item.id === id);
      if (updated) {
        upsertCustomer(updated);
        setNotice(`${updated.name} access updated in this preview.`);
      }
      return next;
    });
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
            <tr key={row.id} className="transition hover:bg-surface/70">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar initials={initials(row.name)} />
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
                <div className="flex items-center justify-end gap-2">
                  <Button variant="secondary" href={`/customers/${row.id}`}>
                    View
                  </Button>
                  <Button variant={row.status === "Active" ? "danger" : "secondary"} onClick={() => toggle(row.id)}>
                    {row.status === "Active" ? "Block" : "Unblock"}
                  </Button>
                </div>
              </TableCell>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
