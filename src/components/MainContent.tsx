import { BUBBLE_SORT, QUICK_SORT } from '../utils/constants'
import bubbleSort from '../utils/algorithms/sorting/bubbleSort'
import NumberArray from './data-structures/NumberArray'
import quickSort from '../utils/algorithms/sorting/quickSort'

const MainContent = ({view, eventArr}: {view: string, eventArr: Array<ReturnType<typeof setTimeout>>}) => {
  console.log(view)
  return (
    <div className='text-white flex items-center justify-center flex-1 p-4 md:p-8 overflow-auto'>
      {
        view === BUBBLE_SORT ? (
          <NumberArray 
            arr={[23, 7, 15, 92, 4, 68, 31, 55, 12, 89]} 
            algorithm={bubbleSort} 
            eventArr={eventArr} 
          />
        ) : view === QUICK_SORT ? (
          <NumberArray 
            arr={[23, 7, 15, 92, 4, 68, 31, 55, 12, 89]} 
            algorithm={quickSort} 
            eventArr={eventArr} 
          />
        ) : (
          <div className="text-center text-gray-400">
            <h2 className="text-2xl mb-4">Welcome to Algorithm Visualizer</h2>
            <p className="text-lg">Select an algorithm from the menu to get started</p>
          </div>
        )
      }
    </div>
  )
}

export default MainContent