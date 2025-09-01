<div style={{
  maxWidth:800,
  margin:"30px auto",
  background:"#fff",
  borderRadius:10,
  padding:22,
  boxShadow:"0 4px 24px #00968822"
}}>
  <h2 style={{color:"#009688",textAlign:"center"}}>KP Chart Calculator</h2>
  // ...
  <button type="submit" style={{
    background:"#009688", color:"#fff", borderRadius:5, padding:"0 12px", fontWeight:700, border:"none"
  }}>Get Chart</button>
  <button type="button" onClick={handleCopy} style={{
    background:"#ff9800", color:"#fff", borderRadius:5, padding:"0 12px", fontWeight:700, border:"none"
  }}>Copy as CSV</button>
  // ...
  <table style={{
    width:"100%", background:"#f7f7fa", borderRadius:8, boxShadow:"0 2px 8px #00968811"
  }}>
    <thead>
      <tr>
        <th style={{color:"#009688"}}>Planet</th>
        // ...
      </tr>
    </thead>
    <tbody>
      {planets.map(planet => {
        const nak = getNakshatra(planet.degree);
        return (
          <tr key={planet.name}>
            <td style={{fontWeight:700,color:"#ff9800"}}>{planet.name}</td>
            <td style={{fontFamily:"monospace",color:"#009688"}}>{planet.degree.toFixed(4)}</td>
            // ...
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
