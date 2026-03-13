import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../lib/supabase"

export default function Journal() {
  const [form, setForm] = useState({
    pair: "",
    session: "",
    weekly_bias: "",
    daily_bias: "",
    context_4h: "",
    retest: "",
    entry_type: "",
    quality: "",
    result: "",
    r_multiple: "",
    explanation: "",
    notes: "",
    chart_link: "",
    approach_type: "",
    level_freshness: "",
    space_to_opposing_zone: "",
    momentum_state: "",
    structure_state: "",
    zone_clarity: ""
  })

  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function saveTrade() {
    setLoading(true)

    const payload = {
      ...form,
      r_multiple: form.r_multiple === "" ? null : Number(form.r_multiple)
    }

    const { error } = await supabase.from("trades").insert([payload])

    if (error) {
      alert("Error saving trade")
      console.log(error)
    } else {
      alert("Trade saved!")
      setForm({
        pair: "",
        session: "",
        weekly_bias: "",
        daily_bias: "",
        context_4h: "",
        retest: "",
        entry_type: "",
        quality: "",
        result: "",
        r_multiple: "",
        explanation: "",
        notes: "",
        chart_link: "",
        approach_type: "",
        level_freshness: "",
        space_to_opposing_zone: "",
        momentum_state: "",
        structure_state: "",
        zone_clarity: ""
      })
      fetchTrades()
    }

    setLoading(false)
  }

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

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", background: "#f2fff6", minHeight: "100vh" }}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <Link href="/">Home</Link>
        <Link href="/journal">Trade Journal</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/coach">AI Coach</Link>
      </div>

      <h1>Trade Journal</h1>

      <div style={{ display: "grid", gap: "12px", maxWidth: "700px", marginTop: "24px" }}>
        <input name="pair" placeholder="Pair" value={form.pair} onChange={handleChange} />
        <input name="session" placeholder="Session" value={form.session} onChange={handleChange} />
        <input name="weekly_bias" placeholder="Weekly Bias" value={form.weekly_bias} onChange={handleChange} />
        <input name="daily_bias" placeholder="Daily Bias" value={form.daily_bias} onChange={handleChange} />
        <input name="context_4h" placeholder="4H Context" value={form.context_4h} onChange={handleChange} />
        <input name="retest" placeholder="Retest" value={form.retest} onChange={handleChange} />
        <input name="entry_type" placeholder="Entry Type" value={form.entry_type} onChange={handleChange} />
        <input name="quality" placeholder="Quality" value={form.quality} onChange={handleChange} />
        <input name="result" placeholder="Result" value={form.result} onChange={handleChange} />
        <input name="r_multiple" placeholder="R Multiple" value={form.r_multiple} onChange={handleChange} />
        <input name="approach_type" placeholder="Approach Type" value={form.approach_type} onChange={handleChange} />
        <input name="level_freshness" placeholder="Level Freshness" value={form.level_freshness} onChange={handleChange} />
        <input name="space_to_opposing_zone" placeholder="Space To Opposing Zone" value={form.space_to_opposing_zone} onChange={handleChange} />
        <input name="momentum_state" placeholder="Momentum State" value={form.momentum_state} onChange={handleChange} />
        <input name="structure_state" placeholder="Structure State" value={form.structure_state} onChange={handleChange} />
        <input name="zone_clarity" placeholder="Zone Clarity" value={form.zone_clarity} onChange={handleChange} />
        <input name="chart_link" placeholder="TradingView Chart Link" value={form.chart_link} onChange={handleChange} />

        <textarea name="explanation" placeholder="Explanation" value={form.explanation} onChange={handleChange} rows={4} />
        <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} rows={4} />

        <button onClick={saveTrade} disabled={loading}>
          {loading ? "Saving..." : "Save Trade"}
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Saved Trades</h2>

        <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
          {trades.map((trade) => (
            <div
              key={trade.id}
              style={{
                padding: "16px",
                border: "1px solid #cfead6",
                borderRadius: "12px",
                background: "#ffffff"
              }}
            >
              <strong>{trade.pair}</strong> — {trade.session}
              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                Result: {trade.result} | R: {trade.r_multiple}
              </div>
              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                {trade.explanation}
              </div>
              {trade.chart_link && (
                <div style={{ marginTop: "10px" }}>
                  <a href={trade.chart_link} target="_blank" rel="noreferrer">
                    View Chart
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
