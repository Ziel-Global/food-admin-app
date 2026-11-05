"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons";
import {
  Badge,
  Button,
  Modal,
  Notice,
  PageTitle,
  Panel,
  SelectPill,
  StatCard,
  Table,
  TableCell,
} from "@/components/ui";

type PayeeType = "Restaurant" | "Rider";
type ViewFilter = "All" | "Restaurants" | "Riders";
type PayoutStatus = "Pending" | "Processing" | "Paid";

type PayoutRow = {
  ref: string;
  account: string;
  type: PayeeType;
  period: string;
  gross: string;
  deductions: string;
  net: string;
  status: PayoutStatus;
  method: string;
  bank: string;
};

const seed: PayoutRow[] = [
  {
    ref: "PO-73081",
    account: "Olive & Thyme",
    type: "Restaurant",
    period: "Oct 20 – Oct 26",
    gross: "184,200",
    deductions: "36,840",
    net: "147,360",
    status: "Pending",
    method: "Bank transfer",
    bank: "HBL · ****4218",
  },
  {
    ref: "PO-73080",
    account: "Northside Grill",
    type: "Restaurant",
    period: "Oct 20 – Oct 26",
    gross: "152,400",
    deductions: "30,480",
    net: "121,920",
    status: "Processing",
    method: "Bank transfer",
    bank: "Meezan · ****9031",
  },
  {
    ref: "PO-73079",
    account: "Sam Rivera",
    type: "Rider",
    period: "Oct 20 – Oct 26",
    gross: "18,460",
    deductions: "2,800 cash",
    net: "15,660",
    status: "Paid",
    method: "Wallet",
    bank: "Rider wallet",
  },
  {
    ref: "PO-73078",
    account: "Little Saffron",
    type: "Restaurant",
    period: "Oct 13 – Oct 19",
    gross: "210,500",
    deductions: "42,100",
    net: "168,400",
    status: "Paid",
    method: "Bank transfer",
    bank: "UBL · ****1180",
  },
  {
    ref: "PO-73077",
    account: "Red Crust Pizza",
    type: "Restaurant",
    period: "Oct 13 – Oct 19",
    gross: "96,800",
    deductions: "21,296",
    net: "75,504",
    status: "Paid",
    method: "Bank transfer",
    bank: "HBL · ****7742",
  },
  {
    ref: "PO-73076",
    account: "Nora Ali",
    type: "Rider",
    period: "Oct 20 – Oct 26",
    gross: "14,220",
    deductions: "1,150 cash",
    net: "13,070",
    status: "Pending",
    method: "Wallet",
    bank: "Rider wallet",
  },
  {
    ref: "PO-73075",
    account: "Jules Park",
    type: "Rider",
    period: "Oct 13 – Oct 19",
    gross: "16,880",
    deductions: "900 cash",
    net: "15,980",
    status: "Processing",
    method: "Bank transfer",
    bank: "JazzCash · ****5520",
  },
  {
    ref: "PO-73074",
    account: "Mika Shah",
    type: "Rider",
    period: "Oct 13 – Oct 19",
    gross: "12,410",
    deductions: "—",
    net: "12,410",
    status: "Paid",
    method: "Wallet",
    bank: "Rider wallet",
  },
];

function matchesView(type: PayeeType, view: ViewFilter) {
  if (view === "All") return true;
  if (view === "Restaurants") return type === "Restaurant";
  return type === "Rider";
}

function parseMoney(value: string) {
  return Number(String(value).replace(/,/g, "").replace(/[^\d.]/g, "")) || 0;
}

