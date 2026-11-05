export type CustomerStatus = "Active" | "Blocked";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  zone: string;
  status: CustomerStatus;
  orders: string;
  spent: string;
  avgOrder: string;
  joined: string;
  lastOrder: string;
  wallet: string;
  payment: string;
  notes: string;
};

export type CustomerOrder = {
  id: string;
  restaurant: string;
  status: string;
  age: string;
  total: string;
};

export type CustomerAddress = {
  label: string;
  line: string;
  default?: boolean;
};

const STORAGE_KEY = "crave.customers.v1";

export const seedCustomers: Customer[] = [
  {
    id: "maya-chen",
    name: "Maya Chen",
    phone: "+1 ••• ••• 4108",
    email: "maya.chen@email.com",
    city: "Central City",
    zone: "Central",
    status: "Active",
    orders: "42",
    spent: "36,820",
    avgOrder: "876",
    joined: "Jun 12, 2026",
    lastOrder: "2 min ago",
    wallet: "1,240",
    payment: "Card · Visa ••41",
    notes: "Prefers contactless delivery. High-value repeat customer.",
  },
  {
    id: "noah-williams",
    name: "Noah Williams",
    phone: "+1 ••• ••• 8821",
    email: "noah.w@email.com",
    city: "Central City",
    zone: "North",
    status: "Active",
    orders: "18",
    spent: "14,540",
    avgOrder: "808",
    joined: "Jul 04, 2026",
    lastOrder: "8 min ago",
    wallet: "0",
    payment: "Cash on delivery",
    notes: "",
  },
  {
    id: "amira-khan",
    name: "Amira Khan",
    phone: "+1 ••• ••• 2907",
    email: "amira.khan@email.com",
    city: "Harbor Town",
    zone: "Waterfront",
    status: "Active",
    orders: "64",
    spent: "52,100",
    avgOrder: "814",
    joined: "Apr 18, 2026",
    lastOrder: "14 min ago",
    wallet: "3,680",
    payment: "Card · Mastercard ••09",
    notes: "VIP — escalate refunds to L2 care.",
  },
  {
    id: "luca-moretti",
    name: "Luca Moretti",
    phone: "+1 ••• ••• 6731",
    email: "luca.m@email.com",
    city: "Central City",
    zone: "South",
    status: "Blocked",
    orders: "3",
    spent: "2,810",
    avgOrder: "937",
    joined: "Oct 20, 2026",
    lastOrder: "21 min ago",
    wallet: "0",
    payment: "Cash on delivery",
    notes: "Blocked after chargeback dispute #CB-992. Review before unblock.",
  },
];

export const recentOrdersByCustomer: Record<string, CustomerOrder[]> = {
  "maya-chen": [
    { id: "FD-2048", restaurant: "Olive & Thyme", status: "Placed", age: "2 min", total: "1,280" },
    { id: "FD-2031", restaurant: "Green Bowl Co.", status: "Delivered", age: "Yesterday", total: "740" },
    { id: "FD-2018", restaurant: "Olive & Thyme", status: "Delivered", age: "3 days", total: "1,120" },
  ],
  "noah-williams": [
    { id: "FD-2047", restaurant: "Northside Grill", status: "Preparing", age: "8 min", total: "2,040" },
    { id: "FD-2029", restaurant: "Red Crust", status: "Delivered", age: "2 days", total: "960" },
  ],
  "amira-khan": [
    { id: "FD-2046", restaurant: "Little Saffron", status: "Ready for pickup", age: "14 min", total: "860" },
    { id: "FD-2040", restaurant: "Olive & Thyme", status: "Delivered", age: "1 day", total: "1,450" },
    { id: "FD-2022", restaurant: "Little Saffron", status: "Delivered", age: "4 days", total: "1,080" },
  ],
  "luca-moretti": [
    { id: "FD-2045", restaurant: "Olive & Thyme", status: "Delivered", age: "21 min", total: "1,540" },
    { id: "FD-1998", restaurant: "Northside Grill", status: "Cancelled", age: "1 week", total: "720" },
  ],
};

export const addressesByCustomer: Record<string, CustomerAddress[]> = {
  "maya-chen": [
    { label: "Home", line: "14 Lark Street, Central City", default: true },
    { label: "Office", line: "Floor 8, Harbor Tower, Central" },
  ],
  "noah-williams": [{ label: "Home", line: "88 North Ridge Ave, Central City", default: true }],
  "amira-khan": [
    { label: "Home", line: "2 Pier Walk, Harbor Town", default: true },
    { label: "Parents", line: "41 Old Port Lane, Harbor Town" },
  ],
  "luca-moretti": [{ label: "Home", line: "9 Oven Court, South District", default: true }],
};

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function readStored(): Customer[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Customer[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStored(customers: Customer[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function listCustomers(): Customer[] {
  const stored = readStored();
  if (!stored?.length) return seedCustomers.map((c) => ({ ...c }));
  const byId = new Map(stored.map((c) => [c.id, c]));
  return seedCustomers.map((seed) => ({ ...seed, ...byId.get(seed.id) }));
}

export function getCustomer(id: string): Customer | null {
  return listCustomers().find((c) => c.id === id) ?? null;
}

export function upsertCustomer(customer: Customer) {
  const current = listCustomers();
  const index = current.findIndex((c) => c.id === customer.id);
  const next = [...current];
  if (index >= 0) next[index] = customer;
  else next.push(customer);
  writeStored(next);
  return customer;
}
