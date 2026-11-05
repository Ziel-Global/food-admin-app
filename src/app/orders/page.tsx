"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Notice, PageTitle, Panel, SearchBox, SelectPill, StatCard, Table, TableCell } from "@/components/ui";
import { Icons } from "@/components/icons";

const initial = [
  { id: "FD-2048", customer: "Maya Chen", restaurant: "Olive & Thyme", rider: "Searching", status: "Placed", age: "2 min", total: "1,280" },
  { id: "FD-2047", customer: "Noah Williams", restaurant: "Northside Grill", rider: "Sam Rivera", status: "Preparing", age: "8 min", total: "2,040" },
  { id: "FD-2046", customer: "Amira Khan", restaurant: "Little Saffron", rider: "Jules Park", status: "Ready for pickup", age: "14 min", total: "860" },
  { id: "FD-2045", customer: "Luca Moretti", restaurant: "Olive & Thyme", rider: "Nora Ali", status: "Delivered", age: "21 min", total: "1,540" },
  { id: "FD-2044", customer: "Hana Kim", restaurant: "Red Crust", rider: "Searching", status: "Placed", age: "24 min", total: "1,050" },
  { id: "FD-2043", customer: "Theo James", restaurant: "Green Bowl Co.", rider: "Mika Shah", status: "Delivered", age: "31 min", total: "920" },
];

