import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Coach() {
  const [trades, setTrades] = useState([])
  const [summary, setSummary] = useState({
    total: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    bestSession: "N/A",
    worstSession: "N/A",
    bestResultType: "N/A",
    weakPattern: "N/A"
  })

  async function fetchTrades() {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      const rows = data || []
      setTrades(rows)
      analyzeTrades(rows)
    }
  }

  function getWinRate(rows) {
    if (!rows.length) return 0
    const wins = rows.filter((t) => t.result === "Win").length
    return Math.round((wins / rows.length) * 100)
  }

  function analyzeTrades(rows) {
    const total = rows.length
    const wins = rows.filter((t) => t.result === "Win").length
    const losses = rows.filter((t) => t.result === "Loss").length
    const winRate = total ? Math.round((wins / total) * 100) : 0

    const sessions = ["Asia", "London", "New York"]
    const sessionStats = sessions
      .map((session) => {
        const list = rows.filter((t) => t.session === session)
        return { session, rate: getWinRate(list), count: list.length }
      })
      .filter((x) => x.count > 0)

    const bestSession =
      sessionStats.length > 0
        ? [...sessionStats].sort((a, b) => b.rate - a.rate)[0].session
        : "N/A"

    const worstSession =
      sessionStats.length > 0
        ? [...sessionStats].sort((a, b) => a.rate - b.rate)[0].session
        : "N/A"

    const firstRetest = rows.filter((t) => t.retest === "First")
    const laterRetest = rows.filter((t) => t.retest && t.retest !== "First")

    const bestResultType =
      getWinRate(firstRetest) >= getWinRate(laterRetest)
        ? "First retests look stronger"
        : "Later retests look stronger"

    let weakPattern = "Need more data"
    const weakMomentum = rows.filter((t) => t.momentum_state === "Weak")
    const neutralDaily = rows.filter((t) => t.daily_bias === "Neutral")
    const usedLevels = rows.filter((t) => t.level_freshness === "Used")

    const weaknessCandidates = [
      { label: "Weak momentum", rate: getWinRate(weakMomentum), count: weakMomentum.length },
      { label: "Neutral daily bias", rate: getWinRate(neutralDaily), count: neutralDaily.length },
      { label: "Used levels", rate: getWinRate(usedLevels), count: usedLevels.length }
    ].filter((x) => x.count > 0)

    if (weaknessCandidates.length > 0) {
      weakPattern = [...weaknessCandidates].sort((a, b) => a.rate - b.rate)[0].label
    }

    setSummary({
      total,
      wins,
      losses,
      winRate,
      bestSession,
      worstSession,
      bestResultType,
      weakPattern
    })
  }

  useEffect(() => {
    fetchTrades()
  }, [])

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", background: "#f2fff6", minHeight: "100vh" }}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <Link href="/">Journal</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/coach">AI Coach</Link>
      </div>

      <h1>AI Trading Coach</h1>

      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(2, 1fr)", maxWidth: "900px", marginTop: "24px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #cfead6" }}>
          <h3>Total Trades</h3>
          <p>{summary.total}</p>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #cfead6" }}>
          <h3>Win Rate</h3>
          <p>{summary.winRate}%</p>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #cfead6" }}>
          <h3>Best Session</h3>
          <p>{summary.bestSession}</p>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #cfead6" }}>
          <h3>Weakest Pattern</h3>
          <p>{summary.weakPattern}</p>
        </div>
      </div>

      <div style={{ marginTop: "30px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #cfead6", maxWidth: "900px" }}>
        <h3>Coach Summary</h3>
        <p><strong>Wins / Losses:</strong> {summary.wins} / {summary.losses}</p>
        <p><strong>Pattern note:</strong> {summary.bestResultType}</p>
        <p><strong>Focus:</strong> Avoid {summary.weakPattern.toLowerCase()} setups where possible.</p>
      </div>

      <div style={{ marginTop: "30px", maxWidth: "900px" }}>
        <h3>Recent Trades Reviewed</h3>
        <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
          {trades.slice(0, 5).map((trade) => (
            <div
              key={trade.id}
              style={{
                padding: "16px",
                border: "1px solid #cfead6",
                borderRadius: "12px",
                background: "#ffffff"
              }}
            >
              <strong>{trade.pair || "No pair"}</strong> — {trade.session || "No session"}
              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                {trade.weekly_bias || "-"} / {trade.daily_bias || "-"} / {trade.context_4h || "-"}
              </div>
              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                Result: {trade.result || "-"} | R: {trade.r_multiple ?? "-"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
