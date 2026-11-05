"use client";

import { useMemo, useState } from "react";
import { Icons } from "@/components/icons";
import { Badge, Button, Modal, Notice, PageTitle, Panel, Person, Table, TableCell } from "@/components/ui";

type DocStatus = "Verified" | "Pending review" | "Needs resubmit";

type RiderDocument = {
  id: string;
  title: string;
  type: string;
  uploaded: string;
  status: DocStatus;
  preview: string;
};

type RiderApplication = {
  name: string;
  city: string;
  vehicle: string;
  since: string;
  status: "Pending" | "Active" | "Rejected";
  documents: RiderDocument[];
};

const applications: RiderApplication[] = [
  {
    name: "Sam Rivera",
    city: "Central City",
    vehicle: "Motorbike · Honda 125",
    since: "18 min ago",
    status: "Pending",
    documents: [
      {
        id: "sr-id",
        title: "National ID · Front",
        type: "Identity",
        uploaded: "18 min ago",
        status: "Pending review",
        preview: "Government ID card · Sam Rivera · DOB 12 Mar 1996 · ID ****4821",
      },
      {
        id: "sr-id-back",
        title: "National ID · Back",
        type: "Identity",
        uploaded: "18 min ago",
        status: "Pending review",
        preview: "ID reverse side · address Central City Block 12 · expiry 2030",
      },
      {
        id: "sr-license",
        title: "Driving license",
        type: "License",
        uploaded: "17 min ago",
        status: "Pending review",
        preview: "Motorbike license · class M · valid through Aug 2028",
      },
      {
        id: "sr-vehicle",
        title: "Vehicle registration",
        type: "Vehicle",
        uploaded: "16 min ago",
        status: "Pending review",
        preview: "Honda 125 · plate CT-9182 · owner Sam Rivera",
      },
    ],
  },
  {
    name: "Nora Ali",
    city: "North District",
    vehicle: "Bicycle · Trek FX",
    since: "1 hour ago",
    status: "Pending",
    documents: [
      {
        id: "na-id",
        title: "National ID · Front",
        type: "Identity",
        uploaded: "1 hour ago",
        status: "Pending review",
        preview: "Government ID card · Nora Ali · DOB 04 Jul 1999 · ID ****7710",
      },
      {
        id: "na-selfie",
        title: "Selfie verification",
        type: "Identity",
        uploaded: "58 min ago",
        status: "Pending review",
        preview: "Live selfie match against submitted ID · confidence 97%",
      },
      {
        id: "na-bike",
        title: "Bicycle photo",
        type: "Vehicle",
        uploaded: "55 min ago",
        status: "Needs resubmit",
        preview: "Bike photo is blurry — request clearer side profile of Trek FX.",
      },
    ],
  },
  {
    name: "Jules Park",
    city: "Central City",
    vehicle: "Car · Toyota Yaris",
    since: "Yesterday",
    status: "Pending",
    documents: [
      {
        id: "jp-id",
        title: "National ID · Front",
        type: "Identity",
        uploaded: "Yesterday",
        status: "Verified",
        preview: "Government ID card · Jules Park · DOB 22 Nov 1994 · ID ****2209",
      },
      {
        id: "jp-license",
        title: "Driving license",
        type: "License",
        uploaded: "Yesterday",
        status: "Verified",
        preview: "Car license · class B · valid through Jan 2029",
      },
      {
        id: "jp-reg",
        title: "Vehicle registration",
        type: "Vehicle",
        uploaded: "Yesterday",
        status: "Pending review",
        preview: "Toyota Yaris · plate CT-4410 · insurance attached",
      },
      {
        id: "jp-ins",
        title: "Insurance certificate",
        type: "Vehicle",
        uploaded: "Yesterday",
        status: "Pending review",
        preview: "Third-party insurance · policy ends Dec 2026",
      },
    ],
  },
  {
    name: "Mika Shah",
    city: "West District",
    vehicle: "Motorbike · Yamaha YBR",
    since: "Active rider",
    status: "Active",
    documents: [
      {
        id: "ms-id",
        title: "National ID · Front",
        type: "Identity",
        uploaded: "2 weeks ago",
        status: "Verified",
        preview: "Government ID card · Mika Shah · DOB 09 Sep 1997 · ID ****6654",
      },
      {
        id: "ms-license",
        title: "Driving license",
        type: "License",
        uploaded: "2 weeks ago",
        status: "Verified",
        preview: "Motorbike license · class M · valid through May 2027",
      },
      {
        id: "ms-reg",
        title: "Vehicle registration",
        type: "Vehicle",
        uploaded: "2 weeks ago",
        status: "Verified",
        preview: "Yamaha YBR · plate WD-3088 · owner Mika Shah",
      },
      {
        id: "ms-selfie",
        title: "Selfie verification",
        type: "Identity",
        uploaded: "2 weeks ago",
        status: "Verified",
        preview: "Live selfie match against submitted ID · confidence 99%",
      },
    ],
  },
];

