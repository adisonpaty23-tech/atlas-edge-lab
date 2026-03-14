import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Examples() {
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
    const enriched = trades.map((trade) => ({
      ...trade,
      edgeScore: getEdgeScore(trade)
    }))

    const aGradeExamples = enriched
      .filter((t) => t.result === "Win" && t.edgeScore >= 8)
      .sort((a, b) => b.edgeScore - a.edgeScore || Number(b.r_multiple || 0) - Number(a.r_multiple || 0))

    const strongExamples = enriched
      .filter((t) => t.result === "Win" && t.edgeScore >= 6)
      .sort((a, b) => b.edgeScore - a.edgeScore || Number(b.r_multiple || 0) - Number(a.r_multiple || 0))

    const weakExamples = enriched
      .filter((t) => t.result === "Loss" || t.edgeScore <= 3)
      .sort((a, b) => a.edgeScore - b.edgeScore || Number(a.r_multiple || 0) - Number(b.r_multiple || 0))

    return {
      aGradeExamples,
      strongExamples,
      weakExamples
    }
  }, [trades])

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
          <Link href="/dashboard" style={navBtnLink}>Dashboard</Link>
          <Link href="/model" style={navBtnLink}>My Model</Link>
          <Link href="/examples" style={activeNav}>Example Library</Link>
          <Link href="/journal" style={navBtnLink}>Trade Journal</Link>
          <button style={navBtn}>Screenshot AI</button>
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
              <span style={pillDark}>Example Library</span>
              <span style={pillDark}>A-Grade Setups</span>
            </div>

            <div style={{ fontSize: "60px", fontWeight: 700, lineHeight: 1.02, marginBottom: "18px" }}>
              Build Your Playbook
            </div>

            <div style={{ fontSize: "22px", lineHeight: 1.45, maxWidth: "820px", color: "rgba(255,255,255,0.92)" }}>
              Your best and worst trades now get ranked by setup quality, so the coach can point you toward A-grade examples and away from weak setups.
            </div>

            <div style={{ display: "flex", gap: "14px", marginTop: "28px", flexWrap: "wrap" }}>
              <Link href="/journal" style={primaryBtn}>
                Add more trades <span style={{ marginLeft: "12px" }}>›</span>
              </Link>
              <Link href="/coach" style={secondaryBtn}>
                Open AI Coach
              </Link>
            </div>
          </div>

          <div style={whiteCardLarge}>
            <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "6px" }}>Library Focus</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "28px" }}>
              What this page now highlights
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {[
                "1. A-grade winning examples",
                "2. Strong setups worth repeating",
                "3. Weak examples to avoid",
                "4. Trade references for the coach"
              ].map((item) => (
                <div key={item} style={loopCard}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: "700", marginBottom: "8px" }}>A-Grade Examples</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
              Winning trades scored 8+/10
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              {analytics.aGradeExamples.length ? (
                analytics.aGradeExamples.slice(0, 6).map((trade) => (
                  <TradeCard key={trade.id} trade={trade} variant="a" />
                ))
              ) : (
                <div style={loopCard}>No A-grade examples yet</div>
              )}
            </div>
          </div>

          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: "700", marginBottom: "8px" }}>Strong Examples</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
              Good winning trades scored 6+/10
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              {analytics.strongExamples.length ? (
                analytics.strongExamples.slice(0, 6).map((trade) => (
                  <TradeCard key={trade.id} trade={trade} variant="good" />
                ))
              ) : (
                <div style={loopCard}>No strong examples yet</div>
              )}
            </div>
          </div>
        </div>

        <div style={whiteCard}>
          <div style={{ fontSize: "34px", fontWeight: "700", marginBottom: "8px" }}>Weak Examples</div>
          <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
            Losing trades and low-score setups to avoid
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            {analytics.weakExamples.length ? (
              analytics.weakExamples.slice(0, 8).map((trade) => (
                <TradeCard key={trade.id} trade={trade} variant="weak" />
              ))
            ) : (
              <div style={loopCard}>No weak examples yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TradeCard({ trade, variant = "good" }) {
  const bg = variant === "weak" ? "#fff4f4" : variant === "a" ? "#ecfff3" : "#eef9f3"
  const border = variant === "weak" ? "#f5d0d0" : "#d1f0da"
  const scoreBg = variant === "weak" ? "#fff" : "#fff"
  const scoreColor = variant === "weak" ? "#c24141" : "#0f8b62"

  return (
    <Link
      href={`/trade/${trade.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        padding: "18px",
        border: `1px solid ${border}`,
        borderRadius: "24px",
        background: bg
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ fontWeight: 700, fontSize: "20px" }}>{trade.pair || "No pair"}</div>
            <span style={resultBadge(trade.result)}>{trade.result || "No result"}</span>
            <span style={gradeBadge(trade.edgeScore)}>{getGradeLabel(trade.edgeScore)}</span>
          </div>

          <div style={{ marginTop: "8px", color: "#64748b", fontSize: "15px" }}>
            {trade.session || "No session"} • {trade.weekly_bias || "-"} / {trade.daily_bias || "-"} / {trade.context_4h || "-"}
          </div>

          <div style={{ marginTop: "12px", fontSize: "15px", color: "#475569", lineHeight: 1.45 }}>
            {trade.explanation || "No explanation"}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #bce8c9",
            background: scoreBg,
            color: scoreColor,
            borderRadius: "18px",
            padding: "10px 14px",
            fontSize: "15px",
            fontWeight: 700,
            minWidth: "64px",
            textAlign: "center"
          }}
        >
          {trade.edgeScore}/10
        </div>
      </div>

      {trade.chart_link ? (
        <div style={{ marginTop: "14px" }}>
          <span style={chartLink}>View Chart</span>
        </div>
      ) : null}
    </Link>
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

function getGradeLabel(score) {
  if (score >= 8) return "A Grade"
  if (score >= 6) return "B Grade"
  if (score >= 4) return "C Grade"
  return "Weak"
}

function gradeBadge(score) {
  if (score >= 8) {
    return {
      background: "#dff7e7",
      color: "#0f8b62",
      borderRadius: "999px",
      padding: "8px 12px",
      fontSize: "13px",
      fontWeight: 700
    }
  }

  if (score >= 6) {
    return {
      background: "#eef9f3",
      color: "#0f8b62",
      borderRadius: "999px",
      padding: "8px 12px",
      fontSize: "13px",
      fontWeight: 700
    }
  }

  if (score >= 4) {
    return {
      background: "#eef2f7",
      color: "#475569",
      borderRadius: "999px",
      padding: "8px 12px",
      fontSize: "13px",
      fontWeight: 700
    }
  }

  return {
    background: "#ffe6e6",
    color: "#c24141",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 700
  }
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

const chartLink = {
  textDecoration: "none",
  color: "#0f8b62",
  fontWeight: 700
}
