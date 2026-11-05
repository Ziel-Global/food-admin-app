"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Icons } from "@/components/icons";
import {
  Badge,
  Button,
  Field,
  Modal,
  Notice,
  PageTitle,
  Panel,
  Person,
  SelectField,
  SelectPill,
  StatCard,
  Table,
  TableCell,
  TextArea,
} from "@/components/ui";

type TicketStatus = "Open" | "In progress" | "Resolved";

type Comment = {
  id: string;
  author: string;
  role: "Customer" | "Care agent" | "System";
  body: string;
  at: string;
};

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  category: string;
  order: string;
  age: string;
  status: TicketStatus;
  assigned: string;
  priority: "Normal" | "High" | "Urgent";
  comments: Comment[];
};

const seed: Ticket[] = [
  {
    id: "TK-4108",
    subject: "Missing side from order",
    customer: "Maya Chen",
    category: "Missing item",
    order: "FD-2041",
    age: "4 min",
    status: "Open",
    assigned: "Unassigned",
    priority: "High",
    comments: [
      {
        id: "c1",
        author: "Maya Chen",
        role: "Customer",
        body: "My garlic bread side was missing from the bag. Order FD-2041 from Olive & Thyme.",
        at: "4 min ago",
      },
    ],
  },
  {
    id: "TK-4107",
    subject: "Rider could not find address",
    customer: "Noah Williams",
    category: "Delivery",
    order: "FD-2039",
    age: "18 min",
    status: "In progress",
    assigned: "Alex Morgan",
    priority: "Urgent",
    comments: [
      {
        id: "c1",
        author: "Noah Williams",
        role: "Customer",
        body: "Rider keeps calling — building entrance is behind the cafe on Market Street.",
        at: "18 min ago",
      },
      {
        id: "c2",
        author: "Alex Morgan",
        role: "Care agent",
        body: "Shared pin drop and landmark notes with the rider. Waiting for confirmation.",
        at: "12 min ago",
      },
    ],
  },
  {
    id: "TK-4106",
    subject: "Charged twice for order",
    customer: "Hana Kim",
    category: "Payment",
    order: "FD-2033",
    age: "1 hour",
    status: "Open",
    assigned: "Unassigned",
    priority: "High",
    comments: [
      {
        id: "c1",
        author: "Hana Kim",
        role: "Customer",
        body: "Card was charged twice for the same order. Need a refund on the duplicate.",
        at: "1 hour ago",
      },
    ],
  },
  {
    id: "TK-4105",
    subject: "Food arrived cold",
    customer: "Luca Moretti",
    category: "Quality",
    order: "FD-2028",
    age: "Yesterday",
    status: "Resolved",
    assigned: "Alex Morgan",
    priority: "Normal",
    comments: [
      {
        id: "c1",
        author: "Luca Moretti",
        role: "Customer",
        body: "Pasta was cold on arrival. Delivery took over 55 minutes.",
        at: "Yesterday",
      },
      {
        id: "c2",
        author: "Alex Morgan",
        role: "Care agent",
        body: "Issued 100% refund and courtesy voucher. Confirmed with customer.",
        at: "Yesterday",
      },
      {
        id: "c3",
        author: "System",
        role: "System",
        body: "Ticket marked Resolved.",
        at: "Yesterday",
      },
    ],
  },
];

const resolutionOptions = [
  { value: "Refund issued", label: "Refund issued" },
  { value: "Partial refund", label: "Partial refund" },
  { value: "Reorder / remake", label: "Reorder / remake" },
  { value: "Credit / voucher", label: "Credit / voucher" },
  { value: "Information provided", label: "Information provided" },
  { value: "No action required", label: "No action required" },
];

const careAgents = [
  { value: "Alex Morgan", label: "Alex Morgan · Super admin" },
  { value: "Jordan Lee", label: "Jordan Lee · Care lead" },
  { value: "Priya Shah", label: "Priya Shah · Care agent" },
  { value: "Chris Nguyen", label: "Chris Nguyen · Care agent" },
  { value: "Sam Okonkwo", label: "Sam Okonkwo · Escalations" },
];

const CURRENT_AGENT = "Alex Morgan";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function nowLabel() {
  return "Just now";
}

