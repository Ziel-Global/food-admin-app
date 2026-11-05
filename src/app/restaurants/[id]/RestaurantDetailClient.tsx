"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Icons } from "@/components/icons";
import {
  Avatar,
  Badge,
  Button,
  Field,
  FormSection,
  Modal,
  Notice,
  Panel,
  SelectField,
  StatCard,
  Table,
  TableCell,
  TextArea,
  TextInput,
} from "@/components/ui";
import {
  PLATFORM_COMMISSION_DEFAULT,
  cityOptions,
  cuisineOptions,
  estimatedCommission,
  formatCommission,
  getPartner,
  initials,
  parseCommission,
  recentOrdersByRestaurant,
  statusOptions,
  upsertPartner,
  type Partner,
  type PartnerStatus,
} from "@/lib/restaurants";

function statusCopy(status: PartnerStatus) {
  if (status === "Active") return "Visible to customers and accepting orders";
  if (status === "Paused") return "Hidden from search — existing orders continue";
  if (status === "Pending") return "Waiting for ops approval before go-live";
  return "Application rejected — not visible to customers";
}

export default function RestaurantDetailClient({ id }: { id: string }) {
  const router = useRouter();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [missing, setMissing] = useState(false);
  const [form, setForm] = useState<Partner | null>(null);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [commissionOpen, setCommissionOpen] = useState(false);
  const [rateDraft, setRateDraft] = useState("");
  const [rateError, setRateError] = useState("");
  const [rateBusy, setRateBusy] = useState(false);
  const [tab, setTab] = useState<"overview" | "settings">("overview");

  useEffect(() => {
    const found = getPartner(id);
    if (!found) {
      setMissing(true);
      setPartner(null);
      setForm(null);
      return;
    }
    setMissing(false);
    setPartner(found);
    setForm(found);
    setRateDraft(String(parseCommission(found.rate)));
    setCommissionOpen(false);
    setRateError("");
  }, [id]);

  const orders = useMemo(() => recentOrdersByRestaurant[id] ?? [], [id]);
  const commissionLabel = partner ? formatCommission(partner.rate) : `${PLATFORM_COMMISSION_DEFAULT}%`;
  const feeEstimate = partner ? estimatedCommission(partner.gmv, partner.rate) : "0";
  const draftFeeEstimate = partner ? estimatedCommission(partner.gmv, rateDraft || "0") : "0";

  function setField<K extends keyof Partner>(key: K, value: Partner[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  function persist(next: Partner, message: string) {
    upsertPartner(next);
    setPartner(next);
    setForm(next);
    setRateDraft(String(parseCommission(next.rate)));
    setNotice(message);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (!form) return;
    if (!form.name.trim() || !form.owner.trim() || !form.phone.trim() || !form.email.trim() || !form.address.trim()) {
      setNotice("Fill in name, owner, phone, email, and address before saving.");
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      const rateNum = parseCommission(form.rate);
      const next = {
        ...form,
        name: form.name.trim(),
        owner: form.owner.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        rate: `${rateNum}%`,
      };
      persist(next, `${next.name} details updated.`);
      setSaving(false);
      setTab("overview");
    }, 350);
  }

  function setStatus(status: PartnerStatus) {
    if (!partner || statusBusy) return;
    setStatusBusy(true);
    window.setTimeout(() => {
      const next = {
        ...partner,
        status,
        orders: status === "Active" && (partner.orders === "—" || !partner.orders) ? "0" : partner.orders,
      };
      persist(
        next,
        status === "Active"
          ? `${next.name} is live and accepting orders.`
          : status === "Paused"
            ? `${next.name} paused — hidden from customers.`
            : `${next.name} marked ${status.toLowerCase()}.`,
      );
      setStatusBusy(false);
    }, 280);
  }

  function openCommissionModal() {
    if (!partner) return;
    setRateDraft(String(parseCommission(partner.rate)));
    setRateError("");
    setCommissionOpen(true);
  }

  function closeCommissionModal() {
    if (rateBusy) return;
    setCommissionOpen(false);
    setRateError("");
    if (partner) setRateDraft(String(parseCommission(partner.rate)));
  }

  function saveCommission(event?: FormEvent) {
    event?.preventDefault();
    if (!partner || rateBusy) return;
    const n = Number(rateDraft);
    if (!Number.isFinite(n) || n < 0 || n > 40) {
      setRateError("Enter a commission between 0 and 40%.");
      return;
    }
    setRateError("");
    setRateBusy(true);
    window.setTimeout(() => {
      const next = { ...partner, rate: `${n}%` };
      persist(next, `Commission for ${next.name} set to ${n}%.`);
      setCommissionOpen(false);
      setRateBusy(false);
    }, 250);
  }

  if (missing) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-ink text-lime">
          <Icons.restaurants size={22} />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Partner not found</h1>
        <p className="text-[13px] text-muted">This restaurant is not in the partner directory.</p>
        <Button href="/restaurants">Back to restaurants</Button>
      </div>
    );
  }

  if (!partner || !form) {
    return <div className="py-20 text-center text-sm text-muted">Loading partner…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted">
        <Link href="/restaurants" className="font-semibold text-ink hover:underline">
          Restaurants
        </Link>
        <span>/</span>
        <span className="truncate">{partner.name}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 animate-fade-up">
        <div className="flex min-w-0 items-start gap-4">
          <Avatar initials={initials(partner.name)} className="size-14 text-[15px]" />
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lime">
              <span className="size-1.5 rounded-full bg-lime" />
              Partner workspace
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <h1 className="font-display text-[28px] font-bold tracking-[-0.04em] text-ink sm:text-[34px]">{partner.name}</h1>
              <Badge label={partner.status} />
            </div>
            <p className="mt-2 text-[13px] text-muted">
              {partner.cuisine} · {partner.city} · Owner {partner.owner}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => router.push("/restaurants")}>
            ← Directory
          </Button>
          {partner.status === "Active" ? (
            <Button variant="danger" onClick={() => setStatus("Paused")}>
              Pause restaurant
            </Button>
          ) : partner.status === "Paused" || partner.status === "Pending" ? (
            <Button onClick={() => setStatus("Active")}>Go live</Button>
          ) : null}
          <Button variant="secondary" onClick={() => setTab("settings")}>
            Edit details
          </Button>
        </div>
      </div>

      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders today" value={partner.orders === "—" ? "0" : partner.orders} tone="lime" />
        <StatCard label="Customer rating" value={partner.rating} tone="orange" />
        <StatCard label="Commission" value={commissionLabel} tone="blue" />
        <StatCard label="GMV (period)" value={partner.gmv === "—" ? "0" : partner.gmv} tone="ink" />
      </div>

      <div className="inline-flex rounded-xl bg-[#eef3e4] p-1 ring-1 ring-[#dbe5cc]">
        {(
          [
            { id: "overview", label: "Overview" },
            { id: "settings", label: "Manage details" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-4 py-2 text-[12px] font-semibold transition ${
              tab === item.id ? "bg-ink text-lime shadow-sm" : "text-muted hover:bg-white/70 hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-6">
            <Panel title="Partner profile" description="Listing and kitchen contact used across Crave ops">
              <div className="grid gap-0 sm:grid-cols-2">
                {[
                  { label: "Owner / manager", value: partner.owner },
                  { label: "Cuisine", value: partner.cuisine },
                  { label: "City / zone", value: partner.city },
                  { label: "Service hours", value: partner.hours },
                  { label: "Phone", value: partner.phone },
                  { label: "Email", value: partner.email },
                  { label: "Pickup address", value: partner.address, wide: true },
                  { label: "Joined", value: partner.joined },
                  { label: "Partner ID", value: partner.id },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`border-b border-line px-5 py-4 ${item.wide ? "sm:col-span-2" : ""}`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6f7a63]">{item.label}</p>
                    <p className="mt-1.5 text-[13px] font-semibold text-ink">{item.value || "—"}</p>
                  </div>
                ))}
              </div>
              {partner.notes ? (
                <div className="border-t border-line bg-[#f8fbee] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6f7a63]">Internal notes</p>
                  <p className="mt-1.5 text-[13px] leading-5 text-ink">{partner.notes}</p>
                </div>
              ) : null}
            </Panel>

            <Panel title="Recent orders" description="Latest activity for this kitchen" action={<Button variant="ghost" href="/orders">All orders →</Button>}>
              {orders.length ? (
                <Table headers={["Order", "Customer", "Status", "Age", "Total"]}>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <TableCell>
                        <span className="font-bold text-ink">{order.id}</span>
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge label={order.status} />
                      </TableCell>
                      <TableCell>{order.age}</TableCell>
                      <TableCell className="font-bold text-ink">{order.total}</TableCell>
                    </tr>
                  ))}
                </Table>
              ) : (
                <p className="p-8 text-center text-[13px] text-muted">No recent sample orders for this partner yet.</p>
              )}
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="Service controls" description="Change live status without leaving this page">
              <div className="space-y-3 p-5">
                <div className="rounded-2xl border border-line bg-[#f8fbee] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-semibold text-ink">Current status</p>
                    <Badge label={partner.status} />
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-muted">{statusCopy(partner.status)}</p>
                </div>
                <div className="grid gap-2">
                  {partner.status === "Active" ? (
                    <Button variant="danger" disabled={statusBusy} onClick={() => setStatus("Paused")}>
                      {statusBusy ? "Updating…" : "Pause accepting orders"}
                    </Button>
                  ) : null}
                  {partner.status === "Paused" || partner.status === "Rejected" ? (
                    <Button disabled={statusBusy} onClick={() => setStatus("Active")}>
                      {statusBusy ? "Updating…" : "Resume / go live"}
                    </Button>
                  ) : null}
                  {partner.status === "Pending" ? (
                    <>
                      <Button disabled={statusBusy} onClick={() => setStatus("Active")}>
                        {statusBusy ? "Updating…" : "Approve & go live"}
                      </Button>
                      <Button variant="danger" disabled={statusBusy} onClick={() => setStatus("Rejected")}>
                        Reject application
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </Panel>

            <Panel title="Commercial" description="Commission and payout snapshot">
              <div className="space-y-3 p-5">
                <div className="rounded-xl border border-line px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[12px] text-muted">Commission rate</p>
                      <p className="mt-1 text-[20px] font-bold tracking-tight text-ink">{commissionLabel}</p>
                      <p className="mt-1 text-[11px] leading-4 text-soft">
                        Partner override · platform default {PLATFORM_COMMISSION_DEFAULT}%
                      </p>
                    </div>
                    <Button variant="secondary" onClick={openCommissionModal}>
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
                  <span className="text-[12px] text-muted">Period GMV</span>
                  <span className="text-[14px] font-bold text-ink">{partner.gmv === "—" ? "0" : partner.gmv}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-line bg-[#f8fbee] px-4 py-3">
                  <span className="text-[12px] text-muted">Est. platform fee</span>
                  <span className="text-[14px] font-bold text-ink">{feeEstimate}</span>
                </div>

                <Button variant="secondary" href={`/payouts?partner=${encodeURIComponent(partner.name)}`} className="w-full">
                  Open payouts
                </Button>
              </div>
            </Panel>
          </div>
        </div>
      ) : (
        <Panel title="Manage restaurant details" description="Update listing, contact, hours, and commercial terms">
          <form onSubmit={save} className="space-y-7 p-5 sm:p-6">
            <FormSection title="Partner profile" description="Public listing details customers and riders will see.">
              <div className="sm:col-span-2">
                <Field label="Restaurant name" required>
                  <TextInput value={form.name} onChange={(value) => setField("name", value)} required />
                </Field>
              </div>
              <Field label="Owner / manager" required>
                <TextInput value={form.owner} onChange={(value) => setField("owner", value)} required />
              </Field>
              <Field label="Cuisine" required>
                <SelectField
                  value={form.cuisine}
                  onChange={(value) => setField("cuisine", value)}
                  options={cuisineOptions}
                  required
                />
              </Field>
              <Field label="Service hours">
                <TextInput value={form.hours} onChange={(value) => setField("hours", value)} placeholder="11:00 – 23:00" />
              </Field>
              <Field label="Status" required>
                <SelectField
                  value={form.status}
                  onChange={(value) => setField("status", value as PartnerStatus)}
                  options={statusOptions}
                  required
                />
              </Field>
            </FormSection>

            <div className="h-px bg-line" />

            <FormSection title="Location & contact" description="Used for dispatch radius, rider pickup, and ops outreach.">
              <Field label="City" required>
                <SelectField
                  value={form.city}
                  onChange={(value) => setField("city", value)}
                  options={cityOptions}
                  required
                />
              </Field>
              <Field label="Phone" required>
                <TextInput type="tel" value={form.phone} onChange={(value) => setField("phone", value)} required />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Pickup address" required>
                  <TextInput value={form.address} onChange={(value) => setField("address", value)} required />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Owner email" required>
                  <TextInput type="email" value={form.email} onChange={(value) => setField("email", value)} required />
                </Field>
              </div>
            </FormSection>

            <div className="h-px bg-line" />

            <FormSection title="Commercial terms" description={`Overrides apply per restaurant. Platform default is ${PLATFORM_COMMISSION_DEFAULT}%.`}>
              <Field label="Commission %" hint={`Blank uses platform default (${PLATFORM_COMMISSION_DEFAULT}%)`}>
                <TextInput
                  type="number"
                  value={form.rate === "—" ? "" : form.rate.replace("%", "")}
                  onChange={(value) => setField("rate", value ? `${value.replace("%", "")}%` : `${PLATFORM_COMMISSION_DEFAULT}%`)}
                  placeholder={String(PLATFORM_COMMISSION_DEFAULT)}
                />
              </Field>
              <Field label="Customer rating">
                <TextInput value={form.rating} onChange={(value) => setField("rating", value)} placeholder="4.8" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Internal notes">
                  <TextArea value={form.notes} onChange={(value) => setField("notes", value)} rows={3} />
                </Field>
              </div>
            </FormSection>

            <div className="flex flex-wrap justify-end gap-2 border-t border-line pt-5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setForm(partner);
                  setTab("overview");
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </Panel>
      )}

      <Modal
        open={commissionOpen}
        onClose={closeCommissionModal}
        icon={<Icons.pricing size={16} />}
        title="Edit commission"
        description={`Set the partner rate for ${partner.name}. Falls back to the ${PLATFORM_COMMISSION_DEFAULT}% platform default only when cleared in bulk settings.`}
        footer={
          <>
            <Button variant="secondary" onClick={closeCommissionModal} disabled={rateBusy}>
              Cancel
            </Button>
            <Button type="submit" form="edit-commission-form" disabled={rateBusy}>
              {rateBusy ? "Saving…" : "Save commission"}
            </Button>
          </>
        }
      >
        <form id="edit-commission-form" onSubmit={saveCommission} className="space-y-5">
          <Field label="Commission rate" required error={rateError} hint="Allowed range 0–40%">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  type="number"
                  value={rateDraft}
                  onChange={(value) => {
                    setRateDraft(value);
                    setRateError("");
                  }}
                  placeholder={String(PLATFORM_COMMISSION_DEFAULT)}
                  autoFocus
                  required
                />
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-[13px] font-bold text-ink">
                %
              </span>
            </div>
          </Field>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-line px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Period GMV</p>
              <p className="mt-1 text-[15px] font-bold text-ink">{partner.gmv === "—" ? "0" : partner.gmv}</p>
            </div>
            <div className="rounded-xl border border-line bg-[#f8fbee] px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Est. platform fee</p>
              <p className="mt-1 text-[15px] font-bold text-ink">{draftFeeEstimate}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[15, 18, 20, 22, 25].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setRateDraft(String(preset));
                  setRateError("");
                }}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                  rateDraft === String(preset)
                    ? "bg-ink text-lime"
                    : "border border-line bg-white text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </form>
      </Modal>
    </div>
  );
}
