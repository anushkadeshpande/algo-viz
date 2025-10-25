import { useEffect, useRef, useState } from "react";
import { AlgorithmEvent, EventType, isSwapEvent } from "../types/algorithmEvents";

/**
 * Custom hook to manage generic algorithm animation
 * 
 * This hook is designed to be algorithm-agnostic and can handle:
 * - Sorting algorithms (swap, compare events)
 * - Searching algorithms (highlight, access events)
 * - Any algorithm that yields visualization events
 * 
 * @param arr - The initial array to visualize
 * @param algorithm - Generator function that yields AlgorithmEvent objects
 * @param eventArr - Shared array to track all timeout handles
 * @param arrayRef - Reference to the DOM container holding array elements
 * @returns Array of all operation messages
 */
export const useAlgorithmAnimation = (
  arr: number[],
  algorithm: (arr: number[]) => Generator,
  eventArr: Array<ReturnType<typeof setTimeout>>,
  arrayRef: React.RefObject<HTMLDivElement>
) => {
  // State: holds all operations performed during the animation
  const [operations, setOperations] = useState<string[]>([]);
  
  // Ref to track all scheduled timeout handles created by the current animation
  const localTimeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    // --- CLEANUP PHASE ---
    // Clear any existing timeouts from previous algorithm runs
    if (eventArr && eventArr.length > 0) {
      eventArr.forEach((timeoutId: ReturnType<typeof setTimeout>) => {
        clearTimeout(timeoutId);
      });
      eventArr.length = 0;
    }

    // Reset local timeout tracking
    localTimeoutsRef.current = [];
    
    // Reset operation log display
    setOperations(["Starting visualization..."]);

    // --- RESET DOM TO MATCH INITIAL ARRAY ---
    // Reset all DOM elements to their original state
    if (arrayRef.current) {
      Array.from(arrayRef.current.children).forEach((child, idx) => {
        const elem = child as HTMLElement;
        elem.innerText = String(arr[idx]);
        elem.style.backgroundColor = "transparent";
      });
    }

    // --- ANIMATION SETUP ---
    // Create an instance of the generator function with a copy of the input array
    const algorithmGenerator = algorithm(arr.slice());

    // Counter to schedule each animation step 1 second apart
    let stepCounter = 1;
    
    // Track previous event for cleanup
    let previousEvent: AlgorithmEvent | null = null;

    /**
     * Recursively iterate through all generator steps
     * Each step yields an AlgorithmEvent that defines what to visualize
     */
    const iterateGenerator = (generator: Generator) => {
      const { done, value } = generator.next();

      if (!done) {
        const event = value as AlgorithmEvent;
        const currentStep = stepCounter; // Capture the current step number
        
        // Schedule the visualization of this event
        const timeoutId = setTimeout(() => {
          if (!arrayRef.current) return;

          // Clean up previous event visualization
          if (previousEvent) {
            clearEventVisualization(arrayRef.current, previousEvent);
          }

          // Visualize the current event based on its type
          visualizeEvent(arrayRef.current, event, currentStep, (msg: string) => {
            setOperations(prev => [...prev, msg]);
          });
          
          // Store current event as previous for next iteration
          previousEvent = event;
        }, currentStep * 1000);

        eventArr.push(timeoutId);
        localTimeoutsRef.current.push(timeoutId);
        stepCounter++;
        
        // Recursively process the next step
        iterateGenerator(generator);
      } else {
        // Generator is done; schedule a final cleanup
        const finalTimeoutId = setTimeout(() => {
          if (!arrayRef.current) return;
          
          if (previousEvent) {
            clearEventVisualization(arrayRef.current, previousEvent);
          }
          
          setOperations(prev => [...prev, `✓ Visualization complete! Total steps: ${stepCounter - 1}`]);
        }, stepCounter * 1000);
        
        eventArr.push(finalTimeoutId);
        localTimeoutsRef.current.push(finalTimeoutId);
      }
    };

    // Start the recursive iteration
    iterateGenerator(algorithmGenerator);

    // --- CLEANUP FUNCTION ---
    // Cancels all pending timeouts to prevent memory leaks
    return () => {
      localTimeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      localTimeoutsRef.current = [];
    };
  }, [algorithm, arr, eventArr, arrayRef]);

  return operations;
};

/**
 * Visualize an event by manipulating the DOM
 * This is the core function that handles different event types
 */
const visualizeEvent = (
  container: HTMLDivElement,
  event: AlgorithmEvent,
  stepNumber: number,
  setOperation: (msg: string) => void
) => {
  switch (event.type) {
    case EventType.SWAP:
      if (isSwapEvent(event)) {
        handleSwapEvent(container, event, stepNumber, setOperation);
      }
      break;
    
    case EventType.COMPARE:
      handleCompareEvent(container, event, stepNumber, setOperation);
      break;
    
    case EventType.HIGHLIGHT:
      handleHighlightEvent(container, event, stepNumber, setOperation);
      break;
    
    default:
      console.warn(`Unknown event type: ${event.type}`);
  }
};

/**
 * Handle SWAP event: swap values and highlight
 */
const handleSwapEvent = (
  container: HTMLDivElement,
  event: AlgorithmEvent,
  stepNumber: number,
  setOperation: (msg: string) => void
) => {
  const [idx0, idx1] = event.indices;
  const elem0 = container.children[idx0] as HTMLElement;
  const elem1 = container.children[idx1] as HTMLElement;
  
  const value0 = elem0.textContent || "";
  const value1 = elem1.textContent || "";
  
  // Update operation log
  setOperation(`Step ${stepNumber}: Swapping ${value0} (index ${idx0}) with ${value1} (index ${idx1})`);
  
  // Highlight elements
  elem0.style.backgroundColor = "rgb(244 114 182)"; // Pink
  elem1.style.backgroundColor = "rgb(34 211 238)"; // Cyan
  
  // Swap text content
  [elem0.innerText, elem1.innerText] = [elem1.innerText, elem0.innerText];
};

/**
 * Handle COMPARE event: highlight elements being compared
 */
const handleCompareEvent = (
  container: HTMLDivElement,
  event: AlgorithmEvent,
  stepNumber: number,
  setOperation: (msg: string) => void
) => {
  const elements = event.indices.map(idx => container.children[idx] as HTMLElement);
  const values = elements.map(el => el.textContent || "");
  
  setOperation(`Step ${stepNumber}: Comparing ${values.join(" vs ")}`);
  
  // Highlight compared elements
  elements.forEach(elem => {
    elem.style.backgroundColor = "rgb(251 191 36)"; // Amber
  });
};

/**
 * Handle HIGHLIGHT event: highlight specific elements
 */
const handleHighlightEvent = (
  container: HTMLDivElement,
  event: AlgorithmEvent,
  stepNumber: number,
  setOperation: (msg: string) => void
) => {
  const elements = event.indices.map(idx => container.children[idx] as HTMLElement);
  const color = (event as { color?: string }).color || "rgb(34 197 94)"; // Default green
  
  setOperation(`Step ${stepNumber}: Highlighting indices ${event.indices.join(", ")}`);
  
  elements.forEach(elem => {
    elem.style.backgroundColor = color;
  });
};

/**
 * Clear visualization from a previous event
 */
const clearEventVisualization = (
  container: HTMLDivElement,
  event: AlgorithmEvent
) => {
  event.indices.forEach(idx => {
    const elem = container.children[idx] as HTMLElement;
    if (elem) {
      elem.style.backgroundColor = "transparent";
    }
  });
};