function formatMoney(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

export function PayoutsClient() {
  const searchParams = useSearchParams();
  const partnerFilter = searchParams.get("partner")?.trim() ?? "";
  const [rows, setRows] = useState(seed);
  const [view, setView] = useState<ViewFilter>(partnerFilter ? "Restaurants" : "All");
  const [notice, setNotice] = useState("");
  const [statementRef, setStatementRef] = useState<string | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const scoped = useMemo(() => {
    let next = rows.filter((row) => matchesView(row.type, view));
    if (partnerFilter) {
      next = next.filter((row) => row.account.toLowerCase() === partnerFilter.toLowerCase());
    }
    return next;
  }, [partnerFilter, rows, view]);

  const pendingBatch = useMemo(
    () => scoped.filter((row) => row.status === "Pending"),
    [scoped],
  );

  const batchTotal = useMemo(
    () => formatMoney(pendingBatch.reduce((sum, row) => sum + parseMoney(row.net), 0)),
    [pendingBatch],
  );

  const statement = rows.find((row) => row.ref === statementRef) ?? null;
  const restaurantCount = rows.filter((row) => row.type === "Restaurant").length;
  const riderCount = rows.filter((row) => row.type === "Rider").length;
  const pendingInView = scoped.filter((row) => row.status === "Pending").length;

  function processOne(ref: string) {
    setRows((current) =>
      current.map((item) => (item.ref === ref ? { ...item, status: "Processing" } : item)),
    );
    setNotice(`${ref} moved to Processing.`);
  }

  function markPaid(ref: string) {
    setBusy(true);
    window.setTimeout(() => {
      setRows((current) =>
        current.map((item) => (item.ref === ref ? { ...item, status: "Paid" } : item)),
      );
      setNotice(`${ref} marked Paid.`);
      setBusy(false);
      setStatementRef(null);
    }, 280);
  }

  function prepareBatch() {
    if (!pendingBatch.length) return;
    setBusy(true);
    window.setTimeout(() => {
      const refs = new Set(pendingBatch.map((row) => row.ref));
      setRows((current) =>
        current.map((item) => (refs.has(item.ref) ? { ...item, status: "Processing" } : item)),
      );
      setNotice(
        `Payout batch prepared · ${pendingBatch.length} ${
          view === "All" ? "settlements" : view.toLowerCase()
        } moved to Processing (net ${batchTotal}).`,
      );
      setBusy(false);
      setBatchOpen(false);
    }, 360);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Finance / Payouts"
        title="Payouts & settlements"
        description="Review restaurant and rider balances separately, then process settlements by payee type."
        action={
          <Button
            variant="secondary"
            onClick={() => setNotice("Ledger export prepared in this preview. Connect storage to download CSV.")}
          >
            Export statement ↓
          </Button>
        }
      />
      {partnerFilter ? <Notice>Showing payouts for {partnerFilter}.</Notice> : null}
      {notice ? <Notice>{notice}</Notice> : null}

      {partnerFilter ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3">
          <p className="text-[13px] text-ink">
            Filtered to <span className="font-bold">{partnerFilter}</span>
          </p>
          <Button variant="secondary" href="/payouts">
            Clear filter
          </Button>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Restaurant payouts" value={String(restaurantCount)} tone="lime" />
        <StatCard label="Rider payouts" value={String(riderCount)} tone="orange" />
        <StatCard label="Pending in view" value={String(pendingInView)} tone="blue" />
        <StatCard label="Rider cash outstanding" value="46,200" tone="ink" />
      </div>

      <Panel
        title="Payout ledger"
        description={
          view === "Restaurants"
            ? "Restaurant partner settlements and commission deductions"
            : view === "Riders"
              ? "Rider earnings, COD cash deductions, and tip settlements"
              : "Append-only ledger entries are the source for balances"
        }
        action={
          <Button onClick={() => setBatchOpen(true)} disabled={!pendingBatch.length}>
            Prepare payout batch
          </Button>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <SelectPill
            options={["All", "Restaurants", "Riders"]}
            selected={view}
            onSelect={(value) => setView(value as ViewFilter)}
          />
          <p className="text-[12px] text-muted">
            Showing {scoped.length} {view === "All" ? "settlements" : view.toLowerCase()}
          </p>
        </div>

        <Table headers={["Reference", "Payee", "Period", "Gross", "Deductions", "Net", "Status", ""]}>
          {scoped.map((row) => (
            <tr key={row.ref} className="transition hover:bg-surface/70">
              <TableCell>
                <span className="font-bold text-ink">{row.ref}</span>
              </TableCell>
              <TableCell>
                <span className="font-bold text-ink">{row.account}</span>
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    row.type === "Restaurant" ? "bg-lime-soft text-ink" : "bg-[#eaf1ff] text-[#506a9f]"
                  }`}
                >
                  {row.type}
                </span>
              </TableCell>
              <TableCell>{row.period}</TableCell>
              <TableCell>{row.gross}</TableCell>
              <TableCell>{row.deductions}</TableCell>
              <TableCell className="font-bold text-ink">{row.net}</TableCell>
              <TableCell>
                <Badge label={row.status} />
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {row.status === "Pending" ? (
                    <Button onClick={() => processOne(row.ref)}>Process</Button>
                  ) : null}
                  <Button variant="secondary" onClick={() => setStatementRef(row.ref)}>
                    Statement
                  </Button>
                </div>
              </TableCell>
            </tr>
          ))}
        </Table>
        {!scoped.length ? (
          <p className="p-10 text-center text-sm text-muted">
            No {view === "All" ? "payouts" : view.toLowerCase()} found
            {partnerFilter ? ` for ${partnerFilter}` : ""}.
          </p>
        ) : null}
      </Panel>
      <div className="rounded-2xl border border-line bg-surface p-4 text-[12px] leading-5 text-muted">
        {view === "Riders"
          ? "Rider COD cash is reconciled against earnings and recorded as a settlement entry. Never overwrite ledger balances; use reversing entries for corrections."
          : view === "Restaurants"
            ? "Restaurant payouts deduct platform commission and promotions before net settlement. Use reversing entries for corrections."
            : "Rider COD cash is reconciled against earnings and recorded as a settlement entry. Never overwrite ledger balances; use reversing entries for corrections."}
      </div>

      <Modal
        open={Boolean(statement)}
        onClose={() => (busy ? undefined : setStatementRef(null))}
        size="lg"
        icon={<Icons.payouts size={16} />}
        title={statement ? `Statement · ${statement.ref}` : "Statement"}
        description={statement ? `${statement.account} · ${statement.period}` : undefined}
        footer={
          statement ? (
            <>
              <Button variant="secondary" onClick={() => setStatementRef(null)} disabled={busy}>
                Close
              </Button>
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => setNotice(`Statement PDF for ${statement.ref} queued in this preview.`)}
              >
                Download PDF
              </Button>
              {statement.status === "Processing" ? (
                <Button disabled={busy} onClick={() => markPaid(statement.ref)}>
                  {busy ? "Updating…" : "Mark as paid"}
                </Button>
              ) : null}
              {statement.status === "Pending" ? (
                <Button
                  disabled={busy}
                  onClick={() => {
                    processOne(statement.ref);
                    setStatementRef(null);
                  }}
                >
                  Process payout
                </Button>
              ) : null}
            </>
          ) : null
        }
      >
        {statement ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge label={statement.status} />
              <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold text-muted">{statement.type}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Payee", value: statement.account },
                { label: "Settlement period", value: statement.period },
                { label: "Payout method", value: statement.method },
                { label: "Destination", value: statement.bank },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-line px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">{item.label}</p>
                  <p className="mt-1 text-[13px] font-bold text-ink">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-line">
              {[
                { label: "Gross earnings", value: statement.gross },
                { label: "Deductions", value: statement.deductions },
                { label: "Net payable", value: statement.net, strong: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between border-b border-line px-4 py-3 last:border-b-0 ${
                    item.strong ? "bg-[#f8fbee]" : "bg-white"
                  }`}
                >
                  <span className="text-[12px] text-muted">{item.label}</span>
                  <span className={`text-[14px] font-bold text-ink ${item.strong ? "text-[16px]" : ""}`}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-[12px] leading-5 text-muted">
              {statement.type === "Rider"
                ? "Rider statements include tips, delivery fees, and COD cash already collected."
                : "Restaurant statements deduct platform commission and funded promotions from gross GMV."}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={batchOpen}
        onClose={() => (busy ? undefined : setBatchOpen(false))}
        size="lg"
        icon={<Icons.payouts size={16} />}
        title="Prepare payout batch"
        description={
          view === "All"
            ? "Move pending settlements in this view to Processing."
            : `Prepare a ${view.toLowerCase()} payout batch from pending rows.`
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setBatchOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button disabled={busy || !pendingBatch.length} onClick={prepareBatch}>
              {busy ? "Preparing…" : `Prepare ${pendingBatch.length || 0} payouts`}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Pending</p>
              <p className="mt-1 text-[18px] font-bold text-ink">{pendingBatch.length}</p>
            </div>
            <div className="rounded-xl border border-line px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">View</p>
              <p className="mt-1 text-[18px] font-bold text-ink">{view}</p>
            </div>
            <div className="rounded-xl border border-line bg-[#f8fbee] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Batch net</p>
              <p className="mt-1 text-[18px] font-bold text-ink">{batchTotal}</p>
            </div>
          </div>

          {pendingBatch.length ? (
            <div className="max-h-[280px] space-y-2 overflow-y-auto rounded-2xl border border-line p-3">
              {pendingBatch.map((row) => (
                <div key={row.ref} className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2.5">
                  <div>
                    <p className="text-[13px] font-bold text-ink">{row.account}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {row.ref} · {row.period}
                    </p>
                  </div>
                  <p className="text-[13px] font-bold text-ink">{row.net}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-line bg-surface px-4 py-8 text-center text-[13px] text-muted">
              No pending payouts in this view to include in a batch.
            </p>
          )}

          <div className="rounded-2xl border border-line bg-[#f8fbee] px-4 py-3 text-[12px] leading-5 text-muted">
            Preparing a batch marks selected pending rows as Processing. Connect your payout provider before executing
            real transfers.
          </div>
        </div>
      </Modal>
    </div>
  );
}
