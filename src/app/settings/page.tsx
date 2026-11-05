"use client";

import { useState, type FormEvent } from "react";
import { Icons } from "@/components/icons";
import {
  Button,
  Field,
  Modal,
  Notice,
  PageTitle,
  Panel,
  SelectField,
  TextArea,
  TextInput,
} from "@/components/ui";

type SafeguardId = "responseWindow" | "cashLimit" | "cancelPolicy" | "deliveryPin";
type PaymentId = "cod" | "card" | "wallet";
type ModalKind = { type: "safeguard"; id: SafeguardId } | { type: "payment"; id: PaymentId } | null;

type Safeguards = {
  responseWindow: string;
  cashLimit: string;
  cancelBefore: string;
  cancelAfter: string;
  cancelNote: string;
  deliveryPin: string;
};

type PaymentMethod = {
  id: PaymentId;
  name: string;
  enabled: boolean;
  status: string;
  provider: string;
  note: string;
};

const pinOptions = [
  { value: "Off", label: "Off — never require PIN" },
  { value: "Optional", label: "Optional — customer can enable" },
  { value: "Required", label: "Required — all deliveries" },
  { value: "High value only", label: "High value orders only" },
];

const windowOptions = ["1 min", "2 min", "3 min", "5 min", "10 min"];

const cardProviders = [
  { value: "Not set", label: "Not set" },
  { value: "Stripe", label: "Stripe" },
  { value: "PayFast", label: "PayFast" },
  { value: "Adyen", label: "Adyen" },
  { value: "Other", label: "Other gateway" },
];

const walletProviders = [
  { value: "Not set", label: "Not set" },
  { value: "Crave Wallet", label: "Crave Wallet" },
  { value: "JazzCash", label: "JazzCash" },
  { value: "Easypaisa", label: "Easypaisa" },
  { value: "Other", label: "Other wallet" },
];

const enabledOptions = [
  { value: "Enabled", label: "Enabled" },
  { value: "Disabled", label: "Disabled" },
];

const emptyErrors: Partial<
  Record<"responseWindow" | "cashLimit" | "cancelBefore" | "cancelAfter" | "provider" | "status", string>
> = {};

