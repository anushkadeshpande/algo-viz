import SideBar from './components/SideBar'
import { useRef, useState } from 'react'
import MainContent from './components/MainContent'
// import Canvas from './Canvas'
// import Array from './components/NumberArray'

// const Array1 = Array({arr: [1, 2, 3, 4, 5, 100, 3, 4, 5, 1, 3]})

function App() {
  const [view, setView] = useState("")
  // useEffect(() => {
  //   clearTimeout(event);
  // }, [view])
  const eventArrRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  // Keep a stable timeout registry so NumberArray can cancel prior animations when view changes.
  const eventArr = eventArrRef.current
  return (
    <div className='h-screen w-screen bg-gray-900 flex'>

      <SideBar view = {view} setView = {setView}/>
      <MainContent view = {view} eventArr={eventArr}/>
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
