"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Icons } from "@/components/icons";
import {
  Button,
  Field,
  Modal,
  Notice,
  PageTitle,
  Panel,
  SelectField,
  TextInput,
} from "@/components/ui";

type CityKind = "Launch city" | "District";

type CityZone = {
  id: string;
  city: string;
  kind: CityKind;
  parent: string;
  currency: string;
  zones: number;
};

const currencyOptions = [
  { value: "Not set", label: "Not set" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "PKR", label: "PKR — Pakistani Rupee" },
  { value: "AED", label: "AED — UAE Dirham" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "Uses city currency", label: "Uses parent city currency" },
];

const seed: CityZone[] = [
  { id: "central-city", city: "Central City", kind: "Launch city", parent: "", currency: "Not set", zones: 4 },
  { id: "north-district", city: "North District", kind: "District", parent: "Central City", currency: "Uses city currency", zones: 2 },
  { id: "west-district", city: "West District", kind: "District", parent: "Central City", currency: "Uses city currency", zones: 3 },
];

const emptyForm = {
  city: "",
  kind: "Launch city" as CityKind,
  parent: "Central City",
  currency: "Not set",
  zones: "1",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PricingPage() {
  const [saved, setSaved] = useState(false);
  const [commission, setCommission] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [baseDelivery, setBaseDelivery] = useState("");
  const [cities, setCities] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const launchCities = useMemo(
    () => cities.filter((item) => item.kind === "Launch city").map((item) => item.city),
    [cities],
  );

  const parentOptions = useMemo(
    () =>
      (launchCities.length ? launchCities : ["Central City"]).map((city) => ({
        value: city,
        label: city,
      })),
    [launchCities],
  );

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
    if (!form.city.trim()) next.city = "City name is required.";
    if (cities.some((item) => item.city.toLowerCase() === form.city.trim().toLowerCase())) {
      next.city = "A city with this name already exists.";
    }
    if (form.kind === "District" && !form.parent) next.parent = "Select a parent launch city.";
    if (!form.currency) next.currency = "Select a currency.";
    const zones = Number(form.zones);
    if (!Number.isFinite(zones) || zones < 1 || zones > 40) {
      next.zones = "Enter between 1 and 40 delivery zones.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);

    window.setTimeout(() => {
      const city: CityZone = {
        id: slugify(form.city),
        city: form.city.trim(),
        kind: form.kind,
        parent: form.kind === "District" ? form.parent : "",
        currency:
          form.kind === "District" && form.currency === "Not set"
            ? "Uses city currency"
            : form.currency,
        zones: Number(form.zones),
      };
      setCities((current) => [city, ...current]);
      setNotice(`${city.city} added to configured cities.`);
      setSaving(false);
      setOpen(false);
      setForm(emptyForm);
      setErrors({});
    }, 280);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Platform / Configuration"
        title="Pricing & delivery zones"
        description="Set platform fees, commission defaults, city currencies and dispatch coverage. Rates remain configurable by restaurant."
        action={<Button onClick={() => setSaved(true)}>Save changes</Button>}
      />
      {saved ? <Notice>Preview settings saved locally. Connect the settings API to persist them.</Notice> : null}
      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Platform fee defaults" description="These defaults apply only when a city or restaurant has no override">
          <div className="space-y-4 p-5 sm:p-6">
            {[
              {
                label: "Default restaurant commission",
                value: commission,
                set: setCommission,
                suffix: "%",
                help: "Restaurant-specific commission rates take precedence.",
              },
              {
                label: "Service fee",
                value: serviceFee,
                set: setServiceFee,
                suffix: "local currency",
                help: "Shown to customers at checkout.",
              },
              {
                label: "Tax rate",
                value: taxRate,
                set: setTaxRate,
                suffix: "%",
                help: "Tax rules depend on the launch country.",
              },
              {
                label: "Base delivery fee",
                value: baseDelivery,
                set: setBaseDelivery,
                suffix: "local currency",
                help: "Delivery zone values can override this default.",
              },
            ].map((field) => (
              <label key={field.label} className="block">
                <span className="text-[12px] font-bold text-ink">{field.label}</span>
                <div className="mt-2 flex">
                  <input
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    placeholder="Not configured"
                    className="h-11 flex-1 rounded-l-xl border border-r-0 border-line-strong bg-surface px-3 text-[13px] outline-none focus:border-ink focus:bg-card"
                  />
                  <span className="flex min-w-28 items-center justify-center rounded-r-xl border border-line-strong bg-card px-2 text-[11px] text-muted">
                    {field.suffix}
                  </span>
                </div>
                <span className="mt-1.5 block text-[11px] text-soft">{field.help}</span>
              </label>
            ))}
          </div>
        </Panel>

        <Panel title="Dispatch policy" description="Control how delivery offers are sent to riders">
          <div className="space-y-4 p-5 sm:p-6">
            {[
              { label: "Initial rider search radius", value: "5", unit: "km" },
              { label: "Offer response time", value: "30", unit: "seconds" },
              { label: "Maximum offer attempts", value: "5", unit: "riders" },
              { label: "Idle rider timeout", value: "10", unit: "minutes" },
            ].map((field) => (
              <label key={field.label} className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-ink">{field.label}</span>
                <span className="flex items-center gap-2">
                  <input
                    defaultValue={field.value}
                    className="h-10 w-20 rounded-xl border border-line-strong bg-surface px-2 text-center text-[13px] outline-none focus:border-ink"
                  />
                  <span className="w-16 text-[11px] text-muted">{field.unit}</span>
                </span>
              </label>
            ))}
            <div className="rounded-xl bg-surface p-3 text-[12px] leading-5 text-muted">
              When no rider accepts, the search radius widens and the dispatch queue appears here for operations review.
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Configured cities & zones"
        description="Local currency and service boundaries are set per launch city"
        action={
          <Button
            variant="secondary"
            onClick={() => {
              setForm({
                ...emptyForm,
                parent: launchCities[0] ?? "Central City",
              });
              setOpen(true);
            }}
          >
            Add city +
          </Button>
        }
      >
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {cities.map((zone) => (
            <div key={zone.id} className="rounded-2xl border border-line p-4 transition hover:border-ink/20 hover:shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[14px] font-bold text-ink">{zone.city}</p>
                <button type="button" className="text-soft" aria-label={`${zone.city} options`}>
                  •••
                </button>
              </div>
              <p className="mt-2 text-[12px] text-muted">
                {zone.kind === "Launch city" ? "Launch city" : zone.parent} · {zone.currency}
              </p>
              <p className="mt-4 text-[12px] font-semibold text-ink">
                {zone.zones} delivery zone{zone.zones === 1 ? "" : "s"} →
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <Modal
        open={open}
        onClose={closeModal}
        size="lg"
        icon={<Icons.map size={16} />}
        title="Add city"
        description="Configure a launch city or district with currency and initial delivery zones."
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="add-city-form" disabled={saving}>
              {saving ? "Adding…" : "Add city"}
            </Button>
          </>
        }
      >
        <form id="add-city-form" onSubmit={submit} className="space-y-5">
          <Field label="City name" required error={errors.city}>
            <TextInput
              value={form.city}
              onChange={(value) => setField("city", value)}
              placeholder="e.g. East District"
              autoFocus
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type" required>
              <SelectField
                value={form.kind}
                onChange={(value) => {
                  const kind = value as CityKind;
                  setField("kind", kind);
                  if (kind === "District" && form.currency === "Not set") {
                    setField("currency", "Uses city currency");
                  }
                  if (kind === "Launch city" && form.currency === "Uses city currency") {
                    setField("currency", "Not set");
                  }
                }}
                options={[
                  { value: "Launch city", label: "Launch city" },
                  { value: "District", label: "District / zone group" },
                ]}
                required
              />
            </Field>

            {form.kind === "District" ? (
              <Field label="Parent launch city" required error={errors.parent}>
                <SelectField
                  value={form.parent}
                  onChange={(value) => setField("parent", value)}
                  options={parentOptions}
                  required
                />
              </Field>
            ) : (
              <Field label="Delivery zones" required error={errors.zones} hint="Starting coverage polygons">
                <TextInput
                  type="number"
                  value={form.zones}
                  onChange={(value) => setField("zones", value)}
                  placeholder="1"
                  required
                />
              </Field>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Currency" required error={errors.currency}>
              <SelectField
                value={form.currency}
                onChange={(value) => setField("currency", value)}
                options={
                  form.kind === "Launch city"
                    ? currencyOptions.filter((option) => option.value !== "Uses city currency")
                    : currencyOptions
                }
                required
              />
            </Field>

            {form.kind === "District" ? (
              <Field label="Delivery zones" required error={errors.zones} hint="Starting coverage polygons">
                <TextInput
                  type="number"
                  value={form.zones}
                  onChange={(value) => setField("zones", value)}
                  placeholder="1"
                  required
                />
              </Field>
            ) : (
              <div className="rounded-xl border border-line bg-[#f8fbee] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6f7a63]">Launch city</p>
                <p className="mt-1 text-[12px] leading-5 text-muted">
                  Districts under this city can inherit currency and dispatch defaults.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-[#f8fbee] px-4 py-3">
            <p className="text-[12px] font-semibold text-ink">What happens next</p>
            <p className="mt-1 text-[12px] leading-5 text-muted">
              The city appears in pricing coverage immediately. Zone polygons and rider dispatch radius can be refined
              after launch.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
}
