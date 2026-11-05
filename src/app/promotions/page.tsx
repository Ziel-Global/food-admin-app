"use client";

import { useState, type FormEvent } from "react";
import { Icons } from "@/components/icons";
import {
  Badge,
  Button,
  Field,
  Modal,
  Notice,
  PageTitle,
  Panel,
  SelectField,
  StatCard,
  Table,
  TableCell,
  TextInput,
} from "@/components/ui";

type Promotion = {
  code: string;
  description: string;
  type: string;
  value: string;
  uses: string;
  status: "Active" | "Paused";
};

const initial: Promotion[] = [
  { code: "WELCOME15", description: "New customer first order", type: "Percentage", value: "15%", uses: "284 / 500", status: "Active" },
  { code: "FREESHIP", description: "Delivery fee discount", type: "Free delivery", value: "—", uses: "1,042 / 2,000", status: "Active" },
  { code: "LUNCH10", description: "Weekday lunch offer", type: "Fixed amount", value: "10 local", uses: "96 / 250", status: "Paused" },
];

const typeOptions = ["Percentage", "Fixed amount", "Free delivery"];
const statusOptions = [
  { value: "Active", label: "Active — live now" },
  { value: "Paused", label: "Paused" },
];

const emptyForm = {
  code: "",
  description: "",
  kind: "Percentage",
  value: "",
  limit: "",
  status: "Active" as "Active" | "Paused",
};

export default function PromotionsPage() {
  const [rows, setRows] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  function setField<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function closeModal() {
    if (saving) return;
    setOpen(false);
    setForm(emptyForm);
    setErrors({});
  }

  function validate() {
    const next: Partial<Record<keyof typeof emptyForm, string>> = {};
    const code = form.code.trim().toUpperCase();
    if (!code) next.code = "Promotion code is required.";
    else if (!/^[A-Z0-9_-]{3,24}$/.test(code)) next.code = "Use 3–24 letters, numbers, - or _.";
    else if (rows.some((row) => row.code === code)) next.code = "This code already exists.";
    if (!form.description.trim()) next.description = "Add a short description.";
    if (form.kind !== "Free delivery") {
      if (!form.value.trim()) next.value = "Enter a discount value.";
      else if (Number(form.value) <= 0) next.value = "Value must be greater than 0.";
    }
    if (form.limit && (!Number.isFinite(Number(form.limit)) || Number(form.limit) < 1)) {
      next.limit = "Limit must be at least 1.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);

    window.setTimeout(() => {
      const code = form.code.trim().toUpperCase();
      const value =
        form.kind === "Free delivery"
          ? "—"
          : form.kind === "Percentage"
            ? `${form.value.trim()}%`
            : `${form.value.trim()} local`;
      const promotion: Promotion = {
        code,
        description: form.description.trim(),
        type: form.kind,
        value,
        uses: form.limit.trim() ? `0 / ${form.limit.trim()}` : "0 / —",
        status: form.status,
      };
      setRows((current) => [promotion, ...current]);
      setNotice(`${code} created and ${form.status === "Active" ? "is live" : "saved as paused"}.`);
      setSaving(false);
      setOpen(false);
      setForm(emptyForm);
      setErrors({});
    }, 280);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Growth / Promotions"
        title="Promotions"
        description="Create platform-wide or restaurant-specific discounts and monitor redemption limits."
        action={<Button onClick={() => setOpen(true)}>Create promotion +</Button>}
      />
      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Active promotions" value={rows.filter((row) => row.status === "Active").length.toString()} tone="lime" />
        <StatCard label="Redemptions this month" value="1,422" tone="orange" />
        <StatCard label="Discounts funded" value="Configured" tone="ink" />
      </div>

      <Panel title="Promotion codes" description="Track start and expiry dates, use limits and eligibility">
        <Table headers={["Code", "Description", "Discount", "Redemptions", "Status", ""]}>
          {rows.map((row) => (
            <tr key={row.code} className="transition hover:bg-surface/70">
              <TableCell>
                <span className="rounded-lg bg-ink px-2.5 py-1 font-mono text-[11px] font-bold text-lime">{row.code}</span>
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                {row.type} · {row.value}
              </TableCell>
              <TableCell>{row.uses}</TableCell>
              <TableCell>
                <Badge label={row.status} />
              </TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setRows((current) =>
                      current.map((item) =>
                        item.code === row.code ? { ...item, status: item.status === "Active" ? "Paused" : "Active" } : item,
                      ),
                    )
                  }
                >
                  {row.status === "Active" ? "Pause" : "Activate"}
                </Button>
              </TableCell>
            </tr>
          ))}
        </Table>
      </Panel>
      <p className="text-[12px] text-muted">Discount values and eligibility should be confirmed before the campaign is published.</p>

      <Modal
        open={open}
        onClose={closeModal}
        size="lg"
        icon={<Icons.promotions size={16} />}
        title="Create promotion"
        description="Set a promo code, discount type, and redemption limit for the platform."
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="create-promotion-form" disabled={saving}>
              {saving ? "Creating…" : "Create promotion"}
            </Button>
          </>
        }
      >
        <form id="create-promotion-form" onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Promotion code" required error={errors.code} hint="Customers enter this at checkout">
              <TextInput
                value={form.code}
                onChange={(value) => setField("code", value.toUpperCase())}
                placeholder="e.g. WELCOME20"
                autoFocus
                required
              />
            </Field>
            <Field label="Discount type" required>
              <SelectField
                value={form.kind}
                onChange={(value) => {
                  setField("kind", value);
                  if (value === "Free delivery") setField("value", "");
                }}
                options={typeOptions}
                required
              />
            </Field>
          </div>

          <Field label="Description" required error={errors.description}>
            <TextInput
              value={form.description}
              onChange={(value) => setField("description", value)}
              placeholder="e.g. New customer first order"
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            {form.kind === "Free delivery" ? (
              <div className="rounded-xl border border-line bg-[#f8fbee] px-4 py-3 sm:col-span-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Discount value</p>
                <p className="mt-1 text-[13px] font-semibold text-ink">Full delivery fee waived</p>
              </div>
            ) : (
              <Field
                label={form.kind === "Percentage" ? "Discount %" : "Discount amount"}
                required
                error={errors.value}
                hint={form.kind === "Percentage" ? "Percent off the order subtotal" : "Fixed amount in local currency"}
              >
                <TextInput
                  type="number"
                  value={form.value}
                  onChange={(value) => setField("value", value)}
                  placeholder={form.kind === "Percentage" ? "15" : "10"}
                  required
                />
              </Field>
            )}
            <Field label="Redemption limit" error={errors.limit} hint="Leave blank for unlimited">
              <TextInput
                type="number"
                value={form.limit}
                onChange={(value) => setField("limit", value)}
                placeholder="e.g. 500"
              />
            </Field>
          </div>

          <Field label="Initial status" required>
            <SelectField
              value={form.status}
              onChange={(value) => setField("status", value as "Active" | "Paused")}
              options={statusOptions}
              required
            />
          </Field>

          <div className="rounded-2xl border border-line bg-[#f8fbee] px-4 py-3">
            <p className="text-[12px] font-semibold text-ink">What happens next</p>
            <p className="mt-1 text-[12px] leading-5 text-muted">
              The code appears in the promotions table immediately. Active codes can be redeemed at checkout; paused
              codes stay hidden from customers.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
}
