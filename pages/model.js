import Link from "next/link"

export default function Model() {
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
          <Link href="/model" style={activeNav}>My Model</Link>
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
              <span style={pillDark}>My Model</span>
              <span style={pillDark}>Teach the AI</span>
            </div>

            <div style={{ fontSize: "60px", fontWeight: 700, lineHeight: 1.02, marginBottom: "18px" }}>
              Define Your Edge
            </div>

            <div style={{ fontSize: "22px", lineHeight: 1.45, maxWidth: "820px", color: "rgba(255,255,255,0.92)" }}>
              Store your weekly bias logic, daily bias logic, level rules, entry rules, invalidation logic, and risk
              model so the coach understands exactly how you see the market.
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
            <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "6px" }}>Model Focus</div>
            <div style={{ color: "#64748b", fontSize: "18px", marginBottom: "28px" }}>
              What this page should store
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {[
                "1. Weekly and daily bias logic",
                "2. Support and resistance definition",
                "3. Entry and invalidation rules",
                "4. Risk model and best-practice examples"
              ].map((item) => (
                <div key={item} style={loopCard}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "18px" }}>Weekly Bias Logic</div>
            <textarea style={textareaStyle} rows={8} placeholder="Explain how you define weekly bias..." />

            <div style={{ height: "18px" }} />

            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "18px" }}>Daily Bias Logic</div>
            <textarea style={textareaStyle} rows={8} placeholder="Explain how you define daily bias..." />
          </div>

          <div style={whiteCard}>
            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "18px" }}>Level + Entry Rules</div>
            <textarea style={textareaStyle} rows={8} placeholder="Explain support/resistance, entry logic, and invalidation..." />

            <div style={{ height: "18px" }} />

            <div style={{ fontSize: "34px", fontWeight: 700, marginBottom: "18px" }}>Risk Model</div>
            <textarea style={textareaStyle} rows={8} placeholder="Explain stop, target, RR, and risk framework..." />
          </div>
        </div>
      </div>
    </div>
  )
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

const textareaStyle = {
  width: "100%",
  border: "1px solid #cfead6",
  background: "#f7fff9",
  borderRadius: "18px",
  padding: "16px 18px",
  fontSize: "16px",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box"
}
