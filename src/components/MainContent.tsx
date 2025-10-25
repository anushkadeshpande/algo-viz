import React, { useEffect } from 'react'
import { BUBBLE_SORT, QUICK_SORT } from '../utils/constants'
import bubbleSort from '../utils/algorithms/sorting/bubbleSort'
import NumberArray from './data-structures/NumberArray'
import quickSort from '../utils/algorithms/sorting/quickSort'

const MainContent = ({view, setView, eventArr}: any) => {
  console.log(view)
  // useEffect(() => {
  //   // eventArr = []
  //   eventArr.forEach((e: any) => {
  //     clearTimeout(e)
  //   });
  //   // console.log(eventArr)
  // }, [view]) 
  return (
    <div className='text-white flex items-center justify-center m-auto'>
      
      {/* <canvas> */}
        {
          view === BUBBLE_SORT? <NumberArray arr={[23, 7, 15, 92, 4, 68, 31, 55, 12, 89]} algorithm={bubbleSort} eventArr={eventArr} /> : view === QUICK_SORT? <NumberArray arr={[23, 7, 15, 92, 4, 68, 31, 55, 12, 89]} algorithm={quickSort} eventArr={eventArr} /> : ""
        }
      {/* </canvas> */}
    </div>
  )
}

export default MainContent