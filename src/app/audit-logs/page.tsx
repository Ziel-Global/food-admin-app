"use client";

import { useMemo, useState } from "react";
import { Icons } from "@/components/icons";
import {
  Badge,
  Button,
  Modal,
  Notice,
  PageTitle,
  Panel,
  Person,
  SearchBox,
  SelectPill,
  StatCard,
  Table,
  TableCell,
} from "@/components/ui";

type LogCategory = "Orders" | "Partners" | "Finance" | "Support" | "Settings" | "Auth";
type LogResult = "Success" | "Failed" | "Warning";

type AuditLog = {
  id: string;
  at: string;
  actor: string;
  role: string;
  action: string;
  category: LogCategory;
  target: string;
  result: LogResult;
  ip: string;
  detail: string;
};

const seed: AuditLog[] = [
  {
    id: "AUD-9042",
    at: "2 min ago",
    actor: "Alex Morgan",
    role: "Super admin",
    action: "Updated commission",
    category: "Partners",
    target: "Northside Grill",
    result: "Success",
    ip: "102.88.14.21",
    detail: "Commission rate changed from 18% to 20% on restaurant partner Northside Grill.",
  },
  {
    id: "AUD-9041",
    at: "8 min ago",
    actor: "Jordan Lee",
    role: "Care lead",
    action: "Assigned ticket",
    category: "Support",
    target: "TK-4106",
    result: "Success",
    ip: "102.88.14.44",
    detail: "Support ticket TK-4106 assigned to Priya Shah for payment duplicate charge review.",
  },
  {
    id: "AUD-9040",
    at: "14 min ago",
    actor: "Alex Morgan",
    role: "Super admin",
    action: "Prepared payout batch",
    category: "Finance",
    target: "PO-73081",
    result: "Success",
    ip: "102.88.14.21",
    detail: "Restaurant payout batch prepared covering Olive & Thyme settlement PO-73081.",
  },
  {
    id: "AUD-9039",
    at: "21 min ago",
    actor: "System",
    role: "Automation",
    action: "Restaurant paused",
    category: "Partners",
    target: "Olive & Thyme",
    result: "Warning",
    ip: "—",
    detail: "Olive & Thyme stopped accepting orders after response window timeouts exceeded threshold.",
  },
  {
    id: "AUD-9038",
    at: "36 min ago",
    actor: "Priya Shah",
    role: "Care agent",
    action: "Resolved ticket",
    category: "Support",
    target: "TK-4105",
    result: "Success",
    ip: "102.88.19.02",
    detail: "Ticket TK-4105 resolved with full refund for cold food complaint on order FD-2028.",
  },
  {
    id: "AUD-9037",
    at: "1 hour ago",
    actor: "Alex Morgan",
    role: "Super admin",
    action: "Created promotion",
    category: "Finance",
    target: "WELCOME15",
    result: "Success",
    ip: "102.88.14.21",
    detail: "Promotion code WELCOME15 created as Active with 15% discount and 500 redemption limit.",
  },
  {
    id: "AUD-9036",
    at: "1 hour ago",
    actor: "System",
    role: "Automation",
    action: "Order escalated",
    category: "Orders",
    target: "FD-2048",
    result: "Warning",
    ip: "—",
    detail: "Order FD-2048 escalated — restaurant acceptance exceeded configured response window.",
  },
  {
    id: "AUD-9035",
    at: "2 hours ago",
    actor: "Alex Morgan",
    role: "Super admin",
    action: "Added city",
    category: "Settings",
    target: "East District",
    result: "Success",
    ip: "102.88.14.21",
    detail: "East District added under Central City with 2 delivery zones and inherited currency.",
  },
  {
    id: "AUD-9034",
    at: "3 hours ago",
    actor: "Chris Nguyen",
    role: "Care agent",
    action: "Login failed",
    category: "Auth",
    target: "chris.nguyen@crave.app",
    result: "Failed",
    ip: "41.220.12.88",
    detail: "Failed admin login attempt for chris.nguyen@crave.app from unrecognized device.",
  },
  {
    id: "AUD-9033",
    at: "Yesterday",
    actor: "Alex Morgan",
    role: "Super admin",
    action: "Enabled payment method",
    category: "Settings",
    target: "Cash on delivery",
    result: "Success",
    ip: "102.88.14.21",
    detail: "Cash on delivery marked available for launch across configured cities.",
  },
  {
    id: "AUD-9032",
    at: "Yesterday",
    actor: "Sam Okonkwo",
    role: "Escalations",
    action: "Blocked customer",
    category: "Orders",
    target: "Luca Moretti",
    result: "Warning",
    ip: "102.88.22.10",
    detail: "Customer Luca Moretti blocked after repeated refund abuse flags on recent orders.",
  },
  {
    id: "AUD-9031",
    at: "Yesterday",
    actor: "Alex Morgan",
    role: "Super admin",
    action: "Approved restaurant",
    category: "Partners",
    target: "Saffron House",
    result: "Success",
    ip: "102.88.14.21",
    detail: "Partner application for Saffron House approved and set to Active.",
  },
];

