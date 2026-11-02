"use client";

import { useState } from "react";
import { Badge, Button, PageTitle, Panel, Person, SelectPill, StatCard, Table, TableCell } from "@/components/ui";

const seed = [
  { id: "TK-4108", subject: "Missing side from order", customer: "Maya Chen", category: "Missing item", order: "FD-2041", age: "4 min", status: "Open" },
  { id: "TK-4107", subject: "Rider could not find address", customer: "Noah Williams", category: "Delivery", order: "FD-2039", age: "18 min", status: "In progress" },
  { id: "TK-4106", subject: "Charged twice for order", customer: "Hana Kim", category: "Payment", order: "FD-2033", age: "1 hour", status: "Open" },
  { id: "TK-4105", subject: "Food arrived cold", customer: "Luca Moretti", category: "Quality", order: "FD-2028", age: "Yesterday", status: "Resolved" },
];

export default function SupportPage() {
  const [rows, setRows] = useState(seed);
  const [filter, setFilter] = useState("All");
  const visible = rows.filter((row) => filter === "All" || row.status === filter);

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Care"
        title="Support tickets"
        description="Triage delivery issues, assign owners, and record resolution decisions."
        action={<Button variant="secondary">Ticket rules ⚙</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Open tickets" value={rows.filter((r) => r.status === "Open").length.toString()} tone="orange" />
        <StatCard label="In progress" value={rows.filter((r) => r.status === "In progress").length.toString()} tone="blue" />
        <StatCard label="Average first reply" value="6 min" tone="lime" />
      </div>

      <Panel
        title="Customer care queue"
        description="Tickets linked to order timelines"
        action={<SelectPill options={["All", "Open", "In progress", "Resolved"]} selected={filter} onSelect={setFilter} />}
      >
        <Table headers={["Ticket", "Customer", "Issue", "Order", "Age", "Status", "Assigned", ""]}>
          {visible.map((row) => (
            <tr key={row.id} className="transition hover:bg-surface/70">
              <TableCell>
                <span className="font-bold text-ink">{row.id}</span>
                <span className="mt-1 block text-[11px] text-muted">{row.category}</span>
              </TableCell>
              <TableCell>
                <Person initials={row.customer.split(" ").map((x) => x[0]).join("")} name={row.customer} meta="Customer" />
              </TableCell>
              <TableCell>{row.subject}</TableCell>
              <TableCell>{row.order}</TableCell>
              <TableCell>{row.age}</TableCell>
              <TableCell>
                <Badge label={row.status} />
              </TableCell>
              <TableCell>{row.status === "Open" ? "Unassigned" : "Care team"}</TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setRows((current) =>
                      current.map((item) =>
                        item.id === row.id ? { ...item, status: item.status === "Resolved" ? "Open" : "Resolved" } : item,
                      ),
                    )
                  }
                >
                  {row.status === "Resolved" ? "Reopen" : "Resolve"}
                </Button>
              </TableCell>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
