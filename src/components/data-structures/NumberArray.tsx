import { useRef, useState } from "react";
import "./NumberArray.css";
import { useAlgorithmAnimation } from "../../hooks/useAlgorithmAnimation";
import OperationLog from "../common/OperationLog";

/**
 * NumberArray Component
 * 
 * MAIN COMPONENT for array visualization
 * 
 * This is a generic, algorithm-agnostic component that can visualize:
 * - Sorting algorithms (Bubble Sort, Quick Sort, Merge Sort, etc.)
 * - Searching algorithms (Binary Search, Linear Search, etc.)
 * - Any array-based algorithm that yields visualization events
 * 
 * The component works with any generator function that yields AlgorithmEvent objects.
 * Each event describes what operation to visualize (swap, compare, highlight, etc.)
 * 
 * Architecture:
 * - useAlgorithmAnimation: Generic hook that processes events from any algorithm
 * - OperationLog: Displays current operation message
 * 
 * @param arr - The initial array of numbers to visualize
 * @param algorithm - Generator function that yields AlgorithmEvent objects
 * @param eventArr - Shared timeout registry for cleanup across view changes
 * @param onControlsReady - Callback to pass control functions to parent
 */
const NumberArray = ({
  arr,
  algorithm,
  eventArr,
  isPaused,
  onComplete
}: {
  arr: Array<number>;
  algorithm: (arr: number[]) => Generator;
  eventArr: Array<ReturnType<typeof setTimeout>>;
  isPaused?: boolean;
  onComplete?: () => void;
}) => {
  // State: holds the initial array for rendering
  const [array, setArray] = useState<number[]>(arr);
  
  // Ref to the container div holding all array elements
  // Used by the animation hook to manipulate DOM elements
  const arrayRef = useRef<HTMLDivElement>(null);
  
  // Custom hook: manages all animation logic based on events from the algorithm
  // Returns operations array and control functions
  const operations = useAlgorithmAnimation(arr, algorithm, eventArr, arrayRef, isPaused, onComplete);
  
  // Update array state when input changes
  if (arr !== array) {
    setArray(arr);
  }

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto">
      {/* Array Visualization - Top Section */}
      <div className="flex-1 flex items-center justify-center overflow-auto py-8">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-0" ref={arrayRef}>
          {/* 
            Render the array elements as visual boxes
            - The array state holds the original input values
            - During animation, we directly manipulate the DOM (innerText and backgroundColor)
            - This allows the generator to complete instantly,
              while the animation plays step-by-step by swapping DOM text content
          */}
          {array.map((element: number, idx: number) => (
            <div
              className="arrayElement font-bold text-xs sm:text-sm md:text-base"
              key={idx}
              style={{
                height: "40px",
                width: "40px",
                border: "2px solid #fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
                transition: "background-color 0.3s ease",
              }}
            >
              {element}
            </div>
          ))}
        </div>
      </div>

      {/* Operation Log - Bottom Section */}
      <div className="border-t border-gray-700">
        <OperationLog operations={operations} />
      </div>
    </div>
  );
};

export default NumberArray;
