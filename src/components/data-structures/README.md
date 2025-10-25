# NumberArray - Generic Array Visualization Component

## Overview

`NumberArray` is the **main component** for visualizing array-based algorithms. It's designed to be generic and algorithm-agnostic, supporting:

- ✅ Sorting algorithms (Bubble Sort, Quick Sort, Merge Sort, etc.)
- ✅ Searching algorithms (Binary Search, Linear Search, etc.)  
- ✅ Any array-based algorithm that can yield visualization events

## Architecture

```
NumberArray (Main Component)
├── useAlgorithmAnimation (from src/hooks)
└── OperationLog (from src/components/common)
```

### Component Responsibilities

#### `NumberArray.tsx` - Main Component
- Entry point for all array visualizations
- Accepts any algorithm that yields `AlgorithmEvent` objects
- Renders array elements directly
- Orchestrates animation hook and operation log

#### `useAlgorithmAnimation.ts` - Generic Animation Hook (src/hooks)
- Processes events from any algorithm generator
- Schedules DOM manipulations based on event types
- Manages animation lifecycle and cleanup
- Reusable across different data structure visualizations

#### `OperationLog.tsx` - Operation Display (src/components/common)
- Shows real-time updates of what's happening
- Pure presentational component
- Reusable across different visualizations

## Event-Based System

### Event Types

All algorithms communicate through standardized events defined in `types/algorithmEvents.ts`:

```typescript
enum EventType {
  SWAP = "swap",        // Swap two elements
  COMPARE = "compare",  // Compare elements
  HIGHLIGHT = "highlight", // Highlight specific elements
  MARK = "mark",        // Mark elements with special meaning
  ACCESS = "access",    // Show array access
}
```

### Event Structure

```typescript
interface AlgorithmEvent {
  type: EventType;
  indices: number[];      // Which elements are involved
  values?: number[];      // Optional: the values
  metadata?: Record<string, unknown>; // Optional: additional data
}
```

### Example: Creating a New Algorithm

```typescript
import { AlgorithmEvent, EventType } from '../../types/algorithmEvents';

function* mySearchAlgorithm(arr: number[]): Generator<AlgorithmEvent> {
  for (let i = 0; i < arr.length; i++) {
    // Show we're accessing this element
    yield {
      type: EventType.ACCESS,
      indices: [i]
    };
    
    if (arr[i] === target) {
      // Highlight found element
      yield {
        type: EventType.HIGHLIGHT,
        indices: [i],
        color: "green"
      };
      return;
    }
  }
}
```

## Usage

```typescript
import NumberArray from './components/data-structures/NumberArray';

function MyComponent() {
  const eventArr = useRef<Array<ReturnType<typeof setTimeout>>>([]).current;
  
  return (
    <NumberArray 
      arr={[23, 7, 15, 92, 4, 68, 31, 55, 12, 89]}
      algorithm={myAlgorithm}  // Any algorithm that yields AlgorithmEvents
      eventArr={eventArr}      // For cleanup on unmount
    />
  );
}
```

## Extending the System

### Adding New Event Types

1. Add the event type to `EventType` enum in `types/algorithmEvents.ts`
2. Create a specific interface extending `AlgorithmEvent`
3. Add a type guard function
4. Implement visualization in `useAlgorithmAnimation.ts`

Example:

```typescript
// 1. Add to enum
export enum EventType {
  // ... existing types
  PARTITION = "partition",
}

// 2. Create interface
export interface PartitionEvent extends AlgorithmEvent {
  type: EventType.PARTITION;
  pivotIndex: number;
  partitionIndex: number;
}

// 3. Add type guard
export const isPartitionEvent = (event: AlgorithmEvent): event is PartitionEvent => {
  return event.type === EventType.PARTITION;
};

// 4. Handle in useAlgorithmAnimation.ts
case EventType.PARTITION:
  handlePartitionEvent(container, event, stepNumber, setOperation);
  break;
```

## File Structure

```
src/
├── components/
│   ├── common/
│   │   └── OperationLog.tsx             # Reusable operation display
│   └── data-structures/
│       └── NumberArray.tsx              # Main array visualization component
├── hooks/
│   └── useAlgorithmAnimation.ts         # Generic animation hook (reusable)
├── types/
│   └── algorithmEvents.ts               # Event type definitions
└── utils/
    └── algorithms/
        └── sorting/
            ├── bubbleSort.ts
            └── quickSort.ts
```

## Migration Guide

### Writing New Algorithms

All algorithms should use the event-based format:

```typescript
import { AlgorithmEvent, EventType } from '../../types/algorithmEvents';

function* newAlgorithm(arr: number[]): Generator<AlgorithmEvent> {
  // Yield events to visualize operations
  yield {
    type: EventType.SWAP,
    indices: [0, 1]
  };
}
```

## Benefits

✅ **Generic**: Works with any algorithm, not just sorting  
✅ **Extensible**: Easy to add new event types and visualizations  
✅ **Type-safe**: Full TypeScript support with proper types  
✅ **Maintainable**: Clear separation of concerns  
✅ **Reusable**: Components can be used independently  

## Future Enhancements

- [ ] Speed control (adjust animation interval)
- [ ] Pause/resume functionality
- [ ] Step-by-step mode (manual advancement)
- [ ] Different color schemes
- [ ] Multiple visualization modes (bars, circles, etc.)
- [ ] Performance metrics display
- [ ] Animation recording/replay
