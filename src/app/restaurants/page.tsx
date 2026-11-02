"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Notice, PageTitle, Panel, Person, SearchBox, SelectPill, StatCard, Table, TableCell } from "@/components/ui";

const seed = [
  { name: "Olive & Thyme", owner: "Mina Patel", cuisine: "Mediterranean", city: "Central City", status: "Active", orders: "148", rate: "—" },
  { name: "Northside Grill", owner: "Ethan Brooks", cuisine: "American", city: "North District", status: "Active", orders: "122", rate: "—" },
  { name: "Saffron House", owner: "Amira Hassan", cuisine: "South Asian", city: "Central City", status: "Pending", orders: "—", rate: "—" },
  { name: "Green Bowl Co.", owner: "Leo Martin", cuisine: "Healthy", city: "West District", status: "Pending", orders: "—", rate: "—" },
  { name: "Red Crust Pizza", owner: "Sofia Rossi", cuisine: "Italian", city: "South District", status: "Paused", orders: "54", rate: "—" },
];

export default function RestaurantsPage() {
  const [rows, setRows] = useState(seed);
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const visible = useMemo(() => (filter === "All" ? rows : rows.filter((row) => row.status === filter)), [filter, rows]);

  function decide(name: string, status: "Active" | "Rejected") {
    setRows((current) => current.map((row) => (row.name === name ? { ...row, status } : row)));
    setNotice(`${name} ${status === "Active" ? "approved" : "rejected"} in this preview.`);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Partners"
        title="Restaurants"
        description="Review partner applications, manage service status, and configure restaurant commission."
        action={<Button>Add restaurant +</Button>}
      />
      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Active partners" value="86" tone="lime" />
        <StatCard label="Applications to review" value={rows.filter((r) => r.status === "Pending").length.toString()} tone="orange" />
        <StatCard label="Paused today" value="5" tone="ink" />
      </div>

      <Panel title="Partner directory" description="Application state and performance across configured cities">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <SelectPill options={["All", "Pending", "Active", "Paused"]} selected={filter} onSelect={setFilter} />
          <SearchBox placeholder="Search partners…" />
        </div>
        <Table headers={["Restaurant", "Cuisine", "City", "Status", "Orders today", "Commission", ""]}>
          {visible.map((row) => (
            <tr key={row.name} className="transition hover:bg-surface/70">
              <TableCell>
                <Person initials={row.name.split(" ").map((s) => s[0]).join("").slice(0, 2)} name={row.name} meta={`Owner · ${row.owner}`} />
              </TableCell>
              <TableCell>{row.cuisine}</TableCell>
              <TableCell>{row.city}</TableCell>
              <TableCell>
                <Badge label={row.status} />
              </TableCell>
              <TableCell>{row.orders}</TableCell>
              <TableCell>{row.rate}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {row.status === "Pending" ? (
                    <>
                      <Button onClick={() => decide(row.name, "Active")}>Approve</Button>
                      <Button variant="danger" onClick={() => decide(row.name, "Rejected")}>
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary">Manage</Button>
                  )}
                </div>
              </TableCell>
            </tr>
          ))}
        </Table>
        {!visible.length ? <p className="p-10 text-center text-sm text-muted">No partners in this view.</p> : null}
      </Panel>
      <p className="text-[12px] text-muted">Commission rates are per restaurant and fall back to the global setting. No platform rate has been chosen yet.</p>
    </div>
  );
}
