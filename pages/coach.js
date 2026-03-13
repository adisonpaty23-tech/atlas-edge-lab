import Link from "next/link"

export default function Coach(){

  return(

    <div style={{padding:"40px",fontFamily:"Arial",background:"#f2fff6",minHeight:"100vh"}}>

      <div style={{display:"flex",gap:"20px",marginBottom:"30px"}}>
        <Link href="/">Journal</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/coach">AI Coach</Link>
      </div>

      <h1>AI Trading Coach</h1>

      <p>
      This is where the system will analyze your trades and detect patterns.
      </p>

      <div style={{
        marginTop:"30px",
        padding:"20px",
        background:"white",
        borderRadius:"12px",
        border:"1px solid #cfead6"
      }}>

        <h3>Coming Soon</h3>

        <p>
        The AI coach will analyze your saved trades and detect:
        </p>

        <ul>
          <li>Most profitable setups</li>
          <li>Weak trading conditions</li>
          <li>Hidden patterns in your trades</li>
          <li>Similar winning examples</li>
          <li>Similar losing examples</li>
        </ul>

      </div>

    </div>

  )

}
