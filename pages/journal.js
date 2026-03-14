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
      setForm({
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
        background: "linear-gradient(135deg, #f2fff6 0%, #ecfff3 50%, #f8fffb 100%)",
        fontFamily: "Arial, sans-serif",
        color: "#0f172a",
        padding: "20px"
      }}
    >
      <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid #d1f0da",
            borderRadius: "32px",
            padding: "12px",
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "10px",
            marginBottom: "20px"
          }}
        >
          <Link href="/dashboard" style={navBtnLink}>
            Dashboard
          </Link>
          <Link href="/model" style={navBtnLink}>
            My Model
          </Link>
          <Link href="/examples" style={navBtnLink}>
            Example Library
          </Link>
          <Link href="/journal" style={activeNav}>
            Trade Journal
          </Link>
          <button style={navBtn}>Screenshot AI</button>
          <Link href="/coach" style={navBtnLink}>
            AI Coach
          </Link>
          <Link href="/reports" style={navBtnLink}>
            Reports
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.95fr", gap: "20px", marginBottom: "20px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #0f5e43 0%, #15724f 55%, #8fddb0 100%)",
              borderRadius: "34px",
              padding: "34px",
              color: "white",
              minHeight: "255px",
              boxShadow: "0 20px 50px rgba(16, 123, 76, 0.18)"
            }}
          >
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
              <span style={pillDark}>Trade Journal</span>
              <span style={pillDark}>Live Database</span>
            </div>

            <div style={{ fontSize: "60px", fontWeight: 700, lineHeight: 1.02, marginBottom: "18px" }}>
              Log Your Edge
            </div>

            <div style={{ fontSize: "22px", lineHeight: 1.45, maxWidth: "820px", color: "rgba(255,255,255,0.92)" }}>
              Save your full setup, chart link, context, and outcome so the AI coach can detect patterns, compare trades,
              and refine your edge over time.
            </div>

            <div style={{ display: "flex", gap: "14px", marginTop: "28px", flexWrap: "wrap" }}>
              <Link href="/" style={primaryBtn}>
                Back Home <span style={{ marginLeft: "12px" }}>›</span>
              </Link>
              <Link href="/coach" style={secondaryBtn}>
                Open AI Coach
              </Link>
            </div>
          </div>

          <div style={whiteCardLarge}>
            <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "6px" }}>Journal Flow</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "28px" }}>
              Every trade becomes training data
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {[
                "1. Paste your TradingView chart link",
                "2. Add context and execution fields",
                "3. Save result and reasoning",
                "4. Let the coach compare winners vs losers"
              ].map((item) => (
                <div key={item} style={loopCard}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "20px" }}>
          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "8px" }}>Add Trade</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
              Image + explanation + tagged data + result
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div style={twoCol}>
                <input name="pair" placeholder="Pair" value={form.pair} onChange={(e) => updateField("pair", e.target.value)} style={inputStyle} />
                <input name="session" placeholder="Session" value={form.session} onChange={(e) => updateField("session", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input name="weekly_bias" placeholder="Weekly Bias" value={form.weekly_bias} onChange={(e) => updateField("weekly_bias", e.target.value)} style={inputStyle} />
                <input name="daily_bias" placeholder="Daily Bias" value={form.daily_bias} onChange={(e) => updateField("daily_bias", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input name="context_4h" placeholder="4H Context" value={form.context_4h} onChange={(e) => updateField("context_4h", e.target.value)} style={inputStyle} />
                <input name="entry_type" placeholder="Entry Type" value={form.entry_type} onChange={(e) => updateField("entry_type", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input name="retest" placeholder="Retest" value={form.retest} onChange={(e) => updateField("retest", e.target.value)} style={inputStyle} />
                <input name="quality" placeholder="Quality" value={form.quality} onChange={(e) => updateField("quality", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input name="approach_type" placeholder="Approach Type" value={form.approach_type} onChange={(e) => updateField("approach_type", e.target.value)} style={inputStyle} />
                <input name="level_freshness" placeholder="Level Freshness" value={form.level_freshness} onChange={(e) => updateField("level_freshness", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input
                  name="space_to_opposing_zone"
                  placeholder="Space to Opposing Zone"
                  value={form.space_to_opposing_zone}
                  onChange={(e) => updateField("space_to_opposing_zone", e.target.value)}
                  style={inputStyle}
                />
                <input name="momentum_state" placeholder="Momentum State" value={form.momentum_state} onChange={(e) => updateField("momentum_state", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input name="structure_state" placeholder="Structure State" value={form.structure_state} onChange={(e) => updateField("structure_state", e.target.value)} style={inputStyle} />
                <input name="zone_clarity" placeholder="Zone Clarity" value={form.zone_clarity} onChange={(e) => updateField("zone_clarity", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input name="result" placeholder="Result (Win/Loss)" value={form.result} onChange={(e) => updateField("result", e.target.value)} style={inputStyle} />
                <input name="r_multiple" placeholder="R Multiple" value={form.r_multiple} onChange={(e) => updateField("r_multiple", e.target.value)} style={inputStyle} />
              </div>

              <textarea
                name="explanation"
                placeholder="Explanation"
                value={form.explanation}
                onChange={(e) => updateField("explanation", e.target.value)}
                rows={4}
                style={textareaStyle}
              />

              <textarea
                name="notes"
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={4}
                style={textareaStyle}
              />

              <input
                name="chart_link"
                placeholder="TradingView Chart Link"
                value={form.chart_link}
                onChange={(e) => updateField("chart_link", e.target.value)}
                style={inputStyle}
              />

              <button
                onClick={saveTrade}
                style={{
                  marginTop: "4px",
                  padding: "14px 18px",
                  borderRadius: "16px",
                  border: "none",
                  background: "#08a56f",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "700"
                }}
              >
                Save Trade
              </button>
            </div>
          </div>

          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "8px" }}>Saved Trades</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
              Click any trade to open its full analysis page
            </div>

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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" }}>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "18px" }}>
                        {trade.pair || "No pair"} • {trade.session || "No session"}
                      </div>

                      <div style={{ marginTop: "6px", color: "#64748b" }}>
                        {trade.weekly_bias || "-"} / {trade.daily_bias || "-"} / {trade.context_4h || "-"}
                      </div>

                      <div style={{ marginTop: "10px", color: "#475569" }}>
                        {trade.explanation || "No explanation"}
                      </div>
                    </div>

                    <div
                      style={{
                        background: "white",
                        border: "1px solid #bce8c9",
                        borderRadius: "14px",
                        padding: "10px",
                        fontWeight: "700",
                        color: "#0f8b62",
                        minWidth: "54px",
                        textAlign: "center"
                      }}
                    >
                      {trade.r_multiple ?? "-"}R
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const whiteCard = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid #d1f0da",
  borderRadius: "30px",
  padding: "30px",
  boxShadow: "0 12px 30px rgba(20, 120, 74, 0.06)"
}

const whiteCardLarge = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid #ccefd7",
  borderRadius: "34px",
  padding: "32px",
  boxShadow: "0 14px 34px rgba(20, 120, 74, 0.08)"
}

const pillDark = {
  border: "1px solid rgba(255,255,255,0.35)",
  background: "rgba(255,255,255,0.12)",
  color: "white",
  borderRadius: "999px",
  padding: "12px 18px",
  fontSize: "16px",
  fontWeight: 600
}

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  background: "white",
  color: "#0f7c54",
  borderRadius: "999px",
  padding: "16px 26px",
  fontSize: "20px",
  fontWeight: 600,
  border: "1px solid rgba(255,255,255,0.6)"
}

const secondaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  background: "rgba(255,255,255,0.12)",
  color: "white",
  borderRadius: "999px",
  padding: "16px 26px",
  fontSize: "20px",
  fontWeight: 500,
  border: "1px solid rgba(255,255,255,0.45)"
}

const loopCard = {
  background: "#eef9f3",
  borderRadius: "24px",
  padding: "22px 20px",
  fontSize: "18px",
  color: "#334155"
}

const activeNav = {
  textDecoration: "none",
  background: "#08a56f",
  color: "white",
  borderRadius: "24px",
  padding: "18px 20px",
  fontSize: "18px",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

const navBtn = {
  border: "none",
  background: "transparent",
  color: "#334155",
  borderRadius: "24px",
  padding: "18px 20px",
  fontSize: "18px",
  fontWeight: 500,
  cursor: "pointer"
}

const navBtnLink = {
  textDecoration: "none",
  background: "transparent",
  color: "#334155",
  borderRadius: "24px",
  padding: "18px 20px",
  fontSize: "18px",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

const twoCol = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px"
}

const inputStyle = {
  border: "1px solid #cfead6",
  background: "#f7fff9",
  borderRadius: "18px",
  padding: "16px 18px",
  fontSize: "16px",
  outline: "none"
}

const textareaStyle = {
  border: "1px solid #cfead6",
  background: "#f7fff9",
  borderRadius: "18px",
  padding: "16px 18px",
  fontSize: "16px",
  outline: "none",
  resize: "vertical"
}
