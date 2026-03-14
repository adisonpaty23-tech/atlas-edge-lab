import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function TradeDetail() {
  const router = useRouter()
  const { id } = router.query

  const [trade, setTrade] = useState(null)
  const [allTrades, setAllTrades] = useState([])

  useEffect(() => {
    if (id) {
      fetchTrade()
      fetchAllTrades()
    }
  }, [id])

  async function fetchTrade() {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("id", id)
      .single()

    if (!error) setTrade(data)
  }

  async function fetchAllTrades() {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) setAllTrades(data || [])
  }

  const similarTrades = useMemo(() => {
    if (!trade || !allTrades.length) return []

    return allTrades
      .filter((t) => t.id !== trade.id)
      .map((t) => ({
        ...t,
        similarity: getSimilarityScore(trade, t)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
  }, [trade, allTrades])

  const mostSimilarWinning = useMemo(() => {
    return similarTrades.find((t) => t.result === "Win") || null
  }, [similarTrades])

  const hiddenPatternNotes = useMemo(() => {
    if (!trade) return []

    const notes = []

    const sameSession = allTrades.filter((t) => t.session === trade.session)
    const sameMomentum = allTrades.filter((t) => t.momentum_state === trade.momentum_state)
    const sameFreshness = allTrades.filter((t) => t.level_freshness === trade.level_freshness)
    const sameRetest = allTrades.filter((t) => t.retest === trade.retest)

    if (sameSession.length) {
      notes.push(`Session ${trade.session}: ${getWinRate(sameSession)}% win rate`)
    }

    if (sameMomentum.length) {
      notes.push(`Momentum ${trade.momentum_state}: ${getWinRate(sameMomentum)}% win rate`)
    }

    if (sameFreshness.length) {
      notes.push(`Level freshness ${trade.level_freshness}: ${getWinRate(sameFreshness)}% win rate`)
    }

    if (sameRetest.length) {
      notes.push(`Retest ${trade.retest}: ${getWinRate(sameRetest)}% win rate`)
    }

    return notes
  }, [trade, allTrades])

  if (!trade) {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial", background: "#f2fff6", minHeight: "100vh" }}>
        Loading trade...
      </div>
    )
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
          <Link href="/dashboard" style={navBtnLink}>Dashboard</Link>
          <Link href="/model" style={navBtnLink}>My Model</Link>
          <Link href="/examples" style={navBtnLink}>Example Library</Link>
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
              <span style={pillDark}>Trade Detail</span>
              <span style={pillDark}>Pattern Analysis</span>
            </div>

            <div style={{ fontSize: "60px", fontWeight: 700, lineHeight: 1.02, marginBottom: "18px" }}>
              {trade.pair || "Trade"} Detail
            </div>

            <div style={{ fontSize: "22px", lineHeight: 1.45, maxWidth: "820px", color: "rgba(255,255,255,0.92)" }}>
              Deep review for one trade: full context, hidden pattern notes, similar setups, and the closest winning example.
            </div>

            <div style={{ display: "flex", gap: "14px", marginTop: "28px", flexWrap: "wrap" }}>
              <Link href="/journal" style={primaryBtn}>
                Back to journal <span style={{ marginLeft: "12px" }}>›</span>
              </Link>
              {trade.chart_link ? (
                <a href={trade.chart_link} target="_blank" rel="noreferrer" style={secondaryBtn}>
                  Open chart
                </a>
              ) : null}
            </div>
          </div>

          <div style={whiteCardLarge}>
            <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "6px" }}>Quick Summary</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "28px" }}>
              What the system sees first
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              <div style={loopCard}>Result: {trade.result || "N/A"}</div>
              <div style={loopCard}>R Multiple: {trade.r_multiple ?? "N/A"}R</div>
              <div style={loopCard}>Most similar winning trade: {mostSimilarWinning ? `${mostSimilarWinning.pair} (${mostSimilarWinning.similarity}%)` : "Need more data"}</div>
              <div style={loopCard}>Session: {trade.session || "N/A"}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "18px" }}>Trade Context</div>
            <div style={detailGrid}>
              <DetailItem label="Pair" value={trade.pair} />
              <DetailItem label="Session" value={trade.session} />
              <DetailItem label="Weekly Bias" value={trade.weekly_bias} />
              <DetailItem label="Daily Bias" value={trade.daily_bias} />
              <DetailItem label="4H Context" value={trade.context_4h} />
              <DetailItem label="Retest" value={trade.retest} />
              <DetailItem label="Entry Type" value={trade.entry_type} />
              <DetailItem label="Quality" value={trade.quality} />
              <DetailItem label="Approach Type" value={trade.approach_type} />
              <DetailItem label="Level Freshness" value={trade.level_freshness} />
              <DetailItem label="Space To Opposing Zone" value={trade.space_to_opposing_zone} />
              <DetailItem label="Momentum State" value={trade.momentum_state} />
              <DetailItem label="Structure State" value={trade.structure_state} />
              <DetailItem label="Zone Clarity" value={trade.zone_clarity} />
            </div>
          </div>

          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "18px" }}>Your Reasoning</div>
            <div style={textBox}>
              <div style={{ fontWeight: 700, marginBottom: "8px" }}>Explanation</div>
              <div>{trade.explanation || "No explanation"}</div>
            </div>

            <div style={{ height: "14px" }} />

            <div style={textBox}>
              <div style={{ fontWeight: 700, marginBottom: "8px" }}>Notes</div>
              <div>{trade.notes || "No notes"}</div>
            </div>

            {trade.chart_link ? (
              <>
                <div style={{ height: "14px" }} />
                <a href={trade.chart_link} target="_blank" rel="noreferrer" style={chartLink}>
                  View TradingView Chart
                </a>
              </>
            ) : null}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "18px" }}>Hidden Pattern Notes</div>
            <div style={{ display: "grid", gap: "12px" }}>
              {hiddenPatternNotes.length ? (
                hiddenPatternNotes.map((note) => (
                  <div key={note} style={goodPill}>{note}</div>
                ))
              ) : (
                <div style={loopCard}>Need more data</div>
              )}
            </div>
          </div>

          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "18px" }}>Most Similar Winning Chart</div>
            {mostSimilarWinning ? (
              <div style={similarCard}>
                <div style={{ fontWeight: 700, fontSize: "20px" }}>
                  {mostSimilarWinning.pair} — {mostSimilarWinning.session}
                </div>
                <div style={{ marginTop: "8px", color: "#64748b" }}>
                  Similarity Score: {mostSimilarWinning.similarity}%
                </div>
                <div style={{ marginTop: "12px", color: "#475569" }}>
                  {mostSimilarWinning.explanation || "No explanation"}
                </div>
                {mostSimilarWinning.chart_link ? (
                  <div style={{ marginTop: "14px" }}>
                    <a href={mostSimilarWinning.chart_link} target="_blank" rel="noreferrer" style={chartLink}>
                      View Similar Winning Chart
                    </a>
                  </div>
                ) : null}
              </div>
            ) : (
              <div style={loopCard}>Need more winning examples</div>
            )}
          </div>
        </div>

        <div style={whiteCard}>
          <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "18px" }}>Similar Trades</div>
          <div style={{ display: "grid", gap: "14px" }}>
            {similarTrades.length ? (
              similarTrades.map((t) => (
                <div key={t.id} style={similarRow}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{t.pair} — {t.session}</div>
                    <div style={{ color: "#64748b", marginTop: "4px" }}>
                      {t.result || "N/A"} • {t.approach_type || "-"} • {t.level_freshness || "-"}
                    </div>
                  </div>
                  <div style={scoreBadge}>{t.similarity}%</div>
                </div>
              ))
            ) : (
              <div style={loopCard}>Need more trades for comparison</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div style={detailItem}>
      <div style={{ color: "#64748b", fontSize: "14px", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value || "N/A"}</div>
    </div>
  )
}

function getWinRate(rows) {
  if (!rows.length) return 0
  const wins = rows.filter((t) => t.result === "Win").length
  return Math.round((wins / rows.length) * 100)
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

const detailGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px"
}

const detailItem = {
  padding: "16px",
  border: "1px solid #d1f0da",
  borderRadius: "20px",
  background: "#eef9f3"
}

const textBox = {
  padding: "18px",
  border: "1px solid #d1f0da",
  borderRadius: "20px",
  background: "#eef9f3",
  color: "#334155",
  lineHeight: 1.5
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

const similarCard = {
  padding: "18px",
  border: "1px solid #d1f0da",
  borderRadius: "24px",
  background: "#eef9f3"
}

const similarRow = {
  padding: "16px",
  border: "1px solid #d1f0da",
  borderRadius: "22px",
  background: "#eef9f3",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px"
}

const scoreBadge = {
  border: "1px solid #bce8c9",
  background: "white",
  color: "#0f8b62",
  borderRadius: "18px",
  padding: "10px 14px",
  fontSize: "15px",
  fontWeight: 700
}

const chartLink = {
  textDecoration: "none",
  color: "#0f8b62",
  fontWeight: 700
}
