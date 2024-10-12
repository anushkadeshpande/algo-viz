import './App.css'
import BubbleSort from './BubbleSort'
// import BubbleSort from './BubbleSort'
// import Canvas from './Canvas'
// import Array from './components/NumberArray'

// const Array1 = Array({arr: [1, 2, 3, 4, 5, 100, 3, 4, 5, 1, 3]})

function App() {
  return (
    <div>
    {/* <Array arr={[1, 2, 3, 4, 5, 100, 3, 4, 5, 1, 3]}/> */}
    {/* {bubbleSort()} */}
    <BubbleSort arr={[1, 2, 3, 4, 5, 100, 3, 4, 5, 1, 3]} />
    {/* <Canvas /> */}
    </div>
  )
}

export default App
