import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Dashboard() {
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

    const bestSession = getBestBucket(trades, "session")
    const bestPair = getBestBucket(trades, "pair")

    const avgEdgeScore = total
      ? (
          trades.reduce((sum, t) => sum + getEdgeScore(t), 0) / total
        ).toFixed(1)
      : "0.0"

    return {
      total,
      wins,
      losses,
      winRate,
      expectancy,
      bestSession,
      bestPair,
      avgEdgeScore
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
          <Link href="/dashboard" style={activeNav}>
            Dashboard
          </Link>
          <Link href="/model" style={navBtnLink}>
            My Model
          </Link>
          <Link href="/examples" style={navBtnLink}>
            Example Library
          </Link>
          <Link href="/journal" style={navBtnLink}>
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
              <span style={pillDark}>Dashboard</span>
              <span style={pillDark}>Performance Overview</span>
            </div>

            <div style={{ fontSize: "60px", fontWeight: 700, lineHeight: 1.02, marginBottom: "18px" }}>
              Measure Your Edge
            </div>

            <div style={{ fontSize: "22px", lineHeight: 1.45, maxWidth: "820px", color: "rgba(255,255,255,0.92)" }}>
              Review your performance, track expectancy, identify your strongest environments, and keep refining the setups
              that deserve more capital and focus.
            </div>

            <div style={{ display: "flex", gap: "14px", marginTop: "28px", flexWrap: "wrap" }}>
              <Link href="/journal" style={primaryBtn}>
                Log a trade <span style={{ marginLeft: "12px" }}>›</span>
              </Link>
              <Link href="/coach" style={secondaryBtn}>
                Open AI Coach
              </Link>
            </div>
          </div>

          <div style={whiteCardLarge}>
            <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "6px" }}>Dashboard Focus</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "28px" }}>
              What this page helps you track
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {[
                "1. Total trades and win rate",
                "2. Expectancy per trade",
                "3. Best session and pair",
                "4. Average edge score"
              ].map((item) => (
                <div key={item} style={loopCard}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Total Trades</div>
              <div style={{ fontSize: "58px", fontWeight: 700, lineHeight: 1 }}>{analytics.total}</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>
                {analytics.wins} wins / {analytics.losses} losses
              </div>
            </div>
            <div style={statIcon}>◎</div>
          </div>

          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Win Rate</div>
              <div style={{ fontSize: "58px", fontWeight: 700, lineHeight: 1 }}>{analytics.winRate}%</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>Based on all logged trades</div>
            </div>
            <div style={statIcon}>↗</div>
          </div>

          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Expectancy</div>
              <div style={{ fontSize: "58px", fontWeight: 700, lineHeight: 1 }}>{analytics.expectancy}R</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>Average R per trade</div>
            </div>
            <div style={statIcon}>✣</div>
          </div>

          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Average Edge Score</div>
              <div style={{ fontSize: "42px", fontWeight: 700, lineHeight: 1 }}>{analytics.avgEdgeScore}/10</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>
                Best Session: {analytics.bestSession} • Best Pair: {analytics.bestPair}
              </div>
            </div>
            <div style={statIcon}>◉</div>
          </div>
        </div>

        <div style={whiteCard}>
          <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "8px" }}>Recent Trades</div>
          <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
            Latest entries feeding your pattern engine
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            {trades.slice(0, 6).map((trade) => (
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
                    {getEdgeScore(trade)}/10
                  </div>
                </div>

                <div style={{ marginTop: "12px", fontSize: "15px", color: "#475569", lineHeight: 1.45 }}>
                  {trade.explanation || "No explanation"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getBestBucket(rows, field) {
  const buckets = {}

  rows.forEach((row) => {
    const key = row[field]
    if (!key) return
    if (!buckets[key]) buckets[key] = []
    buckets[key].push(row)
  })

  let bestKey = "N/A"
  let bestRate = -1

  Object.entries(buckets).forEach(([key, list]) => {
    const wins = list.filter((t) => t.result === "Win").length
    const rate = list.length ? wins / list.length : 0
    if (rate > bestRate) {
      bestRate = rate
      bestKey = key
    }
  })

  return bestKey
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
