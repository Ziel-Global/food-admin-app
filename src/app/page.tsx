import Link from "next/link";
import { Badge, Button, Metric, PageTitle, Panel, Person, Table, TableCell } from "@/components/ui";
import { Icons } from "@/components/icons";

const orders = [
  { id: "FD-2048", customer: "Maya Chen", restaurant: "Olive & Thyme", status: "Placed", time: "2 min ago", total: "1,280" },
  { id: "FD-2047", customer: "Noah Williams", restaurant: "Northside Grill", status: "Preparing", time: "8 min ago", total: "2,040" },
  { id: "FD-2046", customer: "Amira Khan", restaurant: "Little Saffron", status: "Ready for pickup", time: "14 min ago", total: "860" },
  { id: "FD-2045", customer: "Luca Moretti", restaurant: "Olive & Thyme", status: "Delivered", time: "21 min ago", total: "1,540" },
];
const bars = [38, 54, 45, 74, 58, 87, 68];

export default function AdminOverview() {
  return (
    <div className="space-y-7">
      <PageTitle
        eyebrow="Thursday, October 30 · All cities"
        title="Good afternoon, Alex"
        description="Here’s what’s happening across the Crave delivery network today."
        action={
          <Button href="/orders">
            View live orders <Icons.arrow size={14} />
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-lime px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink">
          Preview data
        </span>
        <span className="text-[12px] text-muted">Live operations metrics will come from the backend API.</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Orders today" value="1,284" delta="↑ 12.8%" note="vs. yesterday" icon={<Icons.orders size={18} />} />
        <Metric label="Gross order value" value="184.6k" delta="↑ 8.4%" note="in configured currency" icon={<Icons.pricing size={18} />} />
        <Metric
          label="Active restaurants"
          value="86"
          delta="+ 4 this week"
          note="2 awaiting review"
          icon={<Icons.restaurants size={18} />}
          trend="neutral"
        />
        <Metric label="Online riders" value="124" delta="18 on delivery" note="Across 3 service zones" icon={<Icons.riders size={18} />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <Panel
          title="Order volume"
          description="Orders placed across the network"
          action={
            <select className="rounded-xl border border-line bg-card px-3 py-2 text-[12px] text-muted outline-none">
              <option>Last 7 days</option>
              <option>Today</option>
              <option>This month</option>
            </select>
          }
        >
          <div className="px-5 pb-5 pt-4 sm:px-6">
            <div className="mb-4 flex items-end gap-2">
              <span className="font-display text-3xl font-bold tracking-tight text-ink">8,462</span>
              <span className="pb-1 text-[12px] text-muted">orders this week</span>
            </div>
            <div className="flex h-44 items-end gap-3 border-b border-l border-line px-3 pb-0 pt-5">
              {bars.map((height, i) => (
                <div key={i} className="group flex h-full flex-1 flex-col justify-end">
                  <div
                    className={`w-full rounded-t-lg transition ${
                      i === 5 ? "bg-lime" : "bg-charcoal/15 group-hover:bg-charcoal/35"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="-mb-5 mt-2 text-center text-[10px] text-soft">
                    {["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between text-[10px] text-soft">
              <span>0</span>
              <span>500</span>
              <span>1,000</span>
              <span>1,500 orders</span>
            </div>
          </div>
        </Panel>

        <Panel title="Operations pulse" description="Current service health">
          <div className="space-y-4 p-5 sm:p-6">
            {[
              { name: "Restaurants accepting", value: "78 / 86", pct: "91%", color: "bg-lime" },
              { name: "Riders online", value: "124 / 210", pct: "59%", color: "bg-orange" },
              { name: "Orders within ETA", value: "1,198 / 1,284", pct: "93%", color: "bg-lime" },
            ].map((row) => (
              <div key={row.name}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-ink">{row.name}</span>
                  <span className="text-muted">
                    {row.value} · {row.pct}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                  <div className={`h-full rounded-full ${row.color}`} style={{ width: row.pct }} />
                </div>
              </div>
            ))}
            <div className="mt-2 rounded-2xl bg-ink p-4 text-white">
              <p className="text-[13px] font-bold">Dispatch is operating normally</p>
              <p className="mt-1 text-[12px] leading-5 text-white/55">
                18 orders are waiting for a rider. Check the live map for coverage.
              </p>
              <Link href="/live-map" className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-lime">
                Open live map <Icons.arrow size={13} />
              </Link>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Recent orders" description="Latest activity across all restaurants" action={<Button variant="secondary" href="/orders">All orders</Button>}>
        <Table headers={["Order", "Customer", "Restaurant", "Status", "Placed", "Total", ""]}>
          {orders.map((order) => (
            <tr key={order.id} className="transition hover:bg-surface/70">
              <TableCell>
                <Link href="/orders" className="font-bold text-ink">
                  {order.id}
                </Link>
              </TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.restaurant}</TableCell>
              <TableCell>
                <Badge label={order.status} />
              </TableCell>
              <TableCell>{order.time}</TableCell>
              <TableCell className="font-bold text-ink">{order.total}</TableCell>
              <TableCell>
                <button aria-label={`More actions for ${order.id}`} className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink">
                  <Icons.more size={16} />
                </button>
              </TableCell>
            </tr>
          ))}
        </Table>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Needs your review" description="Applications and requests that need a decision">
          <div className="divide-y divide-line">
            {[
              { label: "Restaurant applications", value: "2 waiting", href: "/restaurants?tab=pending", icon: Icons.restaurants },
              { label: "Rider applications", value: "7 waiting", href: "/riders?tab=pending", icon: Icons.riders },
              { label: "Support tickets", value: "4 open", href: "/support", icon: Icons.support },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className="flex items-center gap-3 px-5 py-4 transition hover:bg-surface">
                  <span className="grid size-10 place-items-center rounded-xl bg-ink text-lime">
                    <Icon size={17} />
                  </span>
                  <span className="flex-1 text-[13px] font-bold text-ink">{item.label}</span>
                  <span className="text-[12px] text-muted">{item.value}</span>
                  <Icons.arrow size={14} className="text-soft" />
                </Link>
              );
            })}
          </div>
        </Panel>

        <Panel title="Top performing partners" description="By completed orders today" action={<Button variant="ghost" href="/restaurants">View all →</Button>}>
          <div className="divide-y divide-line">
            {[
              { n: "Olive & Thyme", meta: "Mediterranean · Central", count: "148 orders", initials: "OT" },
              { n: "Northside Grill", meta: "American · North", count: "122 orders", initials: "NG" },
              { n: "Little Saffron", meta: "South Asian · Central", count: "96 orders", initials: "LS" },
            ].map((r, i) => (
              <div key={r.n} className="flex items-center gap-3 px-5 py-4">
                <span className="w-5 text-[12px] font-bold text-soft">0{i + 1}</span>
                <Person initials={r.initials} name={r.n} meta={r.meta} />
                <span className="ml-auto text-[12px] font-semibold text-ink">{r.count}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="text-center text-[11px] text-soft">Preview metrics · Values use the configured platform currency once cities are set up.</div>
    </div>
  );
}
