import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../lib/supabase"

export default function Journal() {
  const [form, setForm] = useState({
    pair: "",
    session: "",
    weekly_bias: "",
    daily_bias: "",
    context_4h: "",
    retest: "",
    entry_type: "",
    quality: "",
    result: "",
    r_multiple: "",
    explanation: "",
    notes: "",
    chart_link: "",
    approach_type: "",
    level_freshness: "",
    space_to_opposing_zone: "",
    momentum_state: "",
    structure_state: "",
    zone_clarity: ""
  })

  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function saveTrade() {
    setLoading(true)

    const payload = {
      ...form,
      r_multiple: form.r_multiple === "" ? null : Number(form.r_multiple)
    }

    const { error } = await supabase.from("trades").insert([payload])

    if (error) {
      alert("Error saving trade")
      console.log(error)
    } else {
      alert("Trade saved!")
      setForm({
        pair: "",
        session: "",
        weekly_bias: "",
        daily_bias: "",
        context_4h: "",
        retest: "",
        entry_type: "",
        quality: "",
        result: "",
        r_multiple: "",
        explanation: "",
        notes: "",
        chart_link: "",
        approach_type: "",
        level_freshness: "",
        space_to_opposing_zone: "",
        momentum_state: "",
        structure_state: "",
        zone_clarity: ""
      })
      fetchTrades()
    }

    setLoading(false)
  }

  async function fetchTrades() {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) setTrades(data || [])
  }

  useEffect(() => {
    fetchTrades()
  }, [])

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
          <button style={navBtn}>My Model</button>
          <button style={navBtn}>Example Library</button>
          <Link href="/journal" style={activeNav}>
            Trade Journal
          </Link>
          <button style={navBtn}>Screenshot AI</button>
          <Link href="/coach" style={navBtnLink}>
            AI Coach
          </Link>
          <Link href="/model" style={navBtnLink}>My Model</Link>
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
                <input name="pair" placeholder="Pair" value={form.pair} onChange={handleChange} style={inputStyle} />
                <input name="session" placeholder="Session" value={form.session} onChange={handleChange} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input name="weekly_bias" placeholder="Weekly Bias" value={form.weekly_bias} onChange={handleChange} style={inputStyle} />
                <input name="daily_bias" placeholder="Daily Bias" value={form.daily_bias} onChange={handleChange} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input name="context_4h" placeholder="4H Context" value={form.context_4h} onChange={handleChange} style={inputStyle} />
                <input name="retest" placeholder="Retest" value={form.retest} onChange={handleChange} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input name="entry_type" placeholder="Entry Type" value={form.entry_type} onChange={handleChange} style={inputStyle} />
                <input name="quality" placeholder="Quality" value={form.quality} onChange={handleChange} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input name="result" placeholder="Result" value={form.result} onChange={handleChange} style={inputStyle} />
                <input name="r_multiple" placeholder="R Multiple" value={form.r_multiple} onChange={handleChange} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input
                  name="approach_type"
                  placeholder="Approach Type"
                  value={form.approach_type}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  name="level_freshness"
                  placeholder="Level Freshness"
                  value={form.level_freshness}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={twoCol}>
                <input
                  name="space_to_opposing_zone"
                  placeholder="Space To Opposing Zone"
                  value={form.space_to_opposing_zone}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  name="momentum_state"
                  placeholder="Momentum State"
                  value={form.momentum_state}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={twoCol}>
                <input
                  name="structure_state"
                  placeholder="Structure State"
                  value={form.structure_state}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  name="zone_clarity"
                  placeholder="Zone Clarity"
                  value={form.zone_clarity}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <input
                name="chart_link"
                placeholder="TradingView Chart Link"
                value={form.chart_link}
                onChange={handleChange}
                style={inputStyle}
              />

              <textarea
                name="explanation"
                placeholder="Explanation"
                value={form.explanation}
                onChange={handleChange}
                rows={4}
                style={textareaStyle}
              />

              <textarea
                name="notes"
                placeholder="Notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                style={textareaStyle}
              />

              <button onClick={saveTrade} disabled={loading} style={saveBtn}>
                {loading ? "Saving..." : "Save Trade"}
              </button>
            </div>
          </div>

          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "8px" }}>Saved Trades</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
              Your journal becomes the evidence for the coach
            </div>

            <div style={{ display: "grid", gap: "14px", maxHeight: "980px", overflowY: "auto", paddingRight: "4px" }}>
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  style={{
                    padding: "18px",
                    border: "1px solid #d1f0da",
                    borderRadius: "24px",
                    background: "#eef9f3"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <div style={{ fontWeight: 700, fontSize: "20px" }}>{trade.pair || "No pair"}</div>
                        <span style={resultBadge(trade.result)}>{trade.result || "No result"}</span>
                      </div>
                      <div style={{ marginTop: "8px", color: "#64748b", fontSize: "15px" }}>
                        {trade.session || "No session"} • {trade.weekly_bias || "-"} / {trade.daily_bias || "-"} / {trade.context_4h || "-"}
                      </div>
                    </div>

                    <div
                      style={{
                        border: "1px solid #bce8c9",
                        background: "white",
                        color: "#0f8b62",
                        borderRadius: "18px",
                        padding: "10px 14px",
                        fontSize: "15px",
                        fontWeight: 700
                      }}
                    >
                      {trade.r_multiple ?? "-"}R
                    </div>
                  </div>

                  <div style={{ marginTop: "12px", fontSize: "15px", color: "#475569", lineHeight: 1.45 }}>
                    {trade.explanation || "No explanation"}
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" }}>
                    {[
                      trade.entry_type,
                      trade.quality,
                      trade.approach_type,
                      trade.level_freshness,
                      trade.space_to_opposing_zone,
                      trade.momentum_state,
                      trade.structure_state,
                      trade.zone_clarity
                    ]
                      .filter(Boolean)
                      .map((tag) => (
                        <span key={tag} style={tagStyle}>
                          {tag}
                        </span>
                      ))}
                  </div>

                  {trade.notes ? (
                    <div style={{ marginTop: "12px", fontSize: "14px", color: "#64748b" }}>
                      Lesson: {trade.notes}
                    </div>
                  ) : null}

                  {trade.chart_link ? (
                    <div style={{ marginTop: "14px" }}>
                      <a href={trade.chart_link} target="_blank" rel="noreferrer" style={chartLink}>
                        View Chart
                      </a>
                    </div>
                  ) : null}
                </div>
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

const saveBtn = {
  border: "none",
  background: "#08a56f",
  color: "white",
  borderRadius: "20px",
  padding: "18px 22px",
  fontSize: "18px",
  fontWeight: 700,
  cursor: "pointer"
}

const tagStyle = {
  border: "1px solid #bde8ca",
  color: "#334155",
  background: "white",
  borderRadius: "999px",
  padding: "8px 12px",
  fontSize: "13px"
}

const chartLink = {
  textDecoration: "none",
  color: "#0f8b62",
  fontWeight: 700
}

function resultBadge(result) {
  if (result === "Win") {
    return {
      background: "#dff7e7",
      color: "#0f8b62",
      borderRadius: "999px",
      padding: "8px 12px",
      fontSize: "13px",
      fontWeight: 700
    }
  }

  if (result === "Loss") {
    return {
      background: "#ffe6e6",
      color: "#c24141",
      borderRadius: "999px",
      padding: "8px 12px",
      fontSize: "13px",
      fontWeight: 700
    }
  }

  return {
    background: "#eef2f7",
    color: "#475569",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 700
  }
}