export default function RidersPage() {
  const [rows, setRows] = useState(applications);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("Pending");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const filtered = rows.filter((row) => filter === "All" || row.status === filter);
  const selected = rows.find((row) => row.name === selectedName) ?? null;
  const activeDoc = useMemo(() => {
    if (!selected) return null;
    return selected.documents.find((doc) => doc.id === activeDocId) ?? selected.documents[0] ?? null;
  }, [activeDocId, selected]);

  function decide(name: string, status: "Active" | "Rejected") {
    setRows((items) => items.map((item) => (item.name === name ? { ...item, status } : item)));
    setMessage(`${name} marked ${status.toLowerCase()} in this preview.`);
  }

  function openDocuments(name: string) {
    const rider = rows.find((row) => row.name === name);
    setSelectedName(name);
    setActiveDocId(rider?.documents[0]?.id ?? null);
  }

  function closeDocuments() {
    setSelectedName(null);
    setActiveDocId(null);
  }

  function markDoc(status: DocStatus) {
    if (!selected || !activeDoc) return;
    setRows((items) =>
      items.map((item) =>
        item.name !== selected.name
          ? item
          : {
              ...item,
              documents: item.documents.map((doc) => (doc.id === activeDoc.id ? { ...doc, status } : doc)),
            },
      ),
    );
    setMessage(`${activeDoc.title} marked ${status.toLowerCase()} for ${selected.name}.`);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Delivery team"
        title="Riders"
        description="Review identity and vehicle documents, approve new riders, and manage rider access."
        action={
          <Button
            variant="secondary"
            onClick={() => setMessage("Rider export prepared in this preview.")}
          >
            Export rider list ↓
          </Button>
        }
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
                type="button"
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
                <Person
                  initials={row.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                  name={row.name}
                  meta="Rider application"
                />
              </TableCell>
              <TableCell>{row.city}</TableCell>
              <TableCell>{row.vehicle}</TableCell>
              <TableCell>
                <button
                  type="button"
                  onClick={() => openDocuments(row.name)}
                  className="font-semibold text-ink underline underline-offset-2 transition hover:text-charcoal-soft"
                >
                  {row.documents.length} document{row.documents.length === 1 ? "" : "s"}
                </button>
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
                  <Button variant="secondary" onClick={() => openDocuments(row.name)}>
                    View
                  </Button>
                )}
              </TableCell>
            </tr>
          ))}
        </Table>
      </Panel>
      <div className="rounded-2xl border border-line bg-surface p-4 text-[12px] leading-5 text-muted">
        Approved riders gain access to rider mode in the mobile app. Rejected applications should retain the reason for
        resubmission.
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={closeDocuments}
        size="lg"
        icon={<Icons.riders size={16} />}
        title={selected ? `${selected.name} documents` : "Documents"}
        description={selected ? `${selected.vehicle} · ${selected.city}` : undefined}
        footer={
          selected ? (
            <>
              <Button variant="secondary" onClick={closeDocuments}>
                Close
              </Button>
              {selected.status === "Pending" ? (
                <>
                  <Button variant="danger" onClick={() => decide(selected.name, "Rejected")}>
                    Reject rider
                  </Button>
                  <Button
                    onClick={() => {
                      decide(selected.name, "Active");
                      closeDocuments();
                    }}
                  >
                    Approve rider
                  </Button>
                </>
              ) : null}
            </>
          ) : null
        }
      >
        {selected && activeDoc ? (
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-2">
              <p className="text-[12px] font-bold text-ink">Uploaded files</p>
              <div className="max-h-[340px] space-y-2 overflow-y-auto rounded-2xl border border-line p-2">
                {selected.documents.map((doc) => {
                  const active = doc.id === activeDoc.id;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setActiveDocId(doc.id)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                        active ? "bg-ink text-white" : "bg-surface text-ink hover:bg-white"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-[11px] font-bold ${
                          active ? "bg-lime text-ink" : "bg-white text-muted ring-1 ring-line"
                        }`}
                      >
                        {doc.type.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[13px] font-bold ${active ? "text-lime" : "text-ink"}`}>
                          {doc.title}
                        </span>
                        <span className={`mt-0.5 block text-[11px] ${active ? "text-white/55" : "text-muted"}`}>
                          {doc.type} · {doc.uploaded}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold text-ink">{activeDoc.title}</p>
                  <p className="mt-1 text-[12px] text-muted">
                    {activeDoc.type} · uploaded {activeDoc.uploaded}
                  </p>
                </div>
                <Badge label={activeDoc.status} />
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-line bg-[linear-gradient(160deg,#111_0%,#2a2a2a_45%,#1a1a1a_100%)] p-5 text-white shadow-inner">
                <div className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-lime/15 blur-3xl" />
                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lime">Document preview</p>
                  <p className="font-display mt-4 text-[22px] font-bold tracking-tight">{activeDoc.title}</p>
                  <p className="mt-3 max-w-sm text-[13px] leading-6 text-white/70">{activeDoc.preview}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
                      {selected.name}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
                      {activeDoc.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => markDoc("Verified")}>
                  Mark verified
                </Button>
                <Button variant="secondary" onClick={() => markDoc("Pending review")}>
                  Needs review
                </Button>
                <Button variant="danger" onClick={() => markDoc("Needs resubmit")}>
                  Request resubmit
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
