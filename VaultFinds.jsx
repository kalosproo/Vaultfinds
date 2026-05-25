import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_PRODUCTS = [
  { id: 1, name: "Minimalist Leather Wallet", category: "Accessories", costPrice: 120, sellPrice: 350, status: "Winning", tags: ["trending", "men"], inventory: 24, source: "https://meesho.com", notes: "High reorder rate. Works well with stories.", image: null },
  { id: 2, name: "Posture Corrector Belt", category: "Health", costPrice: 85, sellPrice: 249, status: "Trending", tags: ["health", "viral"], inventory: 60, source: "https://amazon.in", notes: "Great reel hook: before/after posture.", image: null },
  { id: 3, name: "LED Makeup Mirror", category: "Beauty", costPrice: 200, sellPrice: 599, status: "Testing", tags: ["beauty", "women"], inventory: 10, source: "https://flipkart.com", notes: "Testing 2 ad creatives this week.", image: null },
  { id: 4, name: "Cable Organizer Set", category: "Tech", costPrice: 40, sellPrice: 99, status: "Dead product", tags: ["tech"], inventory: 0, source: "https://meesho.com", notes: "Low margin. Discontinue.", image: null },
];
const MOCK_CUSTOMERS = [
  { id: 1, name: "Priya Sharma", whatsapp: "+91 98765 43210", address: "Hyderabad, TS", orderStatus: "Delivered", paymentStatus: "Paid", paymentType: "Prepaid", repeat: true, notes: "Loves accessories. Check in monthly.", orders: 4 },
  { id: 2, name: "Ravi Kumar", whatsapp: "+91 90000 11111", address: "Tirupati, AP", orderStatus: "Pending", paymentStatus: "Unpaid", paymentType: "COD", repeat: false, notes: "First order. Follow up tomorrow.", orders: 1 },
  { id: 3, name: "Sneha Reddy", whatsapp: "+91 87654 32109", address: "Chennai, TN", orderStatus: "Shipped", paymentStatus: "Paid", paymentType: "Prepaid", repeat: true, notes: "Bulk buyer. Give discount on 3+.", orders: 7 },
];
const MOCK_ORDERS = [
  { id: 1, customer: "Priya Sharma", product: "Minimalist Leather Wallet", amount: 350, status: "Delivered", date: "2026-05-20", profit: 230, type: "Prepaid" },
  { id: 2, customer: "Ravi Kumar", product: "Posture Corrector Belt", amount: 249, status: "Pending", date: "2026-05-24", profit: 164, type: "COD" },
  { id: 3, customer: "Sneha Reddy", product: "LED Makeup Mirror", amount: 599, status: "Shipped", date: "2026-05-22", profit: 399, type: "Prepaid" },
  { id: 4, customer: "Priya Sharma", product: "Posture Corrector Belt", amount: 249, status: "Delivered", date: "2026-05-18", profit: 164, type: "Prepaid" },
];
const MOCK_CONTENT = [
  { id: 1, type: "Instagram Caption", title: "Wallet Launch Caption", content: "Why carry a chunky wallet when this slim beauty holds everything? 💳 Link in bio.", tags: ["wallet", "accessories"], performance: "High", saved: true },
  { id: 2, type: "Viral Hook", title: "Posture Reel Hook", content: "POV: You realise you've been damaging your spine for 5 years. Fix it in 2 weeks.", tags: ["health", "posture"], performance: "Viral", saved: true },
  { id: 3, type: "Ad Copy", title: "Mirror FB Ad", content: "Stop doing your makeup in bad lighting! This LED mirror changes EVERYTHING. ✨", tags: ["beauty", "mirror"], performance: "Medium", saved: false },
];

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const STATUS_COLORS = { "Winning": "#22c55e", "Trending": "#a78bfa", "Testing": "#f59e0b", "Dead product": "#6b7280" };
const ORDER_STATUS_COLORS = { "Delivered": "#22c55e", "Shipped": "#60a5fa", "Pending": "#f59e0b", "Cancelled": "#ef4444", "Refund": "#f97316" };
const PERFORMANCE_COLORS = { "Viral": "#a78bfa", "High": "#22c55e", "Medium": "#f59e0b", "Low": "#6b7280" };

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    grid: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    box: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    shopping: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
    edit3: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    cpu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    trending: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    dollar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    bookmark: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
    package: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    arrowUp: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    repeat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    loader: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
    sparkle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.88 5.76a1 1 0 00.63.63L20.24 11.5l-5.76 1.88a1 1 0 00-.63.63L12 20.24l-1.88-5.76a1 1 0 00-.63-.63L3.76 12l5.76-1.88a1 1 0 00.63-.63L12 3z"/></svg>,
  };
  return icons[name] || null;
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const Tag = ({ label, color }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
    background: color ? `${color}18` : "#ffffff0f",
    color: color || "#9ca3af",
    border: `1px solid ${color ? `${color}30` : "#ffffff10"}`,
    letterSpacing: "0.03em"
  }}>{label}</span>
);

