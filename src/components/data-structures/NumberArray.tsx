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
 */
const NumberArray = ({
  arr,
  algorithm,
  eventArr
}: {
  arr: Array<number>;
  algorithm: (arr: number[]) => Generator;
  eventArr: Array<ReturnType<typeof setTimeout>>;
}) => {
  // State: holds the initial array for rendering
  const [array, setArray] = useState<number[]>(arr);
  
  // Ref to the container div holding all array elements
  // Used by the animation hook to manipulate DOM elements
  const arrayRef = useRef<HTMLDivElement>(null);
  
  // Custom hook: manages all animation logic based on events from the algorithm
  // Returns the current operation message to display
  const currentOperation = useAlgorithmAnimation(arr, algorithm, eventArr, arrayRef);
  
  // Update array state when input changes
  if (arr !== array) {
    setArray(arr);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Operation Log - Shows what's happening in real-time */}
      <OperationLog currentOperation={currentOperation} />

      {/* Array Visualization */}
      <div style={{ display: "flex" }} ref={arrayRef}>
        {/* 
          Render the array elements as visual boxes
          - The array state holds the original input values
          - During animation, we directly manipulate the DOM (innerText and backgroundColor)
          - This allows the generator to complete instantly,
            while the animation plays step-by-step by swapping DOM text content
        */}
        {array.map((element: number, idx: number) => (
          <div
            className="arrayElement font-bold"
            key={idx}
            style={{
              height: "50px",
              width: "50px",
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
  );
};

export default NumberArray;
