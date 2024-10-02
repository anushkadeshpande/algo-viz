const Array = ({arr} : {arr: Array<number>}) => {
  // let i = 0;
  return (
    <div style={{display: "flex"}}>
      {/* <h1>Hi</h1> */}
      {arr.map((element: number, idx: number) => 
        <div key={idx} style={{height: "40px", width: "40px", border: "1px solid black", display:"flex", justifyContent: "center", alignItems: "center"}}>{element}</div>
      )
      }
    </div>
  )
}

export default Array