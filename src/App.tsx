import SideBar from './components/SideBar'
import { useRef, useState } from 'react'
import MainContent from './components/MainContent'
// import Canvas from './Canvas'
// import Array from './components/NumberArray'

// const Array1 = Array({arr: [1, 2, 3, 4, 5, 100, 3, 4, 5, 1, 3]})

function App() {
  const [view, setView] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  // useEffect(() => {
  //   clearTimeout(event);
  // }, [view])
  const eventArrRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  // Keep a stable timeout registry so NumberArray can cancel prior animations when view changes.
  const eventArr = eventArrRef.current
  return (
    <div className='h-screen w-screen bg-gray-900 flex flex-col md:flex-row overflow-hidden'>
      {/* Mobile Menu Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className='md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-lg shadow-lg hover:bg-gray-700 transition-colors'
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <SideBar 
        view={view} 
        setView={setView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
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
