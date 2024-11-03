import SideBar from './components/SideBar'
import BubbleSort from './BubbleSort'
import { useState } from 'react'
import MainContent from './components/MainContent'
// import Canvas from './Canvas'
// import Array from './components/NumberArray'

// const Array1 = Array({arr: [1, 2, 3, 4, 5, 100, 3, 4, 5, 1, 3]})

function App() {
  const [view, setView] = useState("")
  return (
    <div className='h-screen w-screen bg-gray-900 flex'>

      <SideBar view = {view} setView = {setView}/>
      <MainContent view = {view} setView = {setView}/>
    {/* <Array arr={[1, 2, 3, 4, 5, 100, 3, 4, 5, 1, 3]}/> */}
    {/* {bubbleSort()} */}
    {/* <BubbleSort arr={[1, 2, 3, 4, 5, 100, 3, 4, 5, 1, 3]} /> */}
    {/* <Canvas /> */}
    {/* Header */}
    {/* Body */}
      {/* SidNav */}
      {/* MainArea */}
    {/* Footer */}
    
    </div>
  )
}

export default App
