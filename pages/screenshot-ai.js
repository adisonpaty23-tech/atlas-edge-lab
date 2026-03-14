import Link from "next/link"
import { useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

export default function ScreenshotAI() {
  const [form, setForm] = useState({
    chart_link: "",
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
    notes: ""
  })

  const [saving, setSaving] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const edgeScore = useMemo(() => getEdgeScore(form), [form])

  const gradeLabel = useMemo(() => {
    if (edgeScore >= 8) return "A Grade"
    if (edgeScore >= 6) return "B Grade"
    if (edgeScore >= 4) return "C Grade"
    return "Weak Setup"
  }, [edgeScore])

  async function saveTrade() {
    setSaving(true)

    const payload = {
      ...form,
      r_multiple: form.r_multiple === "" ? null : Number(form.r_multiple)
    }

    const { error } = await supabase.from("trades").insert([payload])

    if (error) {
      alert("Error saving trade")
      console.log(error)
    } else {
      alert("Trade saved")
      setForm({
        chart_link: "",
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
        notes: ""
      })
    }

    setSaving(false)
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
            gridTemplateColumns: "1fr 1fr 1.35fr 1.2fr 1fr 1fr 1fr",
            gap: "10px",
            marginBottom: "20px"
          }}
        >
          <Link href="/dashboard" style={navBtnLink}>Dashboard</Link>
          <Link href="/model" style={navBtnLink}>My Model</Link>
          <Link href="/examples" style={navBtnLink}>Example Library</Link>
          <Link href="/journal" style={navBtnLink}>Trade Journal</Link>
          <Link href="/screenshot-ai" style={activeNav}>Screenshot AI</Link>
          <Link href="/coach" style={navBtnLink}>AI Coach</Link>
          <Link href="/reports" style={navBtnLink}>Reports</Link>
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
              <span style={pillDark}>Screenshot AI</span>
              <span style={pillDark}>TradingView Link Flow</span>
            </div>

            <div style={{ fontSize: "60px", fontWeight: 700, lineHeight: 1.02, marginBottom: "18px" }}>
              Fast Trade Capture
            </div>

            <div style={{ fontSize: "22px", lineHeight: 1.45, maxWidth: "880px", color: "rgba(255,255,255,0.92)" }}>
              Paste your TradingView link, confirm the setup details, and instantly save a structured trade into your system with an automatic edge score.
            </div>

            <div style={{ display: "flex", gap: "14px", marginTop: "28px", flexWrap: "wrap" }}>
              <Link href="/journal" style={primaryBtn}>
                Open journal <span style={{ marginLeft: "12px" }}>›</span>
              </Link>
              <Link href="/coach" style={secondaryBtn}>
                Open AI Coach
              </Link>
            </div>
          </div>

          <div style={whiteCardLarge}>
            <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "6px" }}>AI Capture Flow</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "28px" }}>
              What this page does
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {[
                "1. Paste TradingView chart link",
                "2. Confirm setup details",
                "3. Auto-calculate edge score",
                "4. Save into your AI trading database"
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
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "8px" }}>TradingView Link Analyzer</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
              Paste the link, confirm the setup, save the trade
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <input
                placeholder="TradingView Chart Link"
                value={form.chart_link}
                onChange={(e) => updateField("chart_link", e.target.value)}
                style={inputStyle}
              />

              <div style={twoCol}>
                <input placeholder="Pair" value={form.pair} onChange={(e) => updateField("pair", e.target.value)} style={inputStyle} />
                <input placeholder="Session" value={form.session} onChange={(e) => updateField("session", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input placeholder="Weekly Bias" value={form.weekly_bias} onChange={(e) => updateField("weekly_bias", e.target.value)} style={inputStyle} />
                <input placeholder="Daily Bias" value={form.daily_bias} onChange={(e) => updateField("daily_bias", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input placeholder="4H Context" value={form.context_4h} onChange={(e) => updateField("context_4h", e.target.value)} style={inputStyle} />
                <input placeholder="Entry Type" value={form.entry_type} onChange={(e) => updateField("entry_type", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input placeholder="Retest" value={form.retest} onChange={(e) => updateField("retest", e.target.value)} style={inputStyle} />
                <input placeholder="Quality" value={form.quality} onChange={(e) => updateField("quality", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input placeholder="Approach Type" value={form.approach_type} onChange={(e) => updateField("approach_type", e.target.value)} style={inputStyle} />
                <input placeholder="Level Freshness" value={form.level_freshness} onChange={(e) => updateField("level_freshness", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input
                  placeholder="Space To Opposing Zone"
                  value={form.space_to_opposing_zone}
                  onChange={(e) => updateField("space_to_opposing_zone", e.target.value)}
                  style={inputStyle}
                />
                <input placeholder="Momentum State" value={form.momentum_state} onChange={(e) => updateField("momentum_state", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input placeholder="Structure State" value={form.structure_state} onChange={(e) => updateField("structure_state", e.target.value)} style={inputStyle} />
                <input placeholder="Zone Clarity" value={form.zone_clarity} onChange={(e) => updateField("zone_clarity", e.target.value)} style={inputStyle} />
              </div>

              <div style={twoCol}>
                <input placeholder="Result (Win/Loss)" value={form.result} onChange={(e) => updateField("result", e.target.value)} style={inputStyle} />
                <input placeholder="R Multiple" value={form.r_multiple} onChange={(e) => updateField("r_multiple", e.target.value)} style={inputStyle} />
              </div>

              <textarea
                placeholder="Explanation"
                value={form.explanation}
                onChange={(e) => updateField("explanation", e.target.value)}
                rows={4}
                style={textareaStyle}
              />

              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={4}
                style={textareaStyle}
              />

              <button onClick={saveTrade} disabled={saving} style={saveBtn}>
                {saving ? "Saving..." : "Save Trade"}
              </button>
            </div>
          </div>

          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "8px" }}>AI Setup Readout</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
              Instant setup quality score from your rules
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div style={summaryCard}>
                <div style={summaryLabel}>Chart Link</div>
                <div style={summaryValue}>{form.chart_link || "No link yet"}</div>
              </div>

              <div style={summaryCard}>
                <div style={summaryLabel}>Pair / Session</div>
                <div style={summaryValue}>
                  {form.pair || "N/A"} • {form.session || "N/A"}
                </div>
              </div>

              <div style={summaryCard}>
                <div style={summaryLabel}>Bias Alignment</div>
                <div style={summaryValue}>
                  {form.weekly_bias || "N/A"} / {form.daily_bias || "N/A"}
                </div>
              </div>

              <div style={summaryCard}>
                <div style={summaryLabel}>Setup Snapshot</div>
                <div style={summaryValue}>
                  {form.entry_type || "N/A"} • {form.retest || "N/A"} • {form.momentum_state || "N/A"}
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #bce8c9",
                  background: "#eef9f3",
                  borderRadius: "24px",
                  padding: "22px"
                }}
              >
                <div style={{ color: "#64748b", fontSize: "16px", marginBottom: "10px" }}>Edge Score</div>
                <div style={{ fontSize: "46px", fontWeight: 700, color: "#0f8b62", lineHeight: 1 }}>
                  {edgeScore}/10
                </div>
                <div style={{ marginTop: "12px", fontSize: "18px", fontWeight: 700, color: "#334155" }}>
                  {gradeLabel}
                </div>
              </div>

              <div style={tipsCard}>
                <div style={{ fontWeight: 700, marginBottom: "10px" }}>Scoring logic currently rewards:</div>
                <div style={{ color: "#475569", lineHeight: 1.6 }}>
                  Bias alignment, first retest, clean quality, London/New York session, rejection or sweep entry, impulse approach, fresh levels, high space, and strong momentum.
                </div>
              </div>

              {form.chart_link ? (
                <a href={form.chart_link} target="_blank" rel="noreferrer" style={chartLink}>
                  Open TradingView Link
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getEdgeScore(trade) {
  let score = 0

  if (trade.weekly_bias && trade.daily_bias && trade.weekly_bias === trade.daily_bias && trade.weekly_bias !== "Neutral") score += 2
  if (trade.retest === "First") score += 1
  if (trade.quality === "Clean" || trade.quality === "GOOD" || trade.quality === "Good") score += 1
  if (trade.session === "London" || trade.session === "New York") score += 1
  if (trade.entry_type === "Rejection" || trade.entry_type === "Sweep") score += 1
  if (trade.approach_type === "Impulse") score += 1
  if (trade.level_freshness === "Fresh") score += 1
  if (trade.space_to_opposing_zone === "High") score += 1
  if (trade.momentum_state === "Strong") score += 1

  return score
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
  justifyContent: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
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
  justifyContent: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
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

const loopCard = {
  background: "#eef9f3",
  borderRadius: "24px",
  padding: "22px 20px",
  fontSize: "18px",
  color: "#334155"
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

const summaryCard = {
  border: "1px solid #d1f0da",
  background: "#eef9f3",
  borderRadius: "22px",
  padding: "18px"
}

const summaryLabel = {
  color: "#64748b",
  fontSize: "15px",
  marginBottom: "8px"
}

const summaryValue = {
  fontWeight: 700,
  fontSize: "17px",
  color: "#334155",
  lineHeight: 1.45
}

const tipsCard = {
  border: "1px solid #d1f0da",
  background: "#f7fff9",
  borderRadius: "22px",
  padding: "18px"
}

const chartLink = {
  textDecoration: "none",
  color: "#0f8b62",
  fontWeight: 700,
  fontSize: "16px"
}