const initialPayments: PaymentMethod[] = [
  {
    id: "cod",
    name: "Cash on delivery",
    enabled: true,
    status: "Available for launch",
    provider: "Built-in",
    note: "Riders collect cash at handoff. Reconcile against rider payouts.",
  },
  {
    id: "card",
    name: "Card payments",
    enabled: false,
    status: "Add gateway later",
    provider: "Not set",
    note: "",
  },
  {
    id: "wallet",
    name: "Wallet",
    enabled: false,
    status: "Not configured",
    provider: "Not set",
    note: "",
  },
];

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<ModalKind>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(emptyErrors);
  const [safeguards, setSafeguards] = useState<Safeguards>({
    responseWindow: "2 min",
    cashLimit: "",
    cancelBefore: "Free cancellation",
    cancelAfter: "Partial refund review",
    cancelNote: "Before acceptance customers can cancel freely. After acceptance, refunds need ops review.",
    deliveryPin: "Optional",
  });
  const [payments, setPayments] = useState(initialPayments);
  const [draftSafeguards, setDraftSafeguards] = useState(safeguards);
  const [draftPayment, setDraftPayment] = useState<PaymentMethod | null>(null);

  const rows = [
    {
      id: "responseWindow" as const,
      title: "Restaurant response window",
      sub: "Escalate orders awaiting acceptance",
      value: safeguards.responseWindow,
    },
    {
      id: "cashLimit" as const,
      title: "Rider cash holding limit",
      sub: "Pause new COD offers above this amount",
      value: safeguards.cashLimit.trim() ? safeguards.cashLimit : "Not set",
    },
    {
      id: "cancelPolicy" as const,
      title: "Customer cancellation policy",
      sub: "Configure before and after restaurant acceptance",
      value: "Review rules →",
    },
    {
      id: "deliveryPin" as const,
      title: "Require delivery PIN",
      sub: "Confirm handoff for selected orders",
      value: safeguards.deliveryPin,
    },
  ];

  function openSafeguard(id: SafeguardId) {
    setDraftSafeguards(safeguards);
    setDraftPayment(null);
    setErrors(emptyErrors);
    setModal({ type: "safeguard", id });
  }

  function openPayment(id: PaymentId) {
    const current = payments.find((item) => item.id === id);
    if (!current) return;
    setDraftPayment({ ...current });
    setErrors(emptyErrors);
    setModal({ type: "payment", id });
  }

  function closeModal() {
    if (saving) return;
    setModal(null);
    setDraftPayment(null);
    setErrors(emptyErrors);
  }

  function validate() {
    const next = { ...emptyErrors };
    if (modal?.type === "safeguard") {
      if (modal.id === "responseWindow" && !draftSafeguards.responseWindow) {
        next.responseWindow = "Pick a response window.";
      }
      if (modal.id === "cashLimit" && draftSafeguards.cashLimit) {
        const n = Number(draftSafeguards.cashLimit);
        if (!Number.isFinite(n) || n < 0) next.cashLimit = "Enter a valid amount, or leave blank.";
      }
      if (modal.id === "cancelPolicy") {
        if (!draftSafeguards.cancelBefore.trim()) next.cancelBefore = "Required.";
        if (!draftSafeguards.cancelAfter.trim()) next.cancelAfter = "Required.";
      }
    }
    if (modal?.type === "payment" && draftPayment) {
      if (draftPayment.id !== "cod" && draftPayment.enabled && draftPayment.provider === "Not set") {
        next.provider = "Choose a provider before enabling.";
      }
      if (!draftPayment.status.trim()) next.status = "Status label is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function saveModal(event: FormEvent) {
    event.preventDefault();
    if (!modal || !validate()) return;
    setSaving(true);
    window.setTimeout(() => {
      if (modal.type === "safeguard") {
        setSafeguards(draftSafeguards);
        const label = rows.find((row) => row.id === modal.id)?.title ?? "Safeguard";
        setNotice(`${label} updated.`);
      } else if (draftPayment) {
        const next = {
          ...draftPayment,
          status: draftPayment.enabled
            ? draftPayment.id === "cod"
              ? "Available for launch"
              : draftPayment.provider === "Not set"
                ? "Configured"
                : `Live · ${draftPayment.provider}`
            : draftPayment.id === "card"
              ? "Add gateway later"
              : "Not configured",
        };
        if (draftPayment.status.trim() && draftPayment.status !== initialPayments.find((p) => p.id === draftPayment.id)?.status) {
          next.status = draftPayment.status.trim();
        }
        setPayments((current) => current.map((item) => (item.id === next.id ? next : item)));
        setNotice(`${next.name} updated.`);
      }
      setSaving(false);
      setModal(null);
      setDraftPayment(null);
      setSaved(false);
    }, 250);
  }

  const modalMeta =
    modal?.type === "safeguard"
      ? modal.id === "responseWindow"
        ? {
            title: "Restaurant response window",
            description: "How long a restaurant has to accept before ops is alerted.",
          }
        : modal.id === "cashLimit"
          ? {
              title: "Rider cash holding limit",
              description: "Pause COD offers once a rider’s collected cash exceeds this amount.",
            }
          : modal.id === "cancelPolicy"
            ? {
                title: "Customer cancellation policy",
                description: "Rules before and after the restaurant accepts an order.",
              }
            : {
                title: "Require delivery PIN",
                description: "When riders must collect a PIN before completing handoff.",
              }
      : modal?.type === "payment" && draftPayment
        ? {
            title: draftPayment.name,
            description:
              draftPayment.id === "cod"
                ? "Enable or pause cash collection at delivery."
                : draftPayment.id === "card"
                  ? "Connect a card gateway for online checkout."
                  : "Configure customer wallet payouts and top-ups.",
          }
        : { title: "Settings", description: undefined };

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Configuration"
        title="Platform settings"
        description="Manage platform defaults, regional operations, safety limits and communication preferences."
        action={
          <Button
            onClick={() => {
              setSaved(true);
              setNotice("Settings saved in this preview. Connect the settings API to persist them.");
            }}
          >
            Save settings
          </Button>
        }
      />
      {notice ? <Notice>{notice}</Notice> : null}
      {saved && !notice ? <Notice>Settings saved in this preview. Connect the settings API to persist them.</Notice> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Platform profile" description="Names and regional defaults">
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {[
              { label: "Platform name", placeholder: "Crave" },
              { label: "Support email", placeholder: "support@crave.app" },
              { label: "Default country", placeholder: "Choose at launch" },
              { label: "Currency", placeholder: "Set with launch region" },
              { label: "Timezone", placeholder: "Choose city timezone" },
              { label: "Default language", placeholder: "English" },
            ].map((field) => (
              <label key={field.label} className="text-[12px] font-bold text-ink">
                {field.label}
                <input
                  placeholder={field.placeholder}
                  className="mt-2 h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-[13px] font-normal outline-none focus:border-ink focus:bg-card"
                />
              </label>
            ))}
          </div>
        </Panel>

        <Panel title="Order & rider safeguards" description="Operational limits that protect customers and partners">
          <div className="divide-y divide-line">
            {rows.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <span>
                  <span className="block text-[13px] font-bold text-ink">{item.title}</span>
                  <span className="mt-1 block text-[12px] text-muted">{item.sub}</span>
                </span>
                <button
                  type="button"
                  onClick={() => openSafeguard(item.id)}
                  className="rounded-xl border border-line-strong px-3 py-2 text-[11px] font-semibold text-ink transition hover:border-ink hover:bg-surface"
                >
                  {item.value}
                </button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Payment methods" description="Online gateways will be configured after cash-on-delivery flows">
          <div className="space-y-3 p-5">
            {payments.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openPayment(item.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-surface p-3 text-left transition hover:border-ink/15 hover:bg-white"
              >
                <span
                  className={`grid size-9 place-items-center rounded-lg text-[12px] font-bold ${
                    item.enabled ? "bg-lime text-ink" : "border border-line bg-card text-muted"
                  }`}
                >
                  {item.enabled ? "✓" : "＋"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-ink">{item.name}</span>
                  <span className="mt-0.5 block text-[11px] text-muted">
                    {item.enabled ? "Enabled" : "Disabled"}
                    {item.provider !== "Not set" && item.provider !== "Built-in" ? ` · ${item.provider}` : ""}
                  </span>
                </span>
                <span className="text-[12px] text-muted">{item.status}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Notifications" description="Service channels and escalation settings">
          <div className="divide-y divide-line">
            {["Order placed and status updates", "Restaurant order alerts", "Rider offer expiry", "Support ticket assignment"].map((item) => (
              <label key={item} className="flex items-center justify-between px-5 py-4 text-[13px] font-semibold text-ink">
                {item}
                <input type="checkbox" defaultChecked className="size-4 accent-ink" />
              </label>
            ))}
          </div>
        </Panel>
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={closeModal}
        icon={modal?.type === "payment" ? <Icons.payouts size={16} /> : <Icons.settings size={16} />}
        title={modalMeta.title}
        description={modalMeta.description}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="settings-modal-form" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <form id="settings-modal-form" onSubmit={saveModal} className="space-y-5">
          {modal?.type === "safeguard" && modal.id === "responseWindow" ? (
            <Field label="Response window" required error={errors.responseWindow}>
              <SelectField
                value={draftSafeguards.responseWindow}
                onChange={(value) => {
                  setDraftSafeguards((current) => ({ ...current, responseWindow: value }));
                  setErrors((current) => ({ ...current, responseWindow: undefined }));
                }}
                options={windowOptions}
                required
              />
            </Field>
          ) : null}

          {modal?.type === "safeguard" && modal.id === "cashLimit" ? (
            <Field label="Cash holding limit" error={errors.cashLimit} hint="Leave blank for no limit. Amount is in local currency.">
              <TextInput
                type="number"
                value={draftSafeguards.cashLimit}
                onChange={(value) => {
                  setDraftSafeguards((current) => ({ ...current, cashLimit: value }));
                  setErrors((current) => ({ ...current, cashLimit: undefined }));
                }}
                placeholder="e.g. 25000"
                autoFocus
              />
            </Field>
          ) : null}

          {modal?.type === "safeguard" && modal.id === "cancelPolicy" ? (
            <>
              <Field label="Before restaurant acceptance" required error={errors.cancelBefore}>
                <TextInput
                  value={draftSafeguards.cancelBefore}
                  onChange={(value) => {
                    setDraftSafeguards((current) => ({ ...current, cancelBefore: value }));
                    setErrors((current) => ({ ...current, cancelBefore: undefined }));
                  }}
                  placeholder="e.g. Free cancellation"
                  autoFocus
                  required
                />
              </Field>
              <Field label="After restaurant acceptance" required error={errors.cancelAfter}>
                <TextInput
                  value={draftSafeguards.cancelAfter}
                  onChange={(value) => {
                    setDraftSafeguards((current) => ({ ...current, cancelAfter: value }));
                    setErrors((current) => ({ ...current, cancelAfter: undefined }));
                  }}
                  placeholder="e.g. Partial refund review"
                  required
                />
              </Field>
              <Field label="Internal note" hint="Visible only to Crave operations">
                <TextArea
                  value={draftSafeguards.cancelNote}
                  onChange={(value) => setDraftSafeguards((current) => ({ ...current, cancelNote: value }))}
                  rows={3}
                  placeholder="Explain exception cases for care agents…"
                />
              </Field>
            </>
          ) : null}

          {modal?.type === "safeguard" && modal.id === "deliveryPin" ? (
            <Field label="PIN requirement" required>
              <SelectField
                value={draftSafeguards.deliveryPin}
                onChange={(value) => setDraftSafeguards((current) => ({ ...current, deliveryPin: value }))}
                options={pinOptions}
                required
              />
            </Field>
          ) : null}

          {modal?.type === "payment" && draftPayment ? (
            <>
              <Field label="Availability" required>
                <SelectField
                  value={draftPayment.enabled ? "Enabled" : "Disabled"}
                  onChange={(value) =>
                    setDraftPayment((current) =>
                      current ? { ...current, enabled: value === "Enabled" } : current,
                    )
                  }
                  options={enabledOptions}
                  required
                />
              </Field>

              {draftPayment.id !== "cod" ? (
                <Field label="Provider" required error={errors.provider}>
                  <SelectField
                    value={draftPayment.provider}
                    onChange={(value) => {
                      setDraftPayment((current) => (current ? { ...current, provider: value } : current));
                      setErrors((current) => ({ ...current, provider: undefined }));
                    }}
                    options={draftPayment.id === "card" ? cardProviders : walletProviders}
                    required
                  />
                </Field>
              ) : (
                <div className="rounded-xl border border-line bg-[#f8fbee] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Provider</p>
                  <p className="mt-1 text-[13px] font-semibold text-ink">Built-in COD flow</p>
                </div>
              )}

              <Field label="Status label" required error={errors.status} hint="Shown in the payment methods list">
                <TextInput
                  value={draftPayment.status}
                  onChange={(value) => {
                    setDraftPayment((current) => (current ? { ...current, status: value } : current));
                    setErrors((current) => ({ ...current, status: undefined }));
                  }}
                  placeholder="e.g. Available for launch"
                  required
                />
              </Field>

              <Field label="Internal note">
                <TextArea
                  value={draftPayment.note}
                  onChange={(value) => setDraftPayment((current) => (current ? { ...current, note: value } : current))}
                  rows={3}
                  placeholder="Ops notes, rollout plan, or merchant restrictions…"
                />
              </Field>
            </>
          ) : null}

          <div className="rounded-2xl border border-line bg-[#f8fbee] px-4 py-3">
            <p className="text-[12px] font-semibold text-ink">Applies immediately</p>
            <p className="mt-1 text-[12px] leading-5 text-muted">
              Changes update this preview right away. Use Save settings on the page when you’re ready to persist the full
              configuration.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
}