const filters = ["All", "Orders", "Partners", "Finance", "Support", "Settings", "Auth"] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AuditLogsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const visible = useMemo(() => {
    const byCategory = filter === "All" ? seed : seed.filter((row) => row.category === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter(
      (row) =>
        row.id.toLowerCase().includes(q) ||
        row.actor.toLowerCase().includes(q) ||
        row.action.toLowerCase().includes(q) ||
        row.target.toLowerCase().includes(q) ||
        row.detail.toLowerCase().includes(q),
    );
  }, [filter, query]);

  const selected = seed.find((row) => row.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Compliance"
        title="Audit logs"
        description="Track admin actions, system events, and sensitive changes across the Crave platform."
        action={
          <Button
            variant="secondary"
            onClick={() => setNotice("Audit export prepared in this preview. Connect storage to download CSV.")}
          >
            Export logs ↓
          </Button>
        }
      />
      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Events today" value="186" tone="lime" />
        <StatCard label="Admin actions" value="64" tone="blue" />
        <StatCard label="Warnings" value="9" tone="orange" />
        <StatCard label="Failed auth" value="3" tone="ink" />
      </div>

      <Panel
        title="Activity ledger"
        description="Immutable preview of platform events across orders, partners, finance, and settings"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <SelectPill options={[...filters]} selected={filter} onSelect={(value) => setFilter(value as (typeof filters)[number])} />
          <SearchBox placeholder="Search actor, action, target…" value={query} onChange={setQuery} />
        </div>

        <Table headers={["Event", "Actor", "Action", "Category", "Target", "When", "Result", ""]}>
          {visible.map((row) => (
            <tr key={row.id} className="transition hover:bg-surface/70">
              <TableCell>
                <span className="font-bold text-ink">{row.id}</span>
                <span className="mt-1 block text-[11px] text-muted">{row.ip}</span>
              </TableCell>
              <TableCell>
                <Person initials={initials(row.actor)} name={row.actor} meta={row.role} />
              </TableCell>
              <TableCell>
                <span className="font-semibold text-ink">{row.action}</span>
              </TableCell>
              <TableCell>
                <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold text-muted">{row.category}</span>
              </TableCell>
              <TableCell>{row.target}</TableCell>
              <TableCell>{row.at}</TableCell>
              <TableCell>
                <Badge label={row.result} />
              </TableCell>
              <TableCell>
                <Button variant="secondary" onClick={() => setSelectedId(row.id)}>
                  Details
                </Button>
              </TableCell>
            </tr>
          ))}
        </Table>
        {!visible.length ? <p className="p-10 text-center text-sm text-muted">No audit events match this view.</p> : null}
      </Panel>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        size="lg"
        icon={<Icons.audit size={16} />}
        title={selected ? selected.id : "Audit event"}
        description={selected ? `${selected.category} · ${selected.at}` : undefined}
        footer={
          <Button variant="secondary" onClick={() => setSelectedId(null)}>
            Close
          </Button>
        }
      >
        {selected ? (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-[#f8fbee] p-4">
                <Person initials={initials(selected.actor)} name={selected.actor} meta={selected.role} />
                <p className="mt-3 text-[12px] text-muted">Source IP · {selected.ip}</p>
              </div>
              <div className="rounded-2xl border border-line p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge label={selected.result} />
                  <span className="text-[12px] text-muted">{selected.category}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Action</p>
                    <p className="mt-1 font-bold text-ink">{selected.action}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Target</p>
                    <p className="mt-1 font-bold text-ink">{selected.target}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Event detail</p>
              <p className="mt-2 text-[13px] leading-6 text-ink">{selected.detail}</p>
            </div>

            <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-[12px] leading-5 text-muted">
              Audit entries are append-only. Corrections should be recorded as new compensating events rather than edits.
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