const StatCard = ({ label, value, sub, icon, color = "#fff" }) => (
  <div style={{
    background: "#111111", border: "1px solid #222", borderRadius: 16,
    padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10,
    transition: "border-color 0.2s",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 12, color: "#666", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      <div style={{ color: "#444" }}><Icon name={icon} size={16} /></div>
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#555" }}>{sub}</div>}
  </div>
);

const MiniBar = ({ value, max, color = "#fff" }) => (
  <div style={{ height: 4, background: "#1e1e1e", borderRadius: 99, overflow: "hidden", flex: 1 }}>
    <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
  </div>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const totalSales = MOCK_ORDERS.filter(o => o.status === "Delivered").reduce((s, o) => s + o.amount, 0);
  const totalProfit = MOCK_ORDERS.filter(o => o.status === "Delivered").reduce((s, o) => s + o.profit, 0);
  const pending = MOCK_ORDERS.filter(o => o.status === "Pending").length;
  const conversion = 68;
  const weekData = [42, 78, 55, 91, 63, 84, 72];
  const maxVal = Math.max(...weekData);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Dashboard</div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 3 }}>May 25, 2026 · Sunday</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#191919", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
          <Icon name="bell" size={16} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <StatCard label="Total Revenue" value={`₹${totalSales.toLocaleString()}`} sub="This month" icon="dollar" color="#fff" />
        <StatCard label="Net Profit" value={`₹${totalProfit.toLocaleString()}`} sub="After costs" icon="trending" color="#a3e635" />
        <StatCard label="Conversion" value={`${conversion}%`} sub="Orders/leads" icon="arrowUp" color="#c4b5fd" />
        <StatCard label="Pending" value={pending} sub="Orders to ship" icon="package" color="#fbbf24" />
      </div>

      {/* Activity Graph */}
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#777", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>Weekly Activity</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 60 }}>
          {weekData.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: "100%", height: `${(v / maxVal) * 52}px`,
                background: i === 6 ? "#fff" : "#2a2a2a",
                borderRadius: 6,
                transition: "height 0.4s ease",
                boxShadow: i === 6 ? "0 0 12px #ffffff30" : "none"
              }} />
              <div style={{ fontSize: 10, color: i === 6 ? "#888" : "#3a3a3a" }}>{"SMTWTFS"[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Products */}
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#777", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 14 }}>Top Products</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "Leather Wallet", sales: 350, pct: 84 },
            { name: "Posture Belt", sales: 249, pct: 68 },
            { name: "LED Mirror", sales: 599, pct: 55 },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#ccc" }}>{p.name}</span>
                <span style={{ fontSize: 12, color: "#555" }}>₹{p.sales}</span>
              </div>
              <MiniBar value={p.pct} max={100} color="#fff" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Customers */}
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#777", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 14 }}>Recent Customers</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOCK_CUSTOMERS.slice(0, 3).map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#888", flexShrink: 0 }}>
                {c.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#ddd", fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#555" }}>{c.orderStatus} · {c.paymentType}</div>
              </div>
              {c.repeat && <Tag label="Repeat" color="#22c55e" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const Products = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Winning", "Trending", "Testing", "Dead product"];

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Products</div>
        <div style={{ fontSize: 12, color: "#555" }}>{filtered.length} items</div>
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#111", border: "1px solid #222", borderRadius: 12, padding: "10px 14px" }}>
        <Icon name="search" size={16} color="#555" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#ccc", fontSize: 14 }}
        />
      </div>

      {/* Status Filter */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, border: "1px solid",
            borderColor: filter === s ? "#fff" : "#222",
            background: filter === s ? "#fff" : "transparent",
            color: filter === s ? "#000" : "#666",
            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s"
          }}>{s}</button>
        ))}
      </div>

      {/* Product Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(p => {
          const profit = p.sellPrice - p.costPrice;
          const margin = Math.round((profit / p.sellPrice) * 100);
          return (
            <div key={p.id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, cursor: "pointer", transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#eee" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>{p.category}</div>
                </div>
                <Tag label={p.status} color={STATUS_COLORS[p.status]} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "Cost", value: `₹${p.costPrice}` },
                  { label: "Sell", value: `₹${p.sellPrice}` },
                  { label: "Margin", value: `${margin}%` },
                ].map(x => (
                  <div key={x.label} style={{ background: "#171717", borderRadius: 10, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>{x.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#ddd", marginTop: 2 }}>{x.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {p.tags.map(t => <Tag key={t} label={t} />)}
                </div>
                <div style={{ fontSize: 12, color: "#555" }}>Stock: {p.inventory}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────
const Customers = () => {
  const [search, setSearch] = useState("");
  const filtered = MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Customers</div>
        <div style={{ fontSize: 12, color: "#555" }}>{filtered.length} contacts</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#111", border: "1px solid #222", borderRadius: 12, padding: "10px 14px" }}>
        <Icon name="search" size={16} color="#555" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#ccc", fontSize: 14 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(c => (
          <div key={c.id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1e1e1e", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#777", flexShrink: 0 }}>
                {c.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#eee" }}>{c.name}</span>
                  {c.repeat && (
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#22c55e", fontWeight: 600 }}>
                      <Icon name="repeat" size={10} color="#22c55e" /> REPEAT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{c.address}</div>
              </div>
              <Tag label={c.orderStatus} color={ORDER_STATUS_COLORS[c.orderStatus]} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Payment", value: c.paymentStatus },
                { label: "Type", value: c.paymentType },
                { label: "Orders", value: c.orders },
                { label: "WhatsApp", value: c.whatsapp.slice(0, 13) + "…" },
              ].map(x => (
                <div key={x.label} style={{ background: "#171717", borderRadius: 10, padding: "8px 12px" }}>
                  <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>{x.label}</div>
                  <div style={{ fontSize: 13, color: "#ccc", marginTop: 2, fontWeight: 500 }}>{x.value}</div>
                </div>
              ))}
            </div>

            {c.notes && (
              <div style={{ fontSize: 12, color: "#666", background: "#161616", borderRadius: 10, padding: "8px 12px", borderLeft: "2px solid #2a2a2a" }}>
                {c.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────
const Orders = () => {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];
  const filtered = filter === "All" ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);
  const totalProfit = filtered.reduce((s, o) => s + o.profit, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Orders</div>
        <div style={{ fontSize: 12, color: "#a3e635", fontWeight: 600 }}>+₹{totalProfit} profit</div>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, border: "1px solid",
            borderColor: filter === s ? "#fff" : "#222", background: filter === s ? "#fff" : "transparent",
            color: filter === s ? "#000" : "#666", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s"
          }}>{s}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(o => (
          <div key={o.id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#eee" }}>{o.product}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{o.customer}</div>
              </div>
              <Tag label={o.status} color={ORDER_STATUS_COLORS[o.status]} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>Amount</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>₹{o.amount}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>Profit</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#a3e635" }}>₹{o.profit}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#555" }}>{o.date}</div>
                <Tag label={o.type} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── CONTENT ──────────────────────────────────────────────────────────────────
const Content = () => {
  const [filter, setFilter] = useState("All");
  const types = ["All", "Instagram Caption", "Viral Hook", "Ad Copy"];
  const filtered = filter === "All" ? MOCK_CONTENT : MOCK_CONTENT.filter(c => c.type === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Content</div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, border: "1px solid",
            borderColor: filter === t ? "#fff" : "#222", background: filter === t ? "#fff" : "transparent",
            color: filter === t ? "#000" : "#666", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s"
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(c => (
          <div key={c.id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#eee" }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>{c.type}</div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <Tag label={c.performance} color={PERFORMANCE_COLORS[c.performance]} />
                {c.saved && <Icon name="bookmark" size={14} color="#fbbf24" />}
              </div>
            </div>

            <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6, background: "#171717", borderRadius: 10, padding: "10px 12px" }}>
              {c.content}
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {c.tags.map(t => <Tag key={t} label={`#${t}`} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────
const AI = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey Bujji! 👋 I'm your Vault Finds AI. Ask me to write product descriptions, generate hooks, create hashtags, draft customer replies, or suggest winning products. What do you need?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const PROMPTS = [
    "Write a viral Instagram hook for a posture corrector",
    "Generate 10 hashtags for a leather wallet",
    "Create a Facebook Marketplace description for LED mirror",
    "Draft a reply to a customer asking for a discount",
  ];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a sharp, concise AI assistant inside 'Vault Finds', a premium reseller app for Indian online sellers. Help with product descriptions, SEO titles, hashtags, ad scripts, viral hooks, Instagram captions, customer replies, and product research. Keep responses focused, practical, and formatted well. Use emojis sparingly. Write in a modern, confident tone suited for Indian social media selling.",
          messages: [...messages.filter(m => m.role !== "assistant" || messages.indexOf(m) > 0).map(m => ({ role: m.role, content: m.content })), { role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Something went wrong. Try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#191919", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="sparkle" size={16} color="#c4b5fd" />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>AI Assistant</div>
          <div style={{ fontSize: 12, color: "#555" }}>Powered by Claude</div>
        </div>
      </div>

      {/* Quick prompts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>Quick Actions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {PROMPTS.map((p, i) => (
            <button key={i} onClick={() => sendMessage(p)} style={{
              background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "9px 14px",
              color: "#888", fontSize: 12, textAlign: "left", cursor: "pointer", transition: "all 0.15s",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <span>{p}</span>
              <Icon name="chevronRight" size={14} color="#444" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0, background: "#0d0d0d", borderRadius: 16, border: "1px solid #1a1a1a", overflow: "hidden", minHeight: 280 }}>
        <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", maxHeight: 360 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "85%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
                background: m.role === "user" ? "#fff" : "#161616",
                color: m.role === "user" ? "#000" : "#ccc",
                fontSize: 13, lineHeight: 1.6,
                border: m.role === "assistant" ? "1px solid #222" : "none",
                whiteSpace: "pre-wrap"
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ padding: "10px 14px", borderRadius: "4px 14px 14px 14px", background: "#161616", border: "1px solid #222", display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ animation: "spin 1s linear infinite", display: "flex" }}><Icon name="loader" size={14} color="#555" /></div>
                <span style={{ fontSize: 12, color: "#555" }}>Thinking…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ borderTop: "1px solid #1a1a1a", padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
            placeholder="Ask anything about your products…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#ccc", fontSize: 13 }}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
            width: 34, height: 34, borderRadius: 10, background: input.trim() && !loading ? "#fff" : "#1a1a1a",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s"
          }}>
            <Icon name="send" size={14} color={input.trim() && !loading ? "#000" : "#444"} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", icon: "grid", label: "Home" },
  { id: "products", icon: "box", label: "Products" },
  { id: "customers", icon: "users", label: "Customers" },
  { id: "orders", icon: "shopping", label: "Orders" },
  { id: "content", icon: "edit3", label: "Content" },
  { id: "ai", icon: "cpu", label: "AI" },
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function VaultFinds() {
  const [tab, setTab] = useState("dashboard");
  const [showFab, setShowFab] = useState(false);

  const SCREENS = { dashboard: <Dashboard />, products: <Products />, customers: <Customers />, orders: <Orders />, content: <Content />, ai: <AI /> };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'SF Pro Display', -apple-system, sans-serif",
      background: "#0a0a0a", color: "#fff", minHeight: "100vh",
      display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto",
      position: "relative", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>

      {/* Header */}
      <div style={{ padding: "52px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="bookmark" size={14} color="#000" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>Vault Finds</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 11, color: "#555", background: "#111", border: "1px solid #1e1e1e", borderRadius: 99, padding: "3px 10px" }}>
            @thevaultfinds
          </div>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#191919", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="user" size={14} color="#666" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px 20px 100px", overflowY: "auto", animation: "fadeUp 0.3s ease" }}>
        {SCREENS[tab]}
      </div>

      {/* FAB */}
      {tab !== "ai" && (
        <button onClick={() => setShowFab(!showFab)} style={{
          position: "fixed", bottom: 80, right: 20,
          width: 50, height: 50, borderRadius: "50%",
          background: "#fff", border: "none",
          boxShadow: "0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 100,
          transition: "transform 0.2s, box-shadow 0.2s",
          transform: showFab ? "rotate(45deg)" : "rotate(0)"
        }}>
          <Icon name="plus" size={20} color="#000" />
        </button>
      )}

      {showFab && (
        <div style={{ position: "fixed", bottom: 138, right: 20, display: "flex", flexDirection: "column", gap: 8, zIndex: 99, animation: "fadeUp 0.2s ease" }}>
          {["Add Product", "Add Customer", "Log Order"].map((label, i) => (
            <button key={i} onClick={() => setShowFab(false)} style={{
              background: "#111", border: "1px solid #2a2a2a", borderRadius: 10, padding: "8px 14px",
              color: "#ccc", fontSize: 12, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 2px 16px rgba(0,0,0,0.5)", whiteSpace: "nowrap", alignSelf: "flex-end"
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "#0d0d0ddd", backdropFilter: "blur(20px)",
        borderTop: "1px solid #1a1a1a",
        display: "flex", padding: "8px 0 20px", zIndex: 50
      }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer", padding: "6px 0",
            color: tab === item.id ? "#fff" : "#444",
            transition: "color 0.15s"
          }}>
            <div style={{
              padding: "6px 14px", borderRadius: 10,
              background: tab === item.id ? "#1e1e1e" : "transparent",
              transition: "background 0.15s"
            }}>
              <Icon name={item.icon} size={18} color={tab === item.id ? "#fff" : "#444"} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
