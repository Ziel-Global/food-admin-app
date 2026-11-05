"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Notice,
  Panel,
  StatCard,
  Table,
  TableCell,
} from "@/components/ui";
import {
  addressesByCustomer,
  getCustomer,
  initials,
  recentOrdersByCustomer,
  upsertCustomer,
  type Customer,
  type CustomerStatus,
} from "@/lib/customers";

function statusCopy(status: CustomerStatus) {
  if (status === "Active") return "Can place orders and contact support";
  return "Blocked from ordering — existing tickets stay visible to care";
}

export default function CustomerDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [missing, setMissing] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const found = getCustomer(id);
    if (!found) {
      setMissing(true);
      setCustomer(null);
      return;
    }
    setMissing(false);
    setCustomer(found);
  }, [id]);

  const orders = useMemo(() => recentOrdersByCustomer[id] ?? [], [id]);
  const addresses = useMemo(() => addressesByCustomer[id] ?? [], [id]);

  function setStatus(status: CustomerStatus) {
    if (!customer) return;
    setBusy(true);
    window.setTimeout(() => {
      const next = { ...customer, status };
      upsertCustomer(next);
      setCustomer(next);
      setNotice(
        status === "Blocked"
          ? `${next.name} blocked — they can no longer place orders.`
          : `${next.name} unblocked — ordering restored.`,
      );
      setBusy(false);
    }, 280);
  }

  if (missing) {
    return (
      <div className="space-y-4 py-16 text-center">
        <p className="font-display text-2xl font-bold text-ink">Customer not found</p>
        <p className="text-sm text-muted">This account is not in the preview directory.</p>
        <Button variant="secondary" onClick={() => router.push("/customers")}>
          ← Back to customers
        </Button>
      </div>
    );
  }

  if (!customer) {
    return <div className="py-20 text-center text-sm text-muted">Loading customer…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 animate-fade-up">
        <div className="flex min-w-0 items-start gap-4">
          <Avatar initials={initials(customer.name)} className="size-14 text-[15px]" />
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lime">
              <span className="size-1.5 rounded-full bg-lime" />
              Customer profile
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <h1 className="font-display text-[28px] font-bold tracking-[-0.04em] text-ink sm:text-[34px]">
                {customer.name}
              </h1>
              <Badge label={customer.status} />
            </div>
            <p className="mt-2 text-[13px] text-muted">
              {customer.city} · {customer.zone} · Joined {customer.joined}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => router.push("/customers")}>
            ← Directory
          </Button>
          {customer.status === "Active" ? (
            <Button variant="danger" disabled={busy} onClick={() => setStatus("Blocked")}>
              {busy ? "Updating…" : "Block account"}
            </Button>
          ) : (
            <Button disabled={busy} onClick={() => setStatus("Active")}>
              {busy ? "Updating…" : "Unblock account"}
            </Button>
          )}
        </div>
      </div>

      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Lifetime" value={customer.orders} tone="lime" />
        <StatCard label="Lifetime value" value={customer.spent} tone="ink" />
        <StatCard label="Avg order" value={customer.avgOrder} tone="orange" />
        <StatCard label="Wallet balance" value={customer.wallet} tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-6">
          <Panel title="Account details" description="Contact and identity used across care and orders">
            <div className="grid gap-0 sm:grid-cols-2">
              {[
                { label: "Full name", value: customer.name },
                { label: "Customer ID", value: customer.id },
                { label: "Phone", value: customer.phone },
                { label: "Email", value: customer.email },
                { label: "City / zone", value: `${customer.city} · ${customer.zone}` },
                { label: "Joined", value: customer.joined },
                { label: "Last order", value: customer.lastOrder },
                { label: "Payment method", value: customer.payment },
              ].map((item) => (
                <div key={item.label} className="border-b border-line px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6f7a63]">{item.label}</p>
                  <p className="mt-1.5 text-[13px] font-semibold text-ink">{item.value || "—"}</p>
                </div>
              ))}
            </div>
            {customer.notes ? (
              <div className="border-t border-line bg-[#f8fbee] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6f7a63]">Internal notes</p>
                <p className="mt-1.5 text-[13px] leading-5 text-ink">{customer.notes}</p>
              </div>
            ) : null}
          </Panel>

          <Panel title="Order history" description="Recent orders for this customer" action={<Button variant="ghost" href="/orders">All orders →</Button>}>
            {orders.length ? (
              <Table headers={["Order", "Restaurant", "Status", "Age", "Total"]}>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <TableCell>
                      <span className="font-bold text-ink">{order.id}</span>
                    </TableCell>
                    <TableCell>{order.restaurant}</TableCell>
                    <TableCell>
                      <Badge label={order.status} />
                    </TableCell>
                    <TableCell>{order.age}</TableCell>
                    <TableCell className="font-bold text-ink">{order.total}</TableCell>
                  </tr>
                ))}
              </Table>
            ) : (
              <p className="p-8 text-center text-[13px] text-muted">No recent sample orders for this customer yet.</p>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Access controls" description="Restrict ordering without deleting the account">
            <div className="space-y-3 p-5">
              <div className="rounded-2xl border border-line bg-[#f8fbee] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[12px] font-semibold text-ink">Current status</p>
                  <Badge label={customer.status} />
                </div>
                <p className="mt-2 text-[12px] leading-5 text-muted">{statusCopy(customer.status)}</p>
              </div>
              {customer.status === "Active" ? (
                <Button variant="danger" disabled={busy} onClick={() => setStatus("Blocked")}>
                  {busy ? "Updating…" : "Block account"}
                </Button>
              ) : (
                <Button disabled={busy} onClick={() => setStatus("Active")}>
                  {busy ? "Updating…" : "Unblock account"}
                </Button>
              )}
              <Button variant="secondary" href="/support">
                Open support tickets
              </Button>
            </div>
          </Panel>

          <Panel title="Saved addresses" description="Delivery locations on file">
            {addresses.length ? (
              <div className="divide-y divide-line">
                {addresses.map((address) => (
                  <div key={`${address.label}-${address.line}`} className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-bold text-ink">{address.label}</p>
                      {address.default ? <Badge label="Default" /> : null}
                    </div>
                    <p className="mt-1 text-[12px] leading-5 text-muted">{address.line}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-8 text-center text-[13px] text-muted">No saved addresses.</p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
