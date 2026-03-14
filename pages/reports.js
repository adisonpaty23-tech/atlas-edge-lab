import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Reports() {
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
    const highScoreTrades = trades.filter((t) => getEdgeScore(t) >= 7)
    const midScoreTrades = trades.filter((t) => getEdgeScore(t) >= 4 && getEdgeScore(t) <= 6)
    const lowScoreTrades = trades.filter((t) => getEdgeScore(t) <= 3)

    return {
      bySession: buildStats(trades, "session"),
      byPair: buildStats(trades, "pair"),
      byEntry: buildStats(trades, "entry_type"),
      byMomentum: buildStats(trades, "momentum_state"),
      byFreshness: buildStats(trades, "level_freshness"),
      byRetest: buildStats(trades, "retest"),
      highScoreCount: highScoreTrades.length,
      midScoreCount: midScoreTrades.length,
      lowScoreCount: lowScoreTrades.length,
      highScoreWinRate: getWinRate(highScoreTrades),
      midScoreWinRate: getWinRate(midScoreTrades),
      lowScoreWinRate: getWinRate(lowScoreTrades),
      avgEdgeScore: trades.length
        ? (trades.reduce((sum, t) => sum + getEdgeScore(t), 0) / trades.length).toFixed(1)
        : "0.0"
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
          <Link href="/coach" style={navBtnLink}>AI Coach</Link>
          <Link href="/reports" style={activeNav}>Reports</Link>
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
              <span style={pillDark}>Reports</span>
              <span style={pillDark}>Edge Score Breakdown</span>
            </div>

            <div style={{ fontSize: "60px", fontWeight: 700, lineHeight: 1.02, marginBottom: "18px" }}>
              Read the Patterns
            </div>

            <div style={{ fontSize: "22px", lineHeight: 1.45, maxWidth: "820px", color: "rgba(255,255,255,0.92)" }}>
              Break performance down by session, pair, entry type, and edge score so the system can prove whether your best setups truly outperform the weak ones.
            </div>

            <div style={{ display: "flex", gap: "14px", marginTop: "28px", flexWrap: "wrap" }}>
              <Link href="/journal" style={primaryBtn}>
                Log more trades <span style={{ marginLeft: "12px" }}>›</span>
              </Link>
              <Link href="/coach" style={secondaryBtn}>
                Open AI Coach
              </Link>
            </div>
          </div>

          <div style={whiteCardLarge}>
            <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "6px" }}>Score Focus</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "28px" }}>
              What this page is measuring now
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {[
                "1. High-score trade win rate",
                "2. Mid-score trade win rate",
                "3. Low-score trade win rate",
                "4. Average edge score across all trades"
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
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>High Score Trades</div>
              <div style={{ fontSize: "52px", fontWeight: 700, lineHeight: 1 }}>{analytics.highScoreWinRate}%</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>
                {analytics.highScoreCount} trades scored 7+/10
              </div>
            </div>
            <div style={statIcon}>A</div>
          </div>

          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Mid Score Trades</div>
              <div style={{ fontSize: "52px", fontWeight: 700, lineHeight: 1 }}>{analytics.midScoreWinRate}%</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>
                {analytics.midScoreCount} trades scored 4–6/10
              </div>
            </div>
            <div style={statIcon}>B</div>
          </div>

          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Low Score Trades</div>
              <div style={{ fontSize: "52px", fontWeight: 700, lineHeight: 1 }}>{analytics.lowScoreWinRate}%</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>
                {analytics.lowScoreCount} trades scored 0–3/10
              </div>
            </div>
            <div style={statIcon}>C</div>
          </div>

          <div style={statWrap}>
            <div>
              <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "18px" }}>Average Edge Score</div>
              <div style={{ fontSize: "52px", fontWeight: 700, lineHeight: 1 }}>{analytics.avgEdgeScore}/10</div>
              <div style={{ color: "#64748b", fontSize: "17px", marginTop: "18px" }}>
                Average setup quality
              </div>
            </div>
            <div style={statIcon}>◎</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <ReportCard title="By Session" items={analytics.bySession} />
          <ReportCard title="By Pair" items={analytics.byPair} />
          <ReportCard title="By Entry Type" items={analytics.byEntry} />
          <ReportCard title="By Momentum" items={analytics.byMomentum} />
          <ReportCard title="By Level Freshness" items={analytics.byFreshness} />
          <ReportCard title="By Retest" items={analytics.byRetest} />
        </div>
      </div>
    </div>
  )
}

function ReportCard({ title, items }) {
  return (
    <div style={whiteCard}>
      <div style={{ fontSize: "30px", fontWeight: 700, marginBottom: "8px" }}>{title}</div>
      <div style={{ color: "#64748b", fontSize: "17px", marginBottom: "22px" }}>
        Win rate breakdown from saved trades
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {items.length ? (
          items.map((item) => (
            <div
              key={item.label}
              style={{
                padding: "16px",
                border: "1px solid #d1f0da",
                borderRadius: "22px",
                background: "#eef9f3",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "17px" }}>{item.label}</div>
                <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
                  {item.count} trades
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
                {item.winRate}%
              </div>
            </div>
          ))
        ) : (
          <div style={loopCard}>Need more data</div>
        )}
      </div>
    </div>
  )
}

function buildStats(rows, field) {
  const buckets = {}

  rows.forEach((row) => {
    const key = row[field]
    if (!key) return
    if (!buckets[key]) buckets[key] = []
    buckets[key].push(row)
  })

  return Object.entries(buckets)
    .map(([label, list]) => {
      const wins = list.filter((t) => t.result === "Win").length
      const winRate = list.length ? Math.round((wins / list.length) * 100) : 0
      return { label, count: list.length, winRate }
    })
    .sort((a, b) => b.winRate - a.winRate)
}

function getWinRate(rows) {
  if (!rows.length) return 0
  const wins = rows.filter((t) => t.result === "Win").length
  return Math.round((wins / rows.length) * 100)
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
