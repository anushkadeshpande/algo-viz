import { useEffect, useRef, useState } from "react";
import { AlgorithmEvent, EventType, isSwapEvent, isClearEvent } from "../types/algorithmEvents";

/**
 * Custom hook to manage generic algorithm animation with pause/resume support
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
 * @param isPaused - External pause state from parent
 * @param onComplete - Callback when animation completes
 * @returns Array of all operation messages
 */
export const useAlgorithmAnimation = (
  arr: number[],
  algorithm: (arr: number[]) => Generator,
  eventArr: Array<ReturnType<typeof setTimeout>>,
  arrayRef: React.RefObject<HTMLDivElement>,
  isPaused = false,
  onComplete?: () => void
) => {
  // State: holds all operations performed during the animation
  const [operations, setOperations] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  
  // Ref to track all scheduled timeout handles created by the current animation
  const localTimeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const generatorRef = useRef<Generator | null>(null);
  const stepCounterRef = useRef(1);
  const previousEventRef = useRef<AlgorithmEvent | null>(null);
  const persistentHighlightsRef = useRef<Set<number>>(new Set()); // Track indices with persistent highlights
  const pausedRef = useRef(false);
  const isCompleteRef = useRef(false);
  const eventArrRef = useRef(eventArr);
  const arrayRefCurrent = useRef(arrayRef);
  const onCompleteRef = useRef(onComplete);
  const previousPausedRef = useRef(isPaused);

  // Keep refs in sync
  useEffect(() => {
    eventArrRef.current = eventArr;
    arrayRefCurrent.current = arrayRef;
    onCompleteRef.current = onComplete;
  }, [eventArr, arrayRef, onComplete]);

  useEffect(() => {
    isCompleteRef.current = isComplete;
  }, [isComplete]);

  // Handle pause/resume from parent
  useEffect(() => {
    const wasPaused = previousPausedRef.current;
    pausedRef.current = isPaused;
    previousPausedRef.current = isPaused;
    
    if (isPaused) {
      // Clear pending timeouts when paused
      localTimeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      localTimeoutsRef.current = [];
    } else if (wasPaused && !isPaused && generatorRef.current && !isCompleteRef.current) {
      // Resume: only if we were previously paused (not on initial mount)
      processNextStepInternal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused]);

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
    setIsComplete(false);
    isCompleteRef.current = false;
    stepCounterRef.current = 1;
    previousEventRef.current = null;
    persistentHighlightsRef.current.clear(); // Clear persistent highlights
    pausedRef.current = isPaused;
    
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

    // Create an instance of the generator function with a copy of the input array
    generatorRef.current = algorithm(arr.slice());

    // Auto-start the animation immediately
    setTimeout(() => {
      if (generatorRef.current && arrayRefCurrent.current.current) {
        processNextStepInternal();
      }
    }, 0);

    // --- CLEANUP FUNCTION ---
    // Cancels all pending timeouts to prevent memory leaks
    return () => {
      localTimeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      localTimeoutsRef.current = [];
      generatorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, arr, eventArr]);

  /**
   * Internal function to process next step (used by both auto-start and manual control)
   */
  const processNextStepInternal = () => {
    const currentArrayRef = arrayRefCurrent.current.current;
    if (!generatorRef.current || pausedRef.current || !currentArrayRef) return;

    const { done, value } = generatorRef.current.next();

    if (!done) {
      const event = value as AlgorithmEvent;
      const currentStep = stepCounterRef.current;

      // Handle CLEAR event - explicitly clear highlights
      if (isClearEvent(event)) {
        handleClearEvent(currentArrayRef, event, currentStep, persistentHighlightsRef.current, (msg: string) => {
          setOperations(prev => [...prev, msg]);
        });
      } else {
        // Clean up previous event visualization (skip persistent highlights)
        if (previousEventRef.current) {
          clearEventVisualization(currentArrayRef, previousEventRef.current, persistentHighlightsRef.current);
        }

        // Visualize the current event based on its type
        visualizeEvent(currentArrayRef, event, currentStep, persistentHighlightsRef.current, (msg: string) => {
          setOperations(prev => [...prev, msg]);
        });
      }

      // Store current event as previous for next iteration
      previousEventRef.current = event;
      stepCounterRef.current++;

      // Schedule the next step
      const timeoutId = setTimeout(() => {
        processNextStepInternal();
      }, 1000);

      eventArrRef.current.push(timeoutId);
      localTimeoutsRef.current.push(timeoutId);
    } else {
      // Generator is done
      if (previousEventRef.current && currentArrayRef) {
        clearEventVisualization(currentArrayRef, previousEventRef.current, persistentHighlightsRef.current);
      }

      setOperations(prev => [...prev, `✓ Visualization complete! Total steps: ${stepCounterRef.current - 1}`]);
      setIsComplete(true);
      isCompleteRef.current = true;
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }
  };

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
  persistentHighlights: Set<number>,
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
      handleHighlightEvent(container, event, stepNumber, persistentHighlights, setOperation);
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
  persistentHighlights: Set<number>,
  setOperation: (msg: string) => void
) => {
  const highlightEvent = event as { color?: string; persist?: boolean };
  const elements = event.indices.map(idx => container.children[idx] as HTMLElement);
  const color = highlightEvent.color || "rgb(34 197 94)"; // Default green
  
  setOperation(`Step ${stepNumber}: Highlighting indices ${event.indices.join(", ")}`);
  
  elements.forEach((elem, i) => {
    elem.style.backgroundColor = color;
    
    // Track persistent highlights
    if (highlightEvent.persist) {
      persistentHighlights.add(event.indices[i]);
    }
  });
};

/**
 * Handle CLEAR event: explicitly clear highlights
 */
const handleClearEvent = (
  container: HTMLDivElement,
  event: AlgorithmEvent,
  stepNumber: number,
  persistentHighlights: Set<number>,
  setOperation: (msg: string) => void
) => {
  if (event.indices.length === 0) {
    // Clear all highlights
    setOperation(`Step ${stepNumber}: Clearing all highlights`);
    persistentHighlights.forEach(idx => {
      const elem = container.children[idx] as HTMLElement;
      if (elem) {
        elem.style.backgroundColor = "transparent";
      }
    });
    persistentHighlights.clear();
  } else {
    // Clear specific indices
    setOperation(`Step ${stepNumber}: Clearing highlights at indices ${event.indices.join(", ")}`);
    event.indices.forEach(idx => {
      const elem = container.children[idx] as HTMLElement;
      if (elem) {
        elem.style.backgroundColor = "transparent";
      }
      persistentHighlights.delete(idx);
    });
  }
};

/**
 * Clear visualization from a previous event
 * Skips indices that have persistent highlights
 */
const clearEventVisualization = (
  container: HTMLDivElement,
  event: AlgorithmEvent,
  persistentHighlights: Set<number>
) => {
  event.indices.forEach(idx => {
    // Don't clear if this index has a persistent highlight
    if (!persistentHighlights.has(idx)) {
      const elem = container.children[idx] as HTMLElement;
      if (elem) {
        elem.style.backgroundColor = "transparent";
      }
    }
  });
};
