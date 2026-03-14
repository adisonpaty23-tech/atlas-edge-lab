import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Journal() {
  const [trades, setTrades] = useState([])

  const [form, setForm] = useState({
    pair: "",
    session: "",
    weekly_bias: "",
    daily_bias: "",
    context_4h: "",
    entry_type: "",
    retest: "",
    quality: "",
    approach_type: "",
    level_freshness: "",
    space_to_opposing_zone: "",
    momentum_state: "",
    structure_state: "",
    zone_clarity: "",
    result: "",
    r_multiple: "",
    explanation: "",
    notes: "",
    chart_link: ""
  })

  useEffect(() => {
    fetchTrades()
  }, [])

  async function fetchTrades() {
    const { data } = await supabase
      .from("trades")
      .select("*")
      .order("created_at", { ascending: false })

    setTrades(data || [])
  }

  async function saveTrade() {
    const { error } = await supabase.from("trades").insert([form])

    if (!error) {
      alert("trade saved")
      setForm({})
      fetchTrades()
    }
  }

  function updateField(field, value) {
    setForm({ ...form, [field]: value })
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f2fff6,#ecfff3,#f8fffb)",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "20px" }}>Trade Journal</h1>

        {/* TRADE FORM */}

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "30px",
            border: "1px solid #d1f0da"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input placeholder="Pair" onChange={(e) => updateField("pair", e.target.value)} />
            <input placeholder="Session" onChange={(e) => updateField("session", e.target.value)} />
            <input placeholder="Weekly Bias" onChange={(e) => updateField("weekly_bias", e.target.value)} />
            <input placeholder="Daily Bias" onChange={(e) => updateField("daily_bias", e.target.value)} />
            <input placeholder="4H Context" onChange={(e) => updateField("context_4h", e.target.value)} />
            <input placeholder="Entry Type" onChange={(e) => updateField("entry_type", e.target.value)} />
            <input placeholder="Retest" onChange={(e) => updateField("retest", e.target.value)} />
            <input placeholder="Quality" onChange={(e) => updateField("quality", e.target.value)} />
            <input placeholder="Approach Type" onChange={(e) => updateField("approach_type", e.target.value)} />
            <input placeholder="Level Freshness" onChange={(e) => updateField("level_freshness", e.target.value)} />
            <input placeholder="Space to Opposing Zone" onChange={(e) => updateField("space_to_opposing_zone", e.target.value)} />
            <input placeholder="Momentum State" onChange={(e) => updateField("momentum_state", e.target.value)} />
            <input placeholder="Structure State" onChange={(e) => updateField("structure_state", e.target.value)} />
            <input placeholder="Zone Clarity" onChange={(e) => updateField("zone_clarity", e.target.value)} />
            <input placeholder="Result (Win/Loss)" onChange={(e) => updateField("result", e.target.value)} />
            <input placeholder="R Multiple" onChange={(e) => updateField("r_multiple", e.target.value)} />
          </div>

          <textarea
            placeholder="Explanation"
            style={{ width: "100%", marginTop: "10px" }}
            onChange={(e) => updateField("explanation", e.target.value)}
          />

          <textarea
            placeholder="Notes"
            style={{ width: "100%", marginTop: "10px" }}
            onChange={(e) => updateField("notes", e.target.value)}
          />

          <input
            placeholder="TradingView Chart Link"
            style={{ width: "100%", marginTop: "10px" }}
            onChange={(e) => updateField("chart_link", e.target.value)}
          />

          <button
            onClick={saveTrade}
            style={{
              marginTop: "12px",
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              background: "#08a56f",
              color: "white",
              cursor: "pointer"
            }}
          >
            Save Trade
          </button>
        </div>

        {/* SAVED TRADES */}

        <h2 style={{ marginBottom: "15px" }}>Saved Trades</h2>

        <div style={{ display: "grid", gap: "14px" }}>
          {trades.map((trade) => (
            <Link
              key={trade.id}
              href={`/trade/${trade.id}`}
              style={{
                padding: "18px",
                border: "1px solid #d1f0da",
                borderRadius: "24px",
                background: "#eef9f3",
                textDecoration: "none",
                color: "inherit",
                display: "block"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "18px" }}>
                    {trade.pair} • {trade.session}
                  </div>

                  <div style={{ marginTop: "6px", color: "#64748b" }}>
                    {trade.weekly_bias} / {trade.daily_bias} / {trade.context_4h}
                  </div>

                  <div style={{ marginTop: "10px", color: "#475569" }}>
                    {trade.explanation}
                  </div>
                </div>

                <div
                  style={{
                    background: "white",
                    border: "1px solid #bce8c9",
                    borderRadius: "14px",
                    padding: "10px",
                    fontWeight: "700",
                    color: "#0f8b62"
                  }}
                >
                  {trade.r_multiple}R
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
