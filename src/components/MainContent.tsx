import { BUBBLE_SORT, QUICK_SORT } from '../utils/constants'
import bubbleSort from '../utils/algorithms/sorting/bubbleSort'
import NumberArray from './data-structures/NumberArray'
import quickSort from '../utils/algorithms/sorting/quickSort'
import { useState, useEffect } from 'react'

// Constant array - prevents recreation on every render
const DEMO_ARRAY = [23, 7, 15, 92, 4, 68, 31, 55, 12, 89];

const MainContent = ({view, eventArr}: {view: string, eventArr: Array<ReturnType<typeof setTimeout>>}) => {
  console.log(view)
  
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  // Reset state when view changes
  useEffect(() => {
    setIsPaused(false);
    setIsComplete(false);
    setRestartKey(prev => prev + 1);
  }, [view]);

  const handlePlay = () => {
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleRestart = () => {
    setIsPaused(false);
    setIsComplete(false);
    setRestartKey(prev => prev + 1); // Changing key will force remount
  };

  return (
    <div className='text-white flex flex-col flex-1 overflow-hidden relative'>
      {/* Control Buttons - Only show when an algorithm is selected */}
      {view && view !== '' && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center gap-3 py-4 px-4 border-b border-gray-700 bg-gray-900 md:relative md:z-10">
          {isPaused && !isComplete && (
            <button
              onClick={handlePlay}
              className="px-4 py-2 sm:px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Resume
            </button>
          )}
          
          {!isPaused && !isComplete && (
            <button
              onClick={handlePause}
              className="px-4 py-2 sm:px-6 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
              </svg>
              Pause
            </button>
          )}
          
          <button
            onClick={handleRestart}
            className="px-4 py-2 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restart
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className={`flex-1 overflow-hidden ${view && view !== '' ? 'pt-20 md:pt-0' : ''}`}>
        {
          view === BUBBLE_SORT ? (
            <NumberArray 
              key={restartKey}
              arr={DEMO_ARRAY} 
              algorithm={bubbleSort} 
              eventArr={eventArr}
              isPaused={isPaused}
              onComplete={() => setIsComplete(true)}
            />
          ) : view === QUICK_SORT ? (
            <NumberArray 
              key={restartKey}
              arr={DEMO_ARRAY} 
              algorithm={quickSort} 
              eventArr={eventArr}
              isPaused={isPaused}
              onComplete={() => setIsComplete(true)}
            />
          ) : (
            <div className="text-center text-gray-400 flex items-center justify-center h-full">
              <div>
                <h2 className="text-2xl mb-4">Welcome to Algorithm Visualizer</h2>
                <p className="text-lg">Select an algorithm from the menu to get started</p>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default MainContent