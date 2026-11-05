export type PartnerStatus = "Active" | "Pending" | "Paused" | "Rejected";

export type Partner = {
  id: string;
  name: string;
  owner: string;
  cuisine: string;
  city: string;
  status: PartnerStatus;
  orders: string;
  rate: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  hours: string;
  joined: string;
  rating: string;
  gmv: string;
};

const STORAGE_KEY = "crave.partners.v2";

/** Platform default when a partner has no override */
export const PLATFORM_COMMISSION_DEFAULT = 20;

export const cuisineOptions = [
  { value: "Mediterranean", label: "Mediterranean" },
  { value: "American", label: "American" },
  { value: "South Asian", label: "South Asian" },
  { value: "Italian", label: "Italian" },
  { value: "Healthy", label: "Healthy" },
  { value: "East Asian", label: "East Asian" },
  { value: "Mexican", label: "Mexican" },
  { value: "Fast food", label: "Fast food" },
  { value: "Desserts", label: "Desserts" },
  { value: "Other", label: "Other" },
];

export const cityOptions = [
  { value: "Central City", label: "Central City" },
  { value: "North District", label: "North District" },
  { value: "South District", label: "South District" },
  { value: "West District", label: "West District" },
  { value: "East District", label: "East District" },
];

export const statusOptions = [
  { value: "Pending", label: "Pending review" },
  { value: "Active", label: "Active — go live" },
  { value: "Paused", label: "Paused" },
];

export const seedPartners: Partner[] = [
  {
    id: "olive-thyme",
    name: "Olive & Thyme",
    owner: "Mina Patel",
    cuisine: "Mediterranean",
    city: "Central City",
    status: "Active",
    orders: "148",
    rate: "18%",
    phone: "+1 555 0142",
    email: "mina@oliveandthyme.com",
    address: "18 Market Street, Central City",
    notes: "Preferred pickup at rear alley after 8pm.",
    hours: "11:00 – 23:00",
    joined: "Mar 2025",
    rating: "4.8",
    gmv: "184,200",
  },
  {
    id: "northside-grill",
    name: "Northside Grill",
    owner: "Ethan Brooks",
    cuisine: "American",
    city: "North District",
    status: "Active",
    orders: "122",
    rate: "20%",
    phone: "+1 555 0198",
    email: "ethan@northsidegrill.com",
    address: "402 North Avenue, North District",
    notes: "Busy lunch rush — keep dispatch radius tight.",
    hours: "10:00 – 22:00",
    joined: "Jan 2025",
    rating: "4.6",
    gmv: "152,400",
  },
  {
    id: "saffron-house",
    name: "Saffron House",
    owner: "Amira Hassan",
    cuisine: "South Asian",
    city: "Central City",
    status: "Pending",
    orders: "—",
    rate: "20%",
    phone: "+1 555 0111",
    email: "amira@saffronhouse.com",
    address: "7 Spice Lane, Central City",
    notes: "Awaiting kitchen hygiene certificate.",
    hours: "12:00 – 00:00",
    joined: "Oct 2026",
    rating: "—",
    gmv: "—",
  },
  {
    id: "green-bowl-co",
    name: "Green Bowl Co.",
    owner: "Leo Martin",
    cuisine: "Healthy",
    city: "West District",
    status: "Pending",
    orders: "—",
    rate: "20%",
    phone: "+1 555 0166",
    email: "leo@greenbowl.co",
    address: "90 Willow Road, West District",
    notes: "Menu photos pending brand review.",
    hours: "09:00 – 21:00",
    joined: "Oct 2026",
    rating: "—",
    gmv: "—",
  },
  {
    id: "red-crust-pizza",
    name: "Red Crust Pizza",
    owner: "Sofia Rossi",
    cuisine: "Italian",
    city: "South District",
    status: "Paused",
    orders: "54",
    rate: "22%",
    phone: "+1 555 0177",
    email: "sofia@redcrust.com",
    address: "221 Oven Court, South District",
    notes: "Paused for oven maintenance — resume Friday.",
    hours: "12:00 – 23:30",
    joined: "Jun 2025",
    rating: "4.4",
    gmv: "96,800",
  },
];

export function parseCommission(rate: string) {
  if (!rate || rate === "—") return PLATFORM_COMMISSION_DEFAULT;
  const n = Number(String(rate).replace("%", "").trim());
  return Number.isFinite(n) ? n : PLATFORM_COMMISSION_DEFAULT;
}

export function formatCommission(rate: string) {
  if (!rate || rate === "—") return `${PLATFORM_COMMISSION_DEFAULT}%`;
  return rate.includes("%") ? rate : `${rate}%`;
}

export function parseMoney(value: string) {
  if (!value || value === "—") return 0;
  return Number(String(value).replace(/,/g, "")) || 0;
}

export function formatMoney(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

export function estimatedCommission(gmv: string, rate: string) {
  return formatMoney((parseMoney(gmv) * parseCommission(rate)) / 100);
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function readOverrides(): Partner[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partner[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOverrides(partners: Partner[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
}

export function loadPartners(): Partner[] {
  const overrides = readOverrides();
  if (!overrides.length) return [...seedPartners];

  const byId = new Map<string, Partner>();
  for (const partner of seedPartners) byId.set(partner.id, partner);
  for (const partner of overrides) byId.set(partner.id, partner);
  return Array.from(byId.values()).sort((a, b) => {
    const aSeed = seedPartners.findIndex((p) => p.id === a.id);
    const bSeed = seedPartners.findIndex((p) => p.id === b.id);
    if (aSeed === -1 && bSeed === -1) return a.name.localeCompare(b.name);
    if (aSeed === -1) return -1;
    if (bSeed === -1) return 1;
    return aSeed - bSeed;
  });
}

export function getPartner(id: string): Partner | undefined {
  return loadPartners().find((partner) => partner.id === id);
}

export function upsertPartner(partner: Partner) {
  const current = loadPartners();
  const next = current.some((item) => item.id === partner.id)
    ? current.map((item) => (item.id === partner.id ? partner : item))
    : [partner, ...current];
  writeOverrides(next);
  return next;
}

export function setPartnerStatus(id: string, status: PartnerStatus) {
  const partner = getPartner(id);
  if (!partner) return loadPartners();
  return upsertPartner({
    ...partner,
    status,
    orders: status === "Active" && partner.orders === "—" ? "0" : partner.orders,
  });
}

export const recentOrdersByRestaurant: Record<string, { id: string; customer: string; total: string; status: string; age: string }[]> = {
  "olive-thyme": [
    { id: "FD-2048", customer: "Maya Chen", total: "1,280", status: "Placed", age: "2 min" },
    { id: "FD-2045", customer: "Luca Moretti", total: "1,540", status: "Delivered", age: "21 min" },
    { id: "FD-2039", customer: "Priya Shah", total: "920", status: "Delivered", age: "1 hr" },
  ],
  "northside-grill": [
    { id: "FD-2047", customer: "Noah Williams", total: "2,040", status: "Preparing", age: "8 min" },
    { id: "FD-2033", customer: "Kim Lee", total: "1,100", status: "Delivered", age: "2 hr" },
  ],
  "red-crust-pizza": [
    { id: "FD-2044", customer: "Hana Kim", total: "1,050", status: "Placed", age: "24 min" },
    { id: "FD-2021", customer: "Omar Said", total: "780", status: "Delivered", age: "Yesterday" },
  ],
};