export default function SupportPage() {
  const [rows, setRows] = useState(seed);
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [comment, setComment] = useState("");
  const [resolution, setResolution] = useState("Refund issued");
  const [assignee, setAssignee] = useState(CURRENT_AGENT);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const visible = useMemo(
    () => rows.filter((row) => filter === "All" || row.status === filter),
    [filter, rows],
  );
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  function openTicket(id: string) {
    const ticket = rows.find((row) => row.id === id);
    setSelectedId(id);
    setComment("");
    setError("");
    setResolution("Refund issued");
    setAssignee(
      ticket && ticket.assigned !== "Unassigned" ? ticket.assigned : CURRENT_AGENT,
    );
  }

  function closeTicket() {
    if (busy) return;
    setSelectedId(null);
    setComment("");
    setError("");
  }

  function updateTicket(id: string, updater: (ticket: Ticket) => Ticket, message: string) {
    setRows((current) => current.map((item) => (item.id === id ? updater(item) : item)));
    setNotice(message);
  }

  function addAgentComment(ticket: Ticket, body: string, status?: TicketStatus, assigned?: string): Ticket {
    const nextComment: Comment = {
      id: `c-${Date.now()}`,
      author: "Alex Morgan",
      role: "Care agent",
      body,
      at: nowLabel(),
    };
    return {
      ...ticket,
      status: status ?? ticket.status,
      assigned: assigned ?? (ticket.assigned === "Unassigned" ? "Alex Morgan" : ticket.assigned),
      comments: [...ticket.comments, nextComment],
    };
  }

  function postComment(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    if (!comment.trim()) {
      setError("Add a comment before posting.");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      updateTicket(
        selected.id,
        (ticket) =>
          addAgentComment(
            ticket,
            comment.trim(),
            ticket.status === "Open" ? "In progress" : ticket.status,
          ),
        `Comment added on ${selected.id}.`,
      );
      setComment("");
      setError("");
      setBusy(false);
      if (filter === "Open") setFilter("In progress");
    }, 220);
  }

  function resolveTicket(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    if (!comment.trim()) {
      setError("Add a resolution note so the customer can see what happened.");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      const body = `${resolution}: ${comment.trim()}`;
      updateTicket(
        selected.id,
        (ticket) => {
          const withComment = addAgentComment(ticket, body, "Resolved", "Alex Morgan");
          return {
            ...withComment,
            comments: [
              ...withComment.comments,
              {
                id: `c-sys-${Date.now()}`,
                author: "System",
                role: "System",
                body: "Ticket marked Resolved.",
                at: nowLabel(),
              },
            ],
          };
        },
        `${selected.id} resolved — ${resolution}.`,
      );
      setComment("");
      setError("");
      setBusy(false);
      setSelectedId(null);
      setFilter("Resolved");
    }, 280);
  }

  function reopenTicket() {
    if (!selected) return;
    if (!comment.trim()) {
      setError("Add a short note explaining why this ticket is reopening.");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      updateTicket(
        selected.id,
        (ticket) => addAgentComment(ticket, `Reopened: ${comment.trim()}`, "In progress", "Alex Morgan"),
        `${selected.id} reopened.`,
      );
      setComment("");
      setError("");
      setBusy(false);
      setFilter("In progress");
    }, 220);
  }

  function assignTicket(agent: string) {
    if (!selected || busy) return;
    if (!agent) {
      setError("Pick a care agent to assign.");
      return;
    }
    if (selected.assigned === agent) {
      setNotice(`${selected.id} is already assigned to ${agent}.`);
      return;
    }
    const nextStatus: TicketStatus = selected.status === "Open" ? "In progress" : selected.status;
    updateTicket(
      selected.id,
      (ticket) =>
        addAgentComment(
          {
            ...ticket,
            assigned: agent,
            status: nextStatus,
          },
          agent === CURRENT_AGENT ? `Assigned to ${agent} (you).` : `Assigned to ${agent}.`,
          nextStatus,
          agent,
        ),
      agent === CURRENT_AGENT ? `${selected.id} assigned to you.` : `${selected.id} assigned to ${agent}.`,
    );
    setAssignee(agent);
    setError("");
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Care"
        title="Support tickets"
        description="Triage delivery issues, assign owners, and record resolution decisions."
        action={<Button variant="secondary">Ticket rules ⚙</Button>}
      />
      {notice ? <Notice>{notice}</Notice> : null}

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
                <Person initials={initials(row.customer)} name={row.customer} meta="Customer" />
              </TableCell>
              <TableCell>{row.subject}</TableCell>
              <TableCell>{row.order}</TableCell>
              <TableCell>{row.age}</TableCell>
              <TableCell>
                <Badge label={row.status} />
              </TableCell>
              <TableCell>{row.assigned}</TableCell>
              <TableCell>
                <Button variant="secondary" onClick={() => openTicket(row.id)}>
                  {row.status === "Resolved" ? "View" : "Resolve"}
                </Button>
              </TableCell>
            </tr>
          ))}
        </Table>
        {!visible.length ? <p className="p-10 text-center text-sm text-muted">No tickets in this view.</p> : null}
      </Panel>

      <Modal
        open={Boolean(selected)}
        onClose={closeTicket}
        size="lg"
        icon={<Icons.support size={16} />}
        title={selected ? selected.id : "Ticket"}
        description={selected ? `${selected.category} · Order ${selected.order}` : undefined}
        footer={
          selected ? (
            selected.status === "Resolved" ? (
              <>
                <Button variant="secondary" onClick={closeTicket} disabled={busy}>
                  Close
                </Button>
                <Button variant="danger" onClick={reopenTicket} disabled={busy}>
                  {busy ? "Reopening…" : "Reopen ticket"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={closeTicket} disabled={busy}>
                  Cancel
                </Button>
                <Button variant="secondary" type="submit" form="ticket-comment-form" disabled={busy}>
                  {busy ? "Posting…" : "Post comment"}
                </Button>
                <Button type="submit" form="ticket-resolve-form" disabled={busy}>
                  {busy ? "Resolving…" : "Resolve ticket"}
                </Button>
              </>
            )
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-[#f8fbee] p-4">
                <Person initials={initials(selected.customer)} name={selected.customer} meta="Customer" />
                <p className="mt-3 text-[13px] font-semibold text-ink">{selected.subject}</p>
                <p className="mt-1 text-[12px] text-muted">
                  Priority {selected.priority} · Age {selected.age}
                </p>
              </div>
              <div className="rounded-2xl border border-line p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge label={selected.status} />
                  <span className="text-[12px] text-muted">Assigned · {selected.assigned}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Order</p>
                    <p className="mt-1 font-bold text-ink">{selected.order}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Category</p>
                    <p className="mt-1 font-bold text-ink">{selected.category}</p>
                  </div>
                </div>
                {selected.status !== "Resolved" ? (
                  <div className="mt-4 space-y-2">
                    <Field label="Assign to" hint="Care team member who owns this ticket">
                      <SelectField value={assignee} onChange={setAssignee} options={careAgents} />
                    </Field>
                    {assignee === CURRENT_AGENT ? (
                      <Button
                        className="w-full"
                        variant="secondary"
                        disabled={busy || selected.assigned === CURRENT_AGENT}
                        onClick={() => assignTicket(CURRENT_AGENT)}
                      >
                        Assign to me
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        disabled={busy || !assignee || selected.assigned === assignee}
                        onClick={() => assignTicket(assignee)}
                      >
                        Assign
                      </Button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[13px] font-bold text-ink">Conversation</p>
              <div className="max-h-[240px] space-y-3 overflow-y-auto rounded-2xl border border-line bg-white p-3">
                {selected.comments.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl px-3.5 py-3 ${
                      item.role === "Care agent"
                        ? "bg-ink text-white"
                        : item.role === "System"
                          ? "bg-surface text-muted"
                          : "bg-[#f8fbee] text-ink"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className={`text-[11px] font-bold ${item.role === "Care agent" ? "text-lime" : ""}`}>
                        {item.author}
                        <span className={`ml-2 font-medium ${item.role === "Care agent" ? "text-white/50" : "text-soft"}`}>
                          {item.role}
                        </span>
                      </p>
                      <span className={`text-[10px] ${item.role === "Care agent" ? "text-white/45" : "text-soft"}`}>
                        {item.at}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-5">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {selected.status === "Resolved" ? (
              <form
                id="ticket-comment-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  reopenTicket();
                }}
                className="space-y-3"
              >
                <Field label="Reopen note" required error={error} hint="Visible on the ticket timeline">
                  <TextArea
                    value={comment}
                    onChange={(value) => {
                      setComment(value);
                      setError("");
                    }}
                    placeholder="Why is this ticket being reopened?"
                    rows={3}
                  />
                </Field>
              </form>
            ) : (
              <>
                <form id="ticket-comment-form" onSubmit={postComment} className="hidden" aria-hidden>
                  <button type="submit" />
                </form>
                <form id="ticket-resolve-form" onSubmit={resolveTicket} className="space-y-4">
                  <Field label="Resolution type" required>
                    <SelectField value={resolution} onChange={setResolution} options={resolutionOptions} required />
                  </Field>
                  <Field
                    label="Agent comment"
                    required
                    error={error}
                    hint="Posted to the customer timeline when you resolve or comment"
                  >
                    <TextArea
                      value={comment}
                      onChange={(value) => {
                        setComment(value);
                        setError("");
                      }}
                      placeholder="Explain the fix, refund amount, or next step…"
                      rows={4}
                      required
                    />
                  </Field>
                </form>
              </>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
