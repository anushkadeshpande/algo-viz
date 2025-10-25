import { useEffect, useRef, useState } from "react";
import "./NumberArray.css";

const NumberArray = ({
  arr,
  algorithm,
  eventArr
}: {
  arr: Array<number>;
  algorithm: (arr: number[]) => Generator;
  eventArr: Array<ReturnType<typeof setTimeout>>;
}) => {
  // State: holds the initial unsorted array for rendering
  // This stays constant - we manipulate the DOM directly for animation
  const [array, setArray] = useState<number[]>(arr);
  
  // State: holds the current operation being displayed
  // Shows what swap is happening in real-time during the animation
  const [currentOperation, setCurrentOperation] = useState<string>("");
  
  // Ref to the container div holding all array elements
  // Used to access and manipulate individual element DOM nodes during animation
  const arrayRef = useRef<HTMLDivElement>(null);
  
  // Ref to track all scheduled timeout handles created by the current animation
  // Allows us to cancel them on cleanup to prevent memory leaks
  const localTimeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    // --- CLEANUP PHASE ---
    // Clear any existing timeouts from the shared eventArr (from previous algorithm runs)
    // This ensures old animations stop when the view/algorithm changes
    if (eventArr && eventArr.length > 0) {
      eventArr.forEach((timeoutId: ReturnType<typeof setTimeout>) => {
        clearTimeout(timeoutId);
      });
      // Empty the shared array so it doesn't hold stale handles
      eventArr.length = 0;
    }

    // Reset local timeout tracking for this effect run
    localTimeoutsRef.current = [];

    // Reset the array to the initial input values
    // This ensures we start fresh when arr or algorithm changes
    setArray(arr);
    
    // Reset operation log display
    setCurrentOperation("Starting animation...");

    // --- RESET DOM TO MATCH INITIAL ARRAY ---
    // When switching algorithms, the DOM has been manipulated by the previous animation
    // We need to reset the DOM elements to show the original unsorted array
    // This prevents the new algorithm from animating on top of already-sorted DOM elements
    if (arrayRef.current) {
      Array.from(arrayRef.current.children).forEach((child, idx) => {
        const elem = child as HTMLElement;
        // Reset text content to the original array value
        elem.innerText = String(arr[idx]);
        // Clear any background colors from previous animation
        elem.style.backgroundColor = "transparent";
      });
    }

    // --- ANIMATION SETUP ---
    // Create an instance of the generator function with a copy of the input array
    // The generator will yield each swap step during sorting
    const sorter = algorithm(arr.slice());

    // Counter to schedule each animation step 1 second apart
    let stepCounter = 1;
    
    // Array to track all swap operations for reverting previous highlights
    const swaps: number[][] = [];

    const iterateGenerator = (generator: Generator) => {
      // Proceed with the generator execution until the next yield
      // `done` tells us if the generator has finished; `value` holds the yielded data
      const { done, value } = generator.next();

      // If the generator is not done yet, process the current step
      if (!done) {
        // Destructure the values yielded by the algorithm
        // swap: the indices being swapped in this step
        const { swap }: { swap: number[] } =
          value as { swap: number[] };
        
        // Only animate if we have a valid swap (2 indices)
        if (swap.length > 1) {
          /* 
           * ANIMATION APPROACH:
           * 
           * The generator executes synchronously and yields all steps immediately.
           * The sorting completes instantly, but we want to visualize each step.
           * 
           * Solution: 
           * 1. Let the generator run completely and collect all swap operations
           * 2. Schedule DOM manipulation timeouts to display each swap sequentially
           * 3. Each timeout directly modifies the DOM (innerText and backgroundColor)
           *    to show the swap animation without triggering React re-renders
           * 
           * How it works:
           * 1. stepCounter tracks which animation frame we're scheduling (1st, 2nd, 3rd, etc.)
           * 2. Each setTimeout is scheduled for (stepCounter * 1000) ms in the future
           * 3. We increment stepCounter for each step, ensuring frames appear 1 second apart
           * 4. Inside each timeout:
           *    - Remove highlight from previous swap (if any)
           *    - Highlight current swap indices with colors
           *    - Swap the DOM text content to show the swap visually
           * 5. All timeout handles are stored in both eventArr (shared) and localTimeoutsRef (local)
           *    so they can be cancelled if the component unmounts or algorithm changes
           * 
           * Result: The entire sorting executes instantly, all swaps are recorded,
           * then the animation plays step-by-step showing each swap with 1s intervals.
           */
          const timeoutId = setTimeout(() => {
            // Check if the DOM ref is still valid (component not unmounted)
            if (!arrayRef.current) return;

            // Store current swap for tracking
            swaps.push(swap);
            
            // Get the actual values being swapped for display in the log
            const value0 = arrayRef.current.children[swap[0]].textContent || "";
            const value1 = arrayRef.current.children[swap[1]].textContent || "";
            
            // Update the operation log to show what's happening
            setCurrentOperation(`Step ${swaps.length}: Swapping ${value0} (index ${swap[0]}) with ${value1} (index ${swap[1]})`);
            
            // If this isn't the first swap, remove highlight from previous swap
            if (swaps.length > 1) {
              const previousSwap = swaps[swaps.length - 2];
              arrayRef.current.children[previousSwap[0]].setAttribute('style', 
                arrayRef.current.children[previousSwap[0]].getAttribute('style')?.replace(/background-color:[^;]+;?/, '') || ''
              );
              arrayRef.current.children[previousSwap[1]].setAttribute('style',
                arrayRef.current.children[previousSwap[1]].getAttribute('style')?.replace(/background-color:[^;]+;?/, '') || ''
              );
            }
            
            // Highlight the two elements being swapped
            // First index gets pink, second gets cyan
            const elem0 = arrayRef.current.children[swap[0]] as HTMLElement;
            const elem1 = arrayRef.current.children[swap[1]] as HTMLElement;
            
            elem0.style.backgroundColor = "rgb(244 114 182)"; // Pink
            elem1.style.backgroundColor = "rgb(34 211 238)"; // Cyan
            
            // Swap the text content in the DOM to show the swap visually
            [elem0.innerText, elem1.innerText] = [elem1.innerText, elem0.innerText];
          }, stepCounter * 1000);

          // Store the timeout ID in both the shared and local registries
          // so it can be cancelled during cleanup
          eventArr.push(timeoutId);
          localTimeoutsRef.current.push(timeoutId);

          // Increment the counter so the next step schedules 1 second later
          stepCounter++;

          // Recursively process the next step from the generator
          iterateGenerator(generator);
        }
      } else {
        // Generator is done; schedule a final timeout to clear highlights after the last step
        const finalTimeoutId = setTimeout(() => {
          if (!arrayRef.current) return;
          
          // Update operation log to show completion
          setCurrentOperation(`✓ Sorting complete! Total steps: ${swaps.length}`);
          
          // Clear highlights from the last swap
          if (swaps.length > 0) {
            const lastSwap = swaps[swaps.length - 1];
            const elem0 = arrayRef.current.children[lastSwap[0]] as HTMLElement;
            const elem1 = arrayRef.current.children[lastSwap[1]] as HTMLElement;
            elem0.style.backgroundColor = "transparent";
            elem1.style.backgroundColor = "transparent";
          }
        }, stepCounter * 1000);
        
        eventArr.push(finalTimeoutId);
        localTimeoutsRef.current.push(finalTimeoutId);
      }
    };

    // Start the recursive iteration through all generator steps
    // This runs synchronously and schedules all animations immediately
    iterateGenerator(sorter);

    // --- CLEANUP FUNCTION ---
    // Runs when the component unmounts or when dependencies (arr, algorithm) change
    // Cancels all pending timeouts to prevent memory leaks and stale DOM updates
    return () => {
      localTimeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      localTimeoutsRef.current = [];
    };
  }, [algorithm, arr, eventArr]); // Re-run effect when algorithm or input array changes

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Operation Log Display */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 min-w-[500px]">
        <div className="text-sm text-gray-400 mb-2">Current Operation:</div>
        <div className="text-white font-mono text-lg">
          {currentOperation || "Ready to start..."}
        </div>
      </div>

      {/* Array Visualization */}
      <div style={{ display: "flex" }} ref={arrayRef}>
        {/* 
          Render the initial unsorted array
          - The array state holds the original input values
          - During animation, we directly manipulate the DOM (innerText and backgroundColor)
          - This approach allows the generator to complete sorting instantly,
            while the animation plays step-by-step by swapping DOM text content
          
          Benefits of this approach:
          1. Generator runs to completion synchronously - all swaps are pre-calculated
          2. Animation is purely visual (DOM manipulation) and doesn't re-trigger React renders
          3. Works well for visualizing algorithms that need to show intermediate steps
        */}
        {array.map((element: number, idx: number) => {
          return (
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
                backgroundColor: "transparent", // Default color; changed via DOM manipulation during animation
                transition: "background-color 0.3s ease", // Smooth color transitions
              }}
            >
              {element}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NumberArray;