function doneCount(status: string) {
  if (status === "Placed") return 1;
  if (status === "Preparing") return 3;
  if (status === "Ready for pickup") return 4;
  if (status === "Delivered") return 6;
  return 2;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(initial);
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const filters = ["All", "Placed", "Preparing", "Ready for pickup", "Delivered"];
  const visible = useMemo(() => (filter === "All" ? orders : orders.filter((order) => order.status === filter)), [filter, orders]);
  const selected = orders.find((order) => order.id === selectedId);
  const steps = ["Order placed", "Restaurant accepted", "Preparing", "Ready for pickup", "Rider picked up", "Delivered"];

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Operations / Orders"
        title="Orders"
        description="Monitor every order, inspect its timeline, and step in when a delivery needs attention."
        action={<Button variant="secondary">Export report ↓</Button>}
      />
      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Placed" value="12" tone="orange" icon={<Icons.orders size={15} />} />
        <StatCard label="Preparing" value="26" tone="blue" icon={<Icons.restaurants size={15} />} />
        <StatCard label="Looking for rider" value="18" tone="ink" icon={<Icons.riders size={15} />} />
        <StatCard label="Delivered today" value="1,142" tone="lime" icon={<Icons.check size={15} />} />
      </div>

      <Panel title="All orders" description="Search by order number, customer, restaurant or rider" action={<Button variant="secondary">Download CSV</Button>}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <SelectPill options={filters} selected={filter} onSelect={setFilter} />
          <SearchBox placeholder="Search orders…" />
        </div>
        <Table headers={["Order", "Customer", "Restaurant", "Rider", "Status", "Placed", "Total", "Actions"]}>
          {visible.map((order) => (
            <tr key={order.id} className="transition hover:bg-surface/70">
              <TableCell>
                <span className="font-bold text-ink">{order.id}</span>
              </TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.restaurant}</TableCell>
              <TableCell>
                {order.rider === "Searching" || order.rider === "Dispatching" ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-orange">
                    <span className="size-1.5 rounded-full bg-orange animate-pulse-dot" />
                    {order.rider}
                  </span>
                ) : (
                  order.rider
                )}
              </TableCell>
              <TableCell>
                <Badge label={order.status} />
              </TableCell>
              <TableCell>{order.age} ago</TableCell>
              <TableCell className="font-bold text-ink">{order.total}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedId(order.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-ink/15 bg-white px-3 text-[12px] font-bold text-ink shadow-sm transition hover:border-ink hover:bg-ink hover:text-lime"
                  >
                    <Icons.eye size={14} />
                    Details
                  </button>
                </div>
              </TableCell>
            </tr>
          ))}
        </Table>
        {!visible.length ? <p className="p-10 text-center text-sm text-muted">No orders match this status.</p> : null}
        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[12px] text-muted">
          <span>
            Showing {visible.length} of {orders.length} sample orders
          </span>
          <span className="flex gap-2">
            <button className="rounded-lg border border-line px-3 py-1.5 hover:bg-surface">Previous</button>
            <button className="rounded-lg border border-line px-3 py-1.5 hover:bg-surface">Next</button>
          </span>
        </div>
      </Panel>

      {selected ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-md" onClick={() => setSelectedId(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`Order ${selected.id} details`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.35)]"
          >
            {/* Modal header */}
            <div className="relative overflow-hidden bg-ink px-6 py-5 text-white">
              <div className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-lime/20 blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-lime px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                      Order details
                    </span>
                    <Badge label={selected.status} />
                  </div>
                  <h2 className="font-display mt-3 text-2xl font-bold tracking-tight">{selected.id}</h2>
                  <p className="mt-1.5 text-[13px] text-white/50">
                    Placed {selected.age} ago · {selected.restaurant}
                  </p>
                </div>
                <button
                  aria-label="Close details"
                  onClick={() => setSelectedId(null)}
                  className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <Icons.close size={18} />
                </button>
              </div>
              <div className="relative mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Total", value: selected.total },
                  { label: "Payment", value: "COD" },
                  { label: "Rider", value: selected.rider === "Searching" ? "Unassigned" : selected.rider.split(" ")[0] },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">{item.label}</p>
                    <p className="mt-1 truncate text-[14px] font-bold text-lime">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal body */}
            <div className="max-h-[calc(92vh-220px)] overflow-y-auto">
              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="border-b border-line p-6 lg:border-b-0 lg:border-r">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[13px] font-bold text-ink">Delivery timeline</h3>
                    <span className="rounded-full bg-lime-soft px-2.5 py-1 text-[10px] font-bold text-ink">
                      {doneCount(selected.status)} / {steps.length} complete
                    </span>
                  </div>
                  <div className="space-y-0">
                    {steps.map((step, index) => {
                      const progress = doneCount(selected.status);
                      const done = index < progress;
                      const current = index === progress;
                      const upcoming = index > progress;
                      return (
                        <div key={step} className="relative flex gap-3 pb-5 last:pb-0">
                          {index < steps.length - 1 ? (
                            <span
                              className={`absolute left-[11px] top-6 h-[calc(100%-8px)] w-px ${
                                done ? "bg-lime" : current ? "bg-ink/25" : "bg-[#d7d7d7]"
                              }`}
                            />
                          ) : null}
                          <span
                            className={`relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                              done
                                ? "bg-lime text-ink shadow-[0_0_12px_rgba(200,255,0,0.45)]"
                                : current
                                  ? "bg-ink text-lime ring-2 ring-lime/40"
                                  : "bg-white text-ink ring-2 ring-[#cfcfcf]"
                            }`}
                          >
                            {done ? <Icons.check size={12} /> : index + 1}
                          </span>
                          <span className="min-w-0 pt-0.5">
                            <span className={`block text-[13px] font-semibold ${upcoming ? "text-[#555]" : "text-ink"}`}>
                              {step}
                            </span>
                            <span
                              className={`mt-0.5 block text-[11px] font-medium ${
                                done ? "text-[#6b7a3a]" : current ? "text-ink" : "text-[#777]"
                              }`}
                            >
                              {index === 0
                                ? `${selected.age} ago`
                                : done
                                  ? "Completed"
                                  : current
                                    ? "In progress"
                                    : "Waiting"}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 p-6">
                  <div className="rounded-2xl border border-line bg-[#fafafa] p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-ink text-[11px] font-bold text-lime">
                        {selected.customer
                          .split(" ")
                          .map((x) => x[0])
                          .join("")}
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Customer</p>
                        <p className="mt-0.5 text-[14px] font-bold text-ink">{selected.customer}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[12px] leading-5 text-muted">Delivery address · Central City, Block 12</p>
                  </div>

                  <div className="rounded-2xl border border-line bg-[#fafafa] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Restaurant</p>
                    <p className="mt-2 text-[14px] font-bold text-ink">{selected.restaurant}</p>
                    <p className="mt-1 text-[12px] text-muted">Kitchen · accepting orders</p>
                  </div>

                  <div className="rounded-2xl border border-line bg-ink p-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-lime/80">Rider & payment</p>
                    <div className="mt-3 space-y-2 text-[13px]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-white/50">Rider</span>
                        <span className="font-bold text-lime">{selected.rider}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-white/50">Payment</span>
                        <span className="font-bold">Cash on delivery</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
                        <span className="text-white/50">Total</span>
                        <span className="font-display text-lg font-bold text-lime">{selected.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-[#fafafa] px-6 py-4">
              <p className="text-[11px] text-muted">Preview actions · API not connected yet</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOrders((current) =>
                      current.map((item) => (item.id === selected.id ? { ...item, rider: "Reassigned · dispatch queue" } : item)),
                    );
                    setNotice(`${selected.id} returned to the dispatch queue.`);
                  }}
                  className="inline-flex h-10 items-center rounded-xl border border-line bg-white px-4 text-[12px] font-bold text-ink transition hover:border-ink"
                >
                  Reassign rider
                </button>
                <button
                  type="button"
                  onClick={() => setNotice(`Refund review opened for ${selected.id}. Payment provider is not connected yet.`)}
                  className="inline-flex h-10 items-center rounded-xl border border-line bg-white px-4 text-[12px] font-bold text-ink transition hover:border-ink"
                >
                  Review refund
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrders((current) => current.map((item) => (item.id === selected.id ? { ...item, status: "Cancelled" } : item)));
                    setNotice(`${selected.id} cancelled in preview. Review the payment before issuing a refund.`);
                    setSelectedId(null);
                  }}
                  className="inline-flex h-10 items-center rounded-xl bg-[#fff0ed] px-4 text-[12px] font-bold text-red transition hover:bg-[#ffe4de]"
                >
                  Cancel order
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
