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
    const total = trades.length
    const wins = trades.filter((t) => t.result === "Win").length
    const losses = trades.filter((t) => t.result === "Loss").length
    const winRate = total ? Math.round((wins / total) * 100) : 0

    const bestSession = getBestBucket(trades, "session")
    const weakPattern = getWeakPattern(trades)
    const bestPattern = getBestPattern(trades)

    const strongScoreTrades = trades.filter((t) => getEdgeScore(t) >= 7)
    const weakScoreTrades = trades.filter((t) => getEdgeScore(t) <= 3)

    const strongScoreWinRate = getWinRate(strongScoreTrades)
    const weakScoreWinRate = getWinRate(weakScoreTrades)

    const avgEdgeScore = total
      ? (trades.reduce((sum, t) => sum + getEdgeScore(t), 0) / total).toFixed(1)
      : "0.0"

    return {
      total,
      wins,
      losses,
      winRate,
      bestSession,
      weakPattern,
      bestPattern,
      strongScoreWinRate,
      weakScoreWinRate,
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
          <Link href="/dashboard" style={navBtnLink}>Dashboard</Link>
          <Link href="/model" style={navBtnLink}>My Model</Link>
          <Link href="/examples" style={navBtnLink}>Example Library</Link>
          <Link href="/journal" style={navBtnLink}>Trade Journal</Link>
          <button style={navBtn}>Screenshot AI</button>
          <Link href="/coach" style={activeNav}>AI Coach</Link>
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
              <span style={pillDark}>AI Coach</span>
              <span style={pillDark}>Edge Score Engine</span>
            </div>

            <div style={{ fontSize: "60px", fontWeight: 700, lineHeight: 1.02, marginBottom: "18px" }}>
              Coach Your Edge
            </div>

            <div style={{ fontSize: "22px", lineHeight: 1.45, maxWidth: "820px", color: "rgba(255,255,255,0.92)" }}>
              Compare winners and losers, detect weak conditions, and see whether your strongest scored setups actually outperform your weaker ones.
            </div>

            <div style={{ display: "flex", gap: "14px", marginTop: "28px", flexWrap: "wrap" }}>
              <Link href="/journal" style={primaryBtn}>
                Review journal <span style={{ marginLeft: "12px" }}>›</span>
              </Link>
              <Link href="/dashboard" style={secondaryBtn}>
                Open dashboard
              </Link>
            </div>
          </div>

          <div style={whiteCardLarge}>
            <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "6px" }}>Coach Focus</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "28px" }}>
              What this page reads from your trades
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {[
                "1. Win rate and session quality",
                "2. Best pattern vs weakest pattern",
                "3. Strong edge score vs weak edge score",
                "4. Average setup quality across all trades"
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
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>Current overall performance</div>
            </div>
            <div style={statIcon}>↗</div>
          </div>

          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Average Edge Score</div>
              <div style={{ fontSize: "42px", fontWeight: 700, lineHeight: 1 }}>{analytics.avgEdgeScore}/10</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>Average setup quality</div>
            </div>
            <div style={statIcon}>◉</div>
          </div>

          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Best Session</div>
              <div style={{ fontSize: "42px", fontWeight: 700, lineHeight: 1 }}>{analytics.bestSession}</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>Strongest environment so far</div>
            </div>
            <div style={statIcon}>✣</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "8px" }}>Coach Summary</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
              Current conclusions from your saved trades
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div style={goodPill}>
                Strongest pattern right now: <strong>{analytics.bestPattern}</strong>
              </div>

              <div style={badPill}>
                Main weakness right now: <strong>{analytics.weakPattern}</strong>
              </div>

              <div style={goodPill}>
                Strong edge score trades (7+/10): <strong>{analytics.strongScoreWinRate}%</strong> win rate
              </div>

              <div style={badPill}>
                Weak edge score trades (3/10 or below): <strong>{analytics.weakScoreWinRate}%</strong> win rate
              </div>
            </div>
          </div>

          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "8px" }}>Action Focus</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
              What the coach wants you to do next
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              {[
                `Keep prioritizing ${analytics.bestPattern.toLowerCase()}`,
                `Reduce ${analytics.weakPattern.toLowerCase()} setups`,
                "Put more capital behind 7+/10 setups only",
                "Use trade detail pages to compare weak vs strong scored trades"
              ].map((item) => (
                <div key={item} style={loopCard}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={whiteCard}>
          <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "8px" }}>Recent Trades Reviewed</div>
          <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "26px" }}>
            Latest trades feeding the coach engine
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

function getWinRate(rows) {
  if (!rows.length) return 0
  const wins = rows.filter((t) => t.result === "Win").length
  return Math.round((wins / rows.length) * 100)
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
    const rate = getWinRate(list)
    if (rate > bestRate) {
      bestRate = rate
      bestKey = key
    }
  })

  return bestKey
}

function getBestPattern(rows) {
  const patterns = [
    { label: "First retests", rate: getWinRate(rows.filter((t) => t.retest === "First")) },
    { label: "Fresh levels", rate: getWinRate(rows.filter((t) => t.level_freshness === "Fresh")) },
    { label: "Strong momentum", rate: getWinRate(rows.filter((t) => t.momentum_state === "Strong")) },
    { label: "London session", rate: getWinRate(rows.filter((t) => t.session === "London")) }
  ].filter((x) => x.rate > 0)

  if (!patterns.length) return "Need more data"
  return [...patterns].sort((a, b) => b.rate - a.rate)[0].label
}

function getWeakPattern(rows) {
  const patterns = [
    { label: "Weak momentum", rate: getWinRate(rows.filter((t) => t.momentum_state === "Weak")), count: rows.filter((t) => t.momentum_state === "Weak").length },
    { label: "Used levels", rate: getWinRate(rows.filter((t) => t.level_freshness === "Used")), count: rows.filter((t) => t.level_freshness === "Used").length },
    { label: "Later retests", rate: getWinRate(rows.filter((t) => t.retest && t.retest !== "First")), count: rows.filter((t) => t.retest && t.retest !== "First").length },
    { label: "Neutral daily bias", rate: getWinRate(rows.filter((t) => t.daily_bias === "Neutral")), count: rows.filter((t) => t.daily_bias === "Neutral").length }
  ].filter((x) => x.count > 0)

  if (!patterns.length) return "Need more data"
  return [...patterns].sort((a, b) => a.rate - b.rate)[0].label
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

const goodPill = {
  border: "1px solid #caecd5",
  background: "#eef9f3",
  color: "#0f8b62",
  borderRadius: "22px",
  padding: "16px 18px",
  fontSize: "16px",
  lineHeight: 1.45
}

const badPill = {
  border: "1px solid #ffd4d4",
  background: "#fff0f0",
  color: "#c24141",
  borderRadius: "22px",
  padding: "16px 18px",
  fontSize: "16px",
  lineHeight: 1.45
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
