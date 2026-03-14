import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Coach() {
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
    const wins = trades.filter((t) => t.result === "Win")
    const weakTrades = trades.filter((t) => t.result === "Loss" || getEdgeScore(t) <= 3)

    const weakComparisons = weakTrades
      .map((trade) => {
        const match = getMostSimilarWinningTrade(trade, wins)
        return {
          trade,
          match,
          missing: match ? getMissingConditions(trade, match) : []
        }
      })
      .filter((x) => x.match)

    return {
      total: trades.length,
      avgEdgeScore: trades.length
        ? (trades.reduce((sum, t) => sum + getEdgeScore(t), 0) / trades.length).toFixed(1)
        : "0.0",
      weakComparisons
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
            gridTemplateColumns: "1fr 1fr 1.35fr 1.2fr 1fr 1fr 1fr",
            gap: "10px",
            marginBottom: "20px"
          }}
        >
          <Link href="/dashboard" style={navBtnLink}>Dashboard</Link>
          <Link href="/model" style={navBtnLink}>My Model</Link>
          <Link href="/examples" style={navBtnLink}>Example Library</Link>
          <Link href="/journal" style={navBtnLink}>Trade Journal</Link>
          <Link href="/screenshot-ai" style={navBtnLink}>Screenshot AI</Link>
          <Link href="/coach" style={activeNav}>AI Coach</Link>
          <Link href="/reports" style={navBtnLink}>Reports</Link>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #0f5e43 0%, #15724f 55%, #8fddb0 100%)",
            borderRadius: "34px",
            padding: "34px",
            color: "white",
            marginBottom: "20px",
            boxShadow: "0 20px 50px rgba(16, 123, 76, 0.18)"
          }}
        >
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={pillDark}>AI Coach</span>
            <span style={pillDark}>Missing Conditions Engine</span>
          </div>

          <div style={{ fontSize: "60px", fontWeight: 700, lineHeight: 1.02, marginBottom: "18px" }}>
            Coach Your Edge
          </div>

          <div style={{ fontSize: "22px", lineHeight: 1.45, maxWidth: "900px", color: "rgba(255,255,255,0.92)" }}>
            The coach now compares weak trades to their closest winning match and tells you exactly which conditions were missing.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Total Trades</div>
              <div style={{ fontSize: "58px", fontWeight: 700, lineHeight: 1 }}>{analytics.total}</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>Saved in your system</div>
            </div>
            <div style={statIcon}>◎</div>
          </div>

          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Average Edge Score</div>
              <div style={{ fontSize: "58px", fontWeight: 700, lineHeight: 1 }}>{analytics.avgEdgeScore}/10</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>Average setup quality</div>
            </div>
            <div style={statIcon}>↗</div>
          </div>
        </div>

        <div style={whiteCard}>
          <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "8px" }}>Weak Trade vs Winning Match</div>
          <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
            What the winning setup had that the weak trade was missing
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {analytics.weakComparisons.length ? (
              analytics.weakComparisons.slice(0, 8).map((item) => (
                <div
                  key={item.trade.id}
                  style={{
                    padding: "18px",
                    border: "1px solid #d1f0da",
                    borderRadius: "24px",
                    background: "#eef9f3"
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}>
                        Weak Trade: {item.trade.pair} — {item.trade.session}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "14px" }}>
                        Score: {getEdgeScore(item.trade)}/10
                      </div>
                      <div style={{ marginTop: "10px", color: "#475569" }}>
                        {item.trade.explanation || "No explanation"}
                      </div>
                      <div style={{ marginTop: "12px" }}>
                        <Link href={`/trade/${item.trade.id}`} style={chartLink}>
                          Open Weak Trade
                        </Link>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}>
                        Closest Winner: {item.match.pair} — {item.match.session}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "14px" }}>
                        Score: {getEdgeScore(item.match)}/10 • Similarity: {getSimilarityScore(item.trade, item.match)}%
                      </div>
                      <div style={{ marginTop: "10px", color: "#475569" }}>
                        {item.match.explanation || "No explanation"}
                      </div>
                      <div style={{ marginTop: "12px" }}>
                        <Link href={`/trade/${item.match.id}`} style={chartLink}>
                          Open Winning Match
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {item.missing.length ? (
                      item.missing.map((m) => (
                        <span key={m} style={missingTag}>
                          Missing: {m}
                        </span>
                      ))
                    ) : (
                      <span style={missingTag}>No major missing conditions detected</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={loopCard}>Need more weak trades and winning trades to compare</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getMostSimilarWinningTrade(targetTrade, winners) {
  if (!winners.length) return null

  const matches = winners
    .filter((t) => t.id !== targetTrade.id)
    .map((t) => ({
      ...t,
      similarity: getSimilarityScore(targetTrade, t)
    }))
    .sort((a, b) => b.similarity - a.similarity)

  return matches[0] || null
}

function getMissingConditions(weakTrade, winningTrade) {
  const labels = {
    session: "better session",
    weekly_bias: "weekly bias alignment",
    daily_bias: "daily bias alignment",
    context_4h: "stronger 4H context",
    retest: "better retest condition",
    entry_type: "better entry type",
    quality: "cleaner quality",
    approach_type: "better approach type",
    level_freshness: "fresher level",
    space_to_opposing_zone: "more space to opposing zone",
    momentum_state: "stronger momentum",
    structure_state: "better structure state",
    zone_clarity: "clearer zone"
  }

  return Object.keys(labels)
    .filter((field) => weakTrade[field] !== winningTrade[field] && winningTrade[field])
    .map((field) => labels[field])
}

function getSimilarityScore(a, b) {
  let score = 0
  const fields = [
    "session",
    "weekly_bias",
    "daily_bias",
    "context_4h",
    "retest",
    "entry_type",
    "quality",
    "approach_type",
    "level_freshness",
    "space_to_opposing_zone",
    "momentum_state",
    "structure_state",
    "zone_clarity"
  ]

  fields.forEach((field) => {
    if (a[field] && b[field] && a[field] === b[field]) score += 1
  })

  return Math.round((score / fields.length) * 100)
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

const pillDark = {
  border: "1px solid rgba(255,255,255,0.35)",
  background: "rgba(255,255,255,0.12)",
  color: "white",
  borderRadius: "999px",
  padding: "12px 18px",
  fontSize: "16px",
  fontWeight: 600
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
  justifyContent: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
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

const loopCard = {
  background: "#eef9f3",
  borderRadius: "24px",
  padding: "22px 20px",
  fontSize: "18px",
  color: "#334155"
}

const chartLink = {
  textDecoration: "none",
  color: "#0f8b62",
  fontWeight: 700
}

const missingTag = {
  background: "#fff0f0",
  color: "#c24141",
  border: "1px solid #ffd4d4",
  borderRadius: "999px",
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: 700
}
