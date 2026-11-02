"use client";

import { useState } from "react";
import { Badge, Button, Notice, PageTitle, Panel, Person, Table, TableCell } from "@/components/ui";

const applications = [
  { name: "Sam Rivera", city: "Central City", vehicle: "Motorbike · Honda 125", docs: "4 documents", since: "18 min ago", status: "Pending" },
  { name: "Nora Ali", city: "North District", vehicle: "Bicycle · Trek FX", docs: "3 documents", since: "1 hour ago", status: "Pending" },
  { name: "Jules Park", city: "Central City", vehicle: "Car · Toyota Yaris", docs: "4 documents", since: "Yesterday", status: "Pending" },
  { name: "Mika Shah", city: "West District", vehicle: "Motorbike · Yamaha YBR", docs: "4 documents", since: "Active rider", status: "Active" },
];

export default function RidersPage() {
  const [rows, setRows] = useState(applications);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("Pending");
  const filtered = rows.filter((row) => filter === "All" || row.status === filter);

  function decide(name: string, status: "Active" | "Rejected") {
    setRows((items) => items.map((item) => (item.name === name ? { ...item, status } : item)));
    setMessage(`${name} marked ${status.toLowerCase()} in this preview.`);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Delivery team"
        title="Riders"
        description="Review identity and vehicle documents, approve new riders, and manage rider access."
        action={<Button variant="secondary">Export rider list ↓</Button>}
      />
      {message ? <Notice>{message}</Notice> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Online now", value: "124", dot: "bg-lime" },
          { label: "On active delivery", value: "86", dot: "bg-orange" },
          { label: "Applications waiting", value: rows.filter((r) => r.status === "Pending").length.toString(), dot: "bg-[#e39b54]" },
        ].map((m) => (
          <div key={m.label} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
            <span className={`size-2.5 rounded-full ${m.dot}`} />
            <div>
              <p className="text-[12px] text-muted">{m.label}</p>
              <p className="font-display mt-1 text-xl font-bold text-ink">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Panel
        title="Rider applications"
        description="Verify documents before granting rider access"
        action={
          <div className="flex gap-1 rounded-xl bg-surface p-1">
            {["Pending", "Active", "All"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-lg px-3 py-2 text-[12px] font-bold transition ${
                  filter === tab ? "bg-ink text-lime" : "text-muted hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      >
        <Table headers={["Applicant", "City", "Vehicle", "Documents", "Applied", "Status", "Review"]}>
          {filtered.map((row) => (
            <tr key={row.name} className="transition hover:bg-surface/70">
              <TableCell>
                <Person initials={row.name.split(" ").map((x) => x[0]).join("")} name={row.name} meta="Rider application" />
              </TableCell>
              <TableCell>{row.city}</TableCell>
              <TableCell>{row.vehicle}</TableCell>
              <TableCell>
                <button className="font-semibold text-ink underline underline-offset-2">{row.docs}</button>
              </TableCell>
              <TableCell>{row.since}</TableCell>
              <TableCell>
                <Badge label={row.status} />
              </TableCell>
              <TableCell>
                {row.status === "Pending" ? (
                  <div className="flex gap-1">
                    <Button onClick={() => decide(row.name, "Active")}>Approve</Button>
                    <Button variant="danger" onClick={() => decide(row.name, "Rejected")}>
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Button variant="secondary">View</Button>
                )}
              </TableCell>
            </tr>
          ))}
        </Table>
      </Panel>
      <div className="rounded-2xl border border-line bg-surface p-4 text-[12px] leading-5 text-muted">
        Approved riders gain access to rider mode in the mobile app. Rejected applications should retain the reason for resubmission.
      </div>
    </div>
  );
}
