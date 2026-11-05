"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Icons } from "@/components/icons";
import {
  Badge,
  Button,
  Field,
  FormSection,
  Modal,
  Notice,
  PageTitle,
  Panel,
  Person,
  SearchBox,
  SelectField,
  SelectPill,
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
  formatCommission,
  formatLocation,
  initials,
  loadPartners,
  setPartnerStatus,
  slugify,
  statusOptions,
  upsertPartner,
  zonesForCity,
  type Partner,
  type PartnerStatus,
} from "@/lib/restaurants";

const emptyForm = {
  name: "",
  owner: "",
  cuisine: "",
  city: "",
  zone: "",
  phone: "",
  email: "",
  address: "",
  commission: "",
  status: "Pending" as PartnerStatus,
  notes: "",
};

export default function RestaurantsPage() {
  const [rows, setRows] = useState<Partner[]>([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRows(loadPartners());
  }, []);

  const visible = useMemo(() => {
    const byStatus = filter === "All" ? rows : rows.filter((row) => row.status === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.owner.toLowerCase().includes(q) ||
        row.cuisine.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q) ||
        row.zone.toLowerCase().includes(q),
    );
  }, [filter, query, rows]);

  const zoneOptions = zonesForCity(form.city);

  const activeCount = 84 + rows.filter((r) => r.status === "Active").length;
  const pendingCount = rows.filter((r) => r.status === "Pending").length;
  const pausedCount = 4 + rows.filter((r) => r.status === "Paused").length;

  function decide(id: string, status: "Active" | "Rejected") {
    const next = setPartnerStatus(id, status);
    setRows(next);
    const name = next.find((row) => row.id === id)?.name ?? "Partner";
    setNotice(`${name} ${status === "Active" ? "approved" : "rejected"} in this preview.`);
  }

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
    if (!form.name.trim()) next.name = "Restaurant name is required.";
    if (!form.owner.trim()) next.owner = "Owner name is required.";
    if (!form.cuisine) next.cuisine = "Select a cuisine.";
    if (!form.city) next.city = "Select a city.";
    if (!form.zone) next.zone = "Select a zone / district.";
    if (!form.phone.trim()) next.phone = "Contact phone is required.";
    if (!form.email.trim()) next.email = "Contact email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email.";
    if (!form.address.trim()) next.address = "Pickup address is required.";
    if (form.commission && (Number(form.commission) < 0 || Number(form.commission) > 40)) {
      next.commission = "Commission should be between 0 and 40%.";
    }
    const id = slugify(form.name);
    if (rows.some((row) => row.id === id || row.name.toLowerCase() === form.name.trim().toLowerCase())) {
      next.name = "A partner with this name already exists.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);

    window.setTimeout(() => {
      const rate = form.commission.trim()
        ? `${form.commission.trim()}%`
        : `${PLATFORM_COMMISSION_DEFAULT}%`;
      const partner: Partner = {
        id: slugify(form.name),
        name: form.name.trim(),
        owner: form.owner.trim(),
        cuisine: form.cuisine,
        city: form.city,
        zone: form.zone,
        status: form.status,
        orders: form.status === "Active" ? "0" : "—",
        rate,
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
        hours: "11:00 – 23:00",
        joined: "Nov 2026",
        rating: "—",
        gmv: "—",
      };

      const next = upsertPartner(partner);
      setRows(next);
      setNotice(
        form.status === "Active"
          ? `${partner.name} is live in the partner directory.`
          : `${partner.name} added and queued for partner review.`,
      );
      setSaving(false);
      setOpen(false);
      setForm(emptyForm);
      setErrors({});
      if (form.status === "Pending") setFilter("Pending");
      else if (form.status === "Active") setFilter("Active");
    }, 420);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Partners"
        title="Restaurants"
        description="Review partner applications, manage service status, and configure restaurant commission."
        action={<Button onClick={() => setOpen(true)}>Add restaurant +</Button>}
      />
      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Active partners" value={String(activeCount)} tone="lime" />
        <StatCard label="Applications to review" value={String(pendingCount)} tone="orange" />
        <StatCard label="Paused today" value={String(pausedCount)} tone="ink" />
      </div>

      <Panel title="Partner directory" description="Application state and performance across configured cities">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <SelectPill options={["All", "Pending", "Active", "Paused"]} selected={filter} onSelect={setFilter} />
          <SearchBox placeholder="Search partners…" value={query} onChange={setQuery} />
        </div>
        <Table headers={["Restaurant", "Cuisine", "City / zone", "Status", "Orders today", "Commission", ""]}>
          {visible.map((row) => (
            <tr key={row.id} className="transition hover:bg-surface/70">
              <TableCell>
                <Person initials={initials(row.name)} name={row.name} meta={`Owner · ${row.owner}`} />
              </TableCell>
              <TableCell>{row.cuisine}</TableCell>
              <TableCell>{formatLocation(row.city, row.zone)}</TableCell>
              <TableCell>
                <Badge label={row.status} />
              </TableCell>
              <TableCell>{row.orders}</TableCell>
              <TableCell>{formatCommission(row.rate)}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {row.status === "Pending" ? (
                    <>
                      <Button onClick={() => decide(row.id, "Active")}>Approve</Button>
                      <Button variant="danger" onClick={() => decide(row.id, "Rejected")}>
                        Reject
                      </Button>
                      <Button variant="secondary" href={`/restaurants/${row.id}`}>
                        Manage
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" href={`/restaurants/${row.id}`}>
                      Manage
                    </Button>
                  )}
                </div>
              </TableCell>
            </tr>
          ))}
        </Table>
        {!visible.length ? <p className="p-10 text-center text-sm text-muted">No partners in this view.</p> : null}
      </Panel>
      <p className="text-[12px] text-muted">
        Commission rates are per restaurant and fall back to the platform default of {PLATFORM_COMMISSION_DEFAULT}%.
      </p>

      <Modal
        open={open}
        onClose={closeModal}
        size="lg"
        icon={<Icons.restaurants size={16} />}
        title="Add restaurant partner"
        description="Onboard a kitchen for delivery — same flow used by Foodpanda and Uber Eats ops teams."
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="add-restaurant-form" disabled={saving}>
              {saving ? "Saving partner…" : "Add partner"}
            </Button>
          </>
        }
      >
        <form id="add-restaurant-form" onSubmit={submit} className="space-y-7">
          <FormSection title="Partner profile" description="Public listing details customers and riders will see.">
            <div className="sm:col-span-2">
              <Field label="Restaurant name" required error={errors.name}>
                <TextInput
                  value={form.name}
                  onChange={(value) => setField("name", value)}
                  placeholder="e.g. Olive & Thyme"
                  autoFocus
                  required
                />
              </Field>
            </div>
            <Field label="Owner / manager" required error={errors.owner}>
              <TextInput
                value={form.owner}
                onChange={(value) => setField("owner", value)}
                placeholder="Full name"
                required
              />
            </Field>
            <Field label="Cuisine" required error={errors.cuisine}>
              <SelectField
                value={form.cuisine}
                onChange={(value) => setField("cuisine", value)}
                options={cuisineOptions}
                placeholder="Select cuisine"
                required
              />
            </Field>
          </FormSection>

          <div className="h-px bg-line" />

          <FormSection title="Location & contact" description="Used for dispatch radius, rider pickup, and ops outreach.">
            <Field label="City" required error={errors.city}>
              <SelectField
                value={form.city}
                onChange={(value) => {
                  const zones = zonesForCity(value);
                  setForm((current) => ({ ...current, city: value, zone: zones[0]?.value ?? "" }));
                  setErrors((current) => ({ ...current, city: undefined, zone: undefined }));
                }}
                options={cityOptions}
                placeholder="Select city"
                required
              />
            </Field>
            <Field label="Zone / district" required error={errors.zone} hint="Sub-area under the selected city">
              <SelectField
                value={form.zone}
                onChange={(value) => setField("zone", value)}
                options={zoneOptions}
                placeholder={form.city ? "Select zone" : "Select a city first"}
                required
              />
            </Field>
            <Field label="Phone" required error={errors.phone} hint="Restaurant operations line">
              <TextInput
                type="tel"
                value={form.phone}
                onChange={(value) => setField("phone", value)}
                placeholder="+1 555 0100"
                required
              />
            </Field>
            <Field label="Owner email" required error={errors.email}>
              <TextInput
                type="email"
                value={form.email}
                onChange={(value) => setField("email", value)}
                placeholder="owner@restaurant.com"
                required
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Pickup address" required error={errors.address}>
                <TextInput
                  value={form.address}
                  onChange={(value) => setField("address", value)}
                  placeholder="Street, unit, landmark"
                  required
                />
              </Field>
            </div>
          </FormSection>

          <div className="h-px bg-line" />

          <FormSection title="Commercial terms" description="Commission overrides the platform default when set.">
            <Field label="Commission %" error={errors.commission} hint="Leave blank to use the global rate">
              <TextInput
                type="number"
                value={form.commission}
                onChange={(value) => setField("commission", value)}
                placeholder="e.g. 18"
              />
            </Field>
            <Field label="Initial status" required>
              <SelectField
                value={form.status}
                onChange={(value) => setField("status", value as PartnerStatus)}
                options={statusOptions}
                required
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Internal notes" hint="Visible only to Crave operations">
                <TextArea
                  value={form.notes}
                  onChange={(value) => setField("notes", value)}
                  placeholder="Contract terms, opening hours, special pickup instructions…"
                  rows={3}
                />
              </Field>
            </div>
          </FormSection>

          <div className="rounded-2xl border border-line bg-[#f8fbee] px-4 py-3">
            <p className="text-[12px] font-semibold text-ink">What happens next</p>
            <p className="mt-1 text-[12px] leading-5 text-muted">
              The partner appears in the directory immediately. Pending kitchens stay offline for customers until an
              ops reviewer approves them.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
}
