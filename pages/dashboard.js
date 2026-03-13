import Link from "next/link"
import { useEffect, useState } from "react"
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

  const totalTrades = trades.length
  const wins = trades.filter((t) => t.result === "Win").length
  const losses = trades.filter((t) => t.result === "Loss").length
  const winRate = totalTrades ? Math.round((wins / totalTrades) * 100) : 0

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", background: "#f2fff6", minHeight: "100vh" }}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <Link href="/">Journal</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/coach">AI Coach</Link>
      </div>

      <h1>Atlas Edge Lab Dashboard</h1>

      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(3, 1fr)", maxWidth: "900px", marginTop: "24px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #cfead6" }}>
          <h3>Total Trades</h3>
          <p>{totalTrades}</p>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #cfead6" }}>
          <h3>Wins / Losses</h3>
          <p>{wins} / {losses}</p>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #cfead6" }}>
          <h3>Win Rate</h3>
          <p>{winRate}%</p>
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <h2>Recent Trades</h2>
        <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
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
                Result: {trade.result || "-"} | R: {trade.r_multiple ?? "-"}
              </div>
              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                {trade.explanation || "No explanation"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
