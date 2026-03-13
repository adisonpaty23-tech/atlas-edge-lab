import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

function statCard(title, value, sub, icon) {
  return { title, value, sub, icon }
}

export default function Home() {
  const [trades, setTrades] = useState([])

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

  const analytics = useMemo(() => {
    const total = trades.length
    const wins = trades.filter((t) => t.result === "Win").length
    const losses = trades.filter((t) => t.result === "Loss").length
    const winRate = total ? Math.round((wins / total) * 100) : 0
    const expectancy = total
      ? (trades.reduce((sum, t) => sum + Number(t.r_multiple || 0), 0) / total).toFixed(2)
      : "0.00"

    const visionScore = total
      ? (
          trades.reduce((sum, t) => {
            let s = 0
            if (t.approach_type === "Impulse") s++
            if (t.level_freshness === "Fresh") s++
            if (t.space_to_opposing_zone === "High") s++
            if (t.momentum_state === "Strong") s++
            if (t.zone_clarity === "Clear") s++
            return sum + s
          }, 0) / total
        ).toFixed(1)
      : "0.0"

    const setupScore = total
      ? (
          trades.reduce((sum, t) => {
            let s = 0
            if (t.weekly_bias && t.weekly_bias === t.daily_bias && t.weekly_bias !== "Neutral") s += 2
            if (t.retest === "First") s++
            if (t.quality === "Clean") s++
            if (t.session === "London" || t.session === "New York") s++
            if (t.entry_type === "Rejection" || t.entry_type === "Sweep") s++
            if (t.approach_type === "Impulse") s++
            if (t.level_freshness === "Fresh") s++
            if (t.space_to_opposing_zone === "High") s++
            if (t.momentum_state === "Strong") s++
            return sum + s
          }, 0) / total
        ).toFixed(1)
      : "0.0"

    return {
      total,
      wins,
      losses,
      winRate,
      expectancy,
      visionScore,
      setupScore
    }
  }, [trades])

  const stats = [
    statCard("Win Rate", `${analytics.winRate}%`, "Based on logged trades", "↗"),
    statCard("Expectancy", `${analytics.expectancy}R`, "Average R per trade", "◎"),
    statCard("Vision Score", `${analytics.visionScore}/5`, "Average chart context quality", "◉"),
    statCard("Setup Score", `${analytics.setupScore}/10`, "Full rule + chart quality score", "✣")
  ]

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
        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #0f5e43 0%, #15724f 55%, #8fddb0 100%)",
              borderRadius: "34px",
              padding: "36px",
              color: "white",
              minHeight: "330px",
              boxShadow: "0 20px 50px rgba(16, 123, 76, 0.18)"
            }}
          >
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              <span style={pillDark}>AI Trading Review Coach</span>
              <span style={pillDark}>Vision + Pattern Engine</span>
            </div>

            <div style={{ fontSize: "72px", fontWeight: 700, lineHeight: 1.02, marginBottom: "18px" }}>
              Atlas Edge Lab
            </div>

            <div style={{ fontSize: "25px", lineHeight: 1.45, maxWidth: "900px", color: "rgba(255,255,255,0.92)" }}>
              Your private trading intelligence lab: chart screenshots, pattern comparison, deeper coaching, and
              data-driven review in one place.
            </div>

            <div style={{ display: "flex", gap: "14px", marginTop: "32px", flexWrap: "wrap" }}>
              <Link href="/journal" style={primaryBtn}>
                Start logging trades <span style={{ marginLeft: "12px" }}>›</span>
              </Link>
              <Link href="/coach" style={secondaryBtn}>
                Open Screenshot AI
              </Link>
            </div>
          </div>

          <div style={whiteCardLarge}>
            <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "6px" }}>System Loop</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "28px" }}>
              How your edge improves over time
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {[
                "1. Teach your model",
                "2. Save examples",
                "3. Log trades + screenshot context",
                "4. Compare patterns + coach improvements"
              ].map((item) => (
                <div key={item} style={loopCard}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "26px" }}>
          {stats.map((s) => (
            <div key={s.title} style={statWrap}>
              <div>
                <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>{s.title}</div>
                <div style={{ fontSize: "58px", fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>{s.sub}</div>
              </div>
              <div style={statIcon}>{s.icon}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid #d1f0da",
            borderRadius: "32px",
            padding: "12px",
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "10px"
          }}
        >
          <Link href="/dashboard" style={activeNav}>
            Dashboard
          </Link>
          <button style={navBtn}>My Model</button>
          <button style={navBtn}>Example Library</button>
          <Link href="/journal" style={navBtnLink}>
            Trade Journal
          </Link>
          <button style={navBtn}>Screenshot AI</button>
          <Link href="/coach" style={navBtnLink}>
            AI Coach
          </Link>
          <button style={navBtn}>Reports</button>
        </div>
      </div>
    </div>
  )
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

const whiteCardLarge = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid #ccefd7",
  borderRadius: "34px",
  padding: "32px",
  boxShadow: "0 14px 34px rgba(20, 120, 74, 0.08)"
}

const loopCard = {
  background: "#eef9f3",
  borderRadius: "24px",
  padding: "26px 22px",
  fontSize: "18px",
  color: "#334155"
}

const statWrap = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid #d1f0da",
  borderRadius: "30px",
  padding: "30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  minHeight: "195px",
  boxShadow: "0 12px 30px rgba(20, 120, 74, 0.06)"
}

const statIcon = {
  width: "70px",
  height: "70px",
  borderRadius: "22px",
  background: "#e9f8ef",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#0f8b62",
  fontSize: "32px",
  fontWeight: 700
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
