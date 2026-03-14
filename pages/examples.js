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

    const winners = enriched.filter((t) => t.result === "Win")

    const aGradeExamples = winners.filter((t) => t.edgeScore >= 8)

    const strongExamples = winners.filter((t) => t.edgeScore >= 6)

    const weakExamples = enriched.filter(
      (t) => t.result === "Loss" || t.edgeScore <= 3
    )

    const weakExamplesWithMatches = weakExamples.map((trade) => ({
      ...trade,
      mostSimilarWinning: getMostSimilarWinningTrade(trade, winners)
    }))

    return {
      aGradeExamples,
      strongExamples,
      weakExamplesWithMatches
    }
  }, [trades])

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f2fff6 0%, #ecfff3 50%, #f8fffb 100%)",
        fontFamily: "Arial, sans-serif",
        color: "#0f172a",
        padding: "20px"
      }}
    >
      <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
        {/* NAVBAR */}

        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid #d1f0da",
            borderRadius: "32px",
            padding: "12px",
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr 1.35fr 1.2fr 1fr 1fr 1fr",
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

        {/* PAGE TITLE */}

        <div style={whiteCard}>
          <div style={{ fontSize: "36px", fontWeight: 700 }}>
            Example Library
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "18px"
            }}
          >
            Your best and worst trades ranked by setup quality
          </div>
        </div>

        {/* A GRADE */}

        <div style={{ marginTop: "20px" }}>
          <div style={sectionTitle}>A Grade Trades</div>

          <div style={gridWrap}>
            {analytics.aGradeExamples.length ? (
              analytics.aGradeExamples.map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))
            ) : (
              <div style={loopCard}>No A-grade trades yet</div>
            )}
          </div>
        </div>

        {/* STRONG */}

        <div style={{ marginTop: "30px" }}>
          <div style={sectionTitle}>Strong Trades</div>

          <div style={gridWrap}>
            {analytics.strongExamples.length ? (
              analytics.strongExamples.map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))
            ) : (
              <div style={loopCard}>No strong trades yet</div>
            )}
          </div>
        </div>

        {/* WEAK */}

        <div style={{ marginTop: "30px" }}>
          <div style={sectionTitle}>
            Weak Trades + Closest Winning Match
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {analytics.weakExamplesWithMatches.map((trade) => (
              <WeakExampleCard key={trade.id} trade={trade} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* TRADE CARD */

function TradeCard({ trade }) {
  return (
    <Link
      href={`/trade/${trade.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        padding: "18px",
        border: "1px solid #d1f0da",
        borderRadius: "24px",
        background: "#eef9f3"
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "18px" }}>
        {trade.pair} • {trade.session}
      </div>

      <div style={{ marginTop: "8px", color: "#64748b" }}>
        Score: {trade.edgeScore}/10
      </div>

      <div style={{ marginTop: "10px", color: "#475569" }}>
        {trade.explanation}
      </div>
    </Link>
  )
}

/* WEAK CARD */

function WeakExampleCard({ trade }) {
  return (
    <div
      style={{
        padding: "18px",
        border: "1px solid #f5d0d0",
        borderRadius: "24px",
        background: "#fff7f7"
      }}
    >
      <div style={{ fontWeight: 700 }}>
        Weak Trade: {trade.pair}
      </div>

      {trade.mostSimilarWinning && (
        <div style={{ marginTop: "12px", color: "#0f8b62" }}>
          Closest Winner: {trade.mostSimilarWinning.pair}
        </div>
      )}
    </div>
  )
}

/* HELPERS */

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

function getSimilarityScore(a, b) {
  let score = 0

  const fields = [
    "session",
    "weekly_bias",
    "daily_bias",
    "context_4h"
  ]

  fields.forEach((field) => {
    if (a[field] === b[field]) score++
  })

  return score
}

function getEdgeScore(trade) {
  let score = 0

  if (trade.retest === "First") score++
  if (trade.level_freshness === "Fresh") score++
  if (trade.momentum_state === "Strong") score++

  return score
}

/* STYLES */

const sectionTitle = {
  fontSize: "26px",
  fontWeight: 700,
  marginBottom: "14px"
}

const gridWrap = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px"
}

const whiteCard = {
  background: "white",
  borderRadius: "30px",
  padding: "28px",
  border: "1px solid #d1f0da"
}

const loopCard = {
  background: "#eef9f3",
  borderRadius: "24px",
  padding: "22px"
}

const navBtn = {
  border: "none",
  background: "transparent",
  borderRadius: "24px",
  padding: "18px",
  cursor: "pointer"
}

const activeNav = {
  textDecoration: "none",
  background: "#08a56f",
  color: "white",
  borderRadius: "24px",
  padding: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap"
}

const navBtnLink = {
  textDecoration: "none",
  background: "transparent",
  color: "#334155",
  borderRadius: "24px",
  padding: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap"
}
