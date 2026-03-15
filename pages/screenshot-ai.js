import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function ScreenshotAI() {

const [chartLink, setChartLink] = useState("")
const [session, setSession] = useState("")
const [bias, setBias] = useState("")
const [retest, setRetest] = useState("")
const [entry, setEntry] = useState("")
const [momentum, setMomentum] = useState("")
const [structure, setStructure] = useState("")
const [zone, setZone] = useState("")
const [result, setResult] = useState("")

async function saveTrade(){

const edgeScore =
(session === "London" || session === "New York" ? 1 : 0) +
(bias === "Aligned" ? 1 : 0) +
(retest === "First" ? 1 : 0) +
(entry === "Clean" ? 1 : 0) +
(momentum === "Strong" ? 1 : 0) +
(structure === "Trending" ? 1 : 0) +
(zone === "High" ? 1 : 0)

const { error } = await supabase
.from("trades")
.insert([
{
chart_link: chartLink,
session: session,
bias_alignment: bias,
retest_state: retest,
entry_type: entry,
momentum_state: momentum,
structure_state: structure,
zone_clarity: zone,
result: result,
edge_score: edgeScore
}
])

if(error){
alert("Error saving trade")
}else{
alert("Trade saved with Edge Score: " + edgeScore)
}
}

return(

<div style={{padding:"40px", maxWidth:"700px", margin:"auto"}}>

<h1>Screenshot AI Trade Capture</h1>

<br/>

<input
placeholder="Paste TradingView Chart Link"
value={chartLink}
onChange={(e)=>setChartLink(e.target.value)}
style={{width:"100%", padding:"10px"}}
/>

<br/><br/>

<label>Session</label>

<select onChange={(e)=>setSession(e.target.value)}>
<option>Select Session</option>
<option>Asia</option>
<option>London</option>
<option>New York</option>
</select>

<br/><br/>

<label>Bias Alignment</label>

<select onChange={(e)=>setBias(e.target.value)}>
<option>Select Bias</option>
<option>Aligned</option>
<option>Against</option>
</select>

<br/><br/>

<label>Retest</label>

<select onChange={(e)=>setRetest(e.target.value)}>
<option>Select Retest</option>
<option>First</option>
<option>Second</option>
<option>None</option>
</select>

<br/><br/>

<label>Entry Quality</label>

<select onChange={(e)=>setEntry(e.target.value)}>
<option>Select Entry</option>
<option>Clean</option>
<option>Okay</option>
<option>Messy</option>
</select>

<br/><br/>

<label>Momentum</label>

<select onChange={(e)=>setMomentum(e.target.value)}>
<option>Select Momentum</option>
<option>Strong</option>
<option>Medium</option>
<option>Weak</option>
</select>

<br/><br/>

<label>Structure</label>

<select onChange={(e)=>setStructure(e.target.value)}>
<option>Select Structure</option>
<option>Trending</option>
<option>Range</option>
<option>Neutral</option>
</select>

<br/><br/>

<label>Zone Clarity</label>

<select onChange={(e)=>setZone(e.target.value)}>
<option>Select Zone</option>
<option>High</option>
<option>Medium</option>
<option>Low</option>
</select>

<br/><br/>

<label>Trade Result</label>

<select onChange={(e)=>setResult(e.target.value)}>
<option>Select Result</option>
<option>Win</option>
<option>Loss</option>
<option>BE</option>
</select>

<br/><br/><br/>

<button
onClick={saveTrade}
style={{
padding:"12px 30px",
background:"#111",
color:"#fff",
border:"none",
cursor:"pointer"
}}
>
Save Trade
</button>

</div>

)

}
