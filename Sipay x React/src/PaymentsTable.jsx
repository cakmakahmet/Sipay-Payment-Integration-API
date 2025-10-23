import React, { useEffect, useMemo, useState } from "react";

function PaymentsTable({
  apiBase = "http://localhost:5249",
  logsEndpoint = "/api/payment/logs",
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let on = true;
    setLoading(true);
    setError(null);
    fetch(`${apiBase}${logsEndpoint}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        const rows = (json?.items || json?.data || json || []).map((x, i) => ({
          id: x.id ?? x.paymentId ?? x.referenceId ?? i + 1,
          amount: Number(x.amount ?? x.total ?? x.price ?? 0),
          currency: x.currency ?? x.ccy ?? "TRY",
          status: (x.status ?? x.state ?? "pending").toString(),
          method: x.method ?? x.channel ?? x.provider ?? "Card",
          customer: x.customer ?? x.name ?? x.email ?? "-",
          createdAt: x.createdAt ?? x.date ?? x.time ?? new Date().toISOString(),
          raw: x,
        }));
        if (on) setData(rows);
      })
      .catch(() => {
        const now = Date.now();
        const mock = Array.from({ length: 18 }).map((_, i) => ({
          id: 1000 + i,
          amount: 100 + Math.round(Math.random() * 9000),
          currency: "TRY",
          status: i % 7 === 0 ? "failed" : i % 3 === 0 ? "pending" : "success",
          method: ["Card", "Wallet", "QR", "Transfer"][i % 4],
          customer: ["Ali", "Ayşe", "Mehmet", "Zeynep"][i % 4],
          createdAt: new Date(now - i * 86_400_000).toISOString(),
          raw: {},
        }));
        if (on) {
          setData(mock);
          setError("API'ye ulaşılamadı, mock veri gösteriliyor (önizleme). Projede gerçek API ile çalışacaktır.");
        }
      })
      .finally(() => on && setLoading(false));
    return () => (on = false);
  }, [apiBase, logsEndpoint, refreshKey]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((r) => {
      const okQuery = query
        ? `${r.id} ${r.customer} ${r.method} ${r.amount} ${r.currency}`.toLowerCase().includes(query.toLowerCase())
        : true;
      const okStatus = status ? r.status?.toLowerCase() === status : true;
      const ts = r.createdAt ? new Date(r.createdAt).getTime() : 0;
      const okFrom = dateFrom ? ts >= new Date(dateFrom).getTime() : true;
      const okTo = dateTo ? ts <= new Date(dateTo).getTime() + 86_399_000 : true;
      const okTab = tab === "all" ? true : (r.status || "").toLowerCase() === tab;
      return okQuery && okStatus && okFrom && okTo && okTab;
    });
  }, [data, query, status, dateFrom, dateTo, tab]);

  const totalSum = (rows) => rows.reduce((a, b) => a + (Number(b.amount) || 0), 0);
  const stats = useMemo(() => {
    const total = data ? totalSum(data) : 0;
    const today = (data || []).filter(
      (r) => new Date(r.createdAt || 0).toDateString() === new Date().toDateString()
    );
    const successCount = (data || []).filter((r) => (r.status || "").toLowerCase() === "success").length;
    return {
      total: new Intl.NumberFormat(undefined, { style: "currency", currency: (data?.[0]?.currency || "TRY") }).format(total),
      today: String(today.length),
      successRate: data && data.length ? `${Math.round((successCount / data.length) * 100)}%` : "-",
    };
  }, [data]);

  return (
    <div className="pmt__wrap">
      <style>{`
        .pmt__wrap { --bg:#f7f8fb; --card:#fff; --muted:#6b7280; --ink:#0f172a; --bd:#e5e7eb; background:var(--bg); min-height:100vh; }
        .pmt__container{max-width:1100px;margin:0 auto;padding:24px}
        .pmt__header{position:sticky;top:0;backdrop-filter:saturate(1.2) blur(6px);background:rgba(255,255,255,.7);border-bottom:1px solid var(--bd)}
        .pmt__hinner{max-width:1100px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;justify-content:space-between}
        .pmt__brand{display:flex;gap:12px;align-items:center}
        .pmt__logo{height:36px;width:36px;border-radius:14px;background:#111827;color:#fff;display:grid;place-items:center;font-weight:700}
        .pmt__btn{border:1px solid var(--bd);background:var(--card);padding:6px 10px;border-radius:10px;cursor:pointer;font-size:13px}
        .pmt__btn:hover{border-color:#cbd5e1}
        .pmt__btn.primary{background:#111827;color:#fff;border-color:#111827}
        /* yalnızca Apply & Reset için küçük boy */
        .pmt__btn.small{padding:4px 8px;font-size:12px;border-radius:8px}

        .pmt__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        @media (max-width:800px){.pmt__grid{grid-template-columns:1fr}}
        .pmt__card{background:var(--card);border:1px solid var(--bd);border-radius:16px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
        .pmt__card h4{font-size:12px;color:var(--muted);margin:12px 16px 0}
        .pmt__card .v{font-size:28px;font-weight:700;margin:0 16px 12px}
        .pmt__card .s{font-size:11px;color:var(--muted);margin: -6px 16px 12px}

        .pmt__filters{margin-top:16px}
        .pmt__row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto auto;gap:10px}
        @media (max-width:900px){.pmt__row{grid-template-columns:1fr 1fr;gap:8px}}
        .pmt__input,.pmt__select{width:100%;padding:10px 12px;border:1px solid var(--bd);border-radius:12px;background:#fff}

        .pmt__tabs{display:inline-flex;gap:6px;border:1px solid var(--bd);border-radius:12px;overflow:hidden;margin-top:18px}
        .pmt__tab{padding:8px 12px;background:#fff;border-right:1px solid var(--bd);cursor:pointer}
        .pmt__tab:last-child{border-right:none}
        .pmt__tab.active{background:#111827;color:#fff}

        table{width:100%;border-collapse:separate;border-spacing:0}
        thead th{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);text-align:left;padding:12px;border-bottom:1px solid var(--bd);background:#f9fafb}
        tbody td{padding:12px;border-bottom:1px solid #f1f5f9;font-size:14px}
        tr:hover td{background:#fafafa}
        .pill{display:inline-block;padding:3px 8px;border-radius:999px;border:1px solid; font-size:12px}
        .pill.s{background:#ecfdf5;border-color:#a7f3d0;color:#047857}
        .pill.p{background:#fffbeb;border-color:#fde68a;color:#92400e}
        .pill.f{background:#fef2f2;border-color:#fecaca;color:#991b1b}
        .pmt__toast{font-size:12px;color:#92400e;background:#fffbeb;border-top:1px solid #fde68a;padding:10px 16px}

        .pmt__modal_back{position:fixed;inset:0;background:rgba(0,0,0,.35);display:grid;place-items:center}
        .pmt__modal{background:#fff;max-width:760px;width:92%;border-radius:14px;overflow:hidden;border:1px solid var(--bd)}
        .pmt__modal h3{margin:0;padding:12px 16px;border-bottom:1px solid var(--bd)}
        .pmt__modal pre{margin:0;padding:16px;background:#0b1220;color:#e2e8f0;max-height:60vh;overflow:auto}
        .pmt__modal .act{display:flex;justify-content:flex-end;gap:8px;padding:10px 16px;border-top:1px solid var(--bd);background:#f8fafc}
      `}</style>

      {/* Header */}
      <div className="pmt__header">
        <div className="pmt__hinner">
          <div className="pmt__brand">
            <div className="pmt__logo">₺</div>
            <div>
              <div style={{fontWeight:600,fontSize:18,color:"var(--ink)"}}>Payments</div>
              <div style={{fontSize:13,color:"var(--muted)",marginTop:-2}}>Logs, filters, quick insights</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="pmt__btn" onClick={() => setRefreshKey((k) => k + 1)}>↻ Refresh</button>
            <button className="pmt__btn" onClick={() => { setStatus(""); setQuery(""); setDateFrom(""); setDateTo(""); setTab("all"); }}>✦ Clear</button>
          </div>
        </div>
      </div>

      <div className="pmt__container">
        {/* Stats */}
        <div className="pmt__grid">
          <div className="pmt__card"><h4>Total volume</h4><div className="v">{stats.total}</div><div className="s">All time</div></div>
          <div className="pmt__card"><h4>Today's payments</h4><div className="v">{stats.today}</div><div className="s">{new Date().toLocaleDateString()}</div></div>
          <div className="pmt__card"><h4>Success rate</h4><div className="v">{stats.successRate}</div><div className="s">Completed / Total</div></div>
        </div>

        {/* Filters */}
        <div className="pmt__card pmt__filters">
          <div style={{padding:16}}>
            <div className="pmt__row">
              <div>
                <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Search</div>
                <input className="pmt__input" placeholder="ID, customer, method…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div>
                <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Status</div>
                <select className="pmt__select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>From</div>
                <input type="date" className="pmt__input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div>
                <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>To</div>
                <input type="date" className="pmt__input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <div style={{display:"flex",gap:8}}>
                {/* SADECE bu iki butona .small eklendi */}
                <button className="pmt__btn primary small" onClick={() => setRefreshKey((k) => k + 1)}>Apply</button>
                <button className="pmt__btn small" onClick={() => { setStatus(""); setQuery(""); setDateFrom(""); setDateTo(""); }}>Reset</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="pmt__tabs">
              {(["all","success","pending","failed"]).map((t) => (
                <button key={t} className={"pmt__tab "+(tab===t?"active":"")} onClick={() => setTab(t)}>{t[0].toUpperCase()+t.slice(1)}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="pmt__card" style={{marginTop:16, overflow:"hidden"}}>
          {loading ? (
            <div style={{padding:16, color:"var(--muted)"}}>Loading…</div>
          ) : (
            <div style={{overflowX:"auto"}}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Method</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th style={{textAlign:"right"}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td style={{fontWeight:600}}>{r.id}</td>
                      <td>{new Intl.NumberFormat(undefined, { style: "currency", currency: r.currency || "TRY", maximumFractionDigits: 2 }).format(Number(r.amount || 0))}</td>
                      <td>
                        <span className={"pill "+(r.status?.toLowerCase()==="success"?"s":r.status?.toLowerCase()==="pending"?"p":"f")}>{r.status}</span>
                      </td>
                      <td>{r.method || "-"}</td>
                      <td>{r.customer || "-"}</td>
                      <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</td>
                      <td style={{textAlign:"right"}}>
                        <button className="pmt__btn" onClick={() => setSelected(r)}>View JSON</button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{textAlign:"center", padding:"36px", color:"var(--muted)"}}>No records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {error && <div className="pmt__toast">{error}</div>}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="pmt__modal_back" onClick={() => setSelected(null)}>
          <div className="pmt__modal" onClick={(e) => e.stopPropagation()}>
            <h3>Payment #{selected?.id}</h3>
            <pre>{selected ? JSON.stringify(selected.raw ?? selected, null, 2) : null}</pre>
            <div className="act">
              <button className="pmt__btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <PaymentsTable />;
}
