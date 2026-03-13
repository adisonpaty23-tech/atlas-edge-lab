import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {

  const [pair, setPair] = useState("")
  const [session, setSession] = useState("")

  async function saveTrade() {

    const { data, error } = await supabase
      .from("trades")
      .insert([
        {
          pair: pair,
          session: session
        }
      ])

    if(error){
      alert("Error saving trade")
      console.log(error)
    } else {
      alert("Trade saved!")
    }

  }

  return (
    <div style={{padding:"40px",fontFamily:"Arial"}}>

      <h1>Atlas Edge Lab</h1>

      <input
        placeholder="Pair"
        value={pair}
        onChange={(e)=>setPair(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Session"
        value={session}
        onChange={(e)=>setSession(e.target.value)}
      />

      <br/><br/>

      <button onClick={saveTrade}>
        Save Trade
      </button>

    </div>
  )
}
