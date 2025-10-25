# Persistent Highlights Feature

## Overview
The animation system now supports **persistent highlights** that remain visible until explicitly cleared. This is useful for marking important elements (like pivots, sorted regions, etc.) that should stay highlighted across multiple steps.

## How It Works

### Regular Highlights (Auto-Clear)
By default, highlights are cleared before the next event is visualized:

```typescript
// This highlight will be cleared on the next step
yield {
  type: EventType.HIGHLIGHT,
  indices: [5],
  color: "rgb(34 197 94)" // Green (optional, defaults to green)
}
```

### Persistent Highlights (Manual Clear Required)
Add `persist: true` to keep the highlight until explicitly cleared:

```typescript
// This highlight will PERSIST until cleared
yield {
  type: EventType.HIGHLIGHT,
  indices: [high],
  color: "rgb(168 85 247)", // Purple
  persist: true  // ← Key flag!
}
```

### Clearing Highlights

#### Clear Specific Indices
```typescript
// Clear highlights at specific indices
yield {
  type: EventType.CLEAR,
  indices: [3, 5, 7]  // Clear only these indices
}
```

#### Clear All Highlights
```typescript
// Clear ALL persistent highlights
yield {
  type: EventType.CLEAR,
  indices: []  // Empty array = clear everything
}
```

## Example: Quick Sort with Pivot Highlighting

```typescript
function* quickSort(arr: Array<number>, low = 0, high = arr.length - 1): Generator<AlgorithmEvent> {
  if (low < high) {
    const pivot = arr[high];
    
    // Mark pivot with persistent purple highlight
    yield {
      type: EventType.HIGHLIGHT,
      indices: [high],
      color: "rgb(168 85 247)", // Purple
      persist: true  // Stays until cleared
    }

    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        
        // Regular swap (auto-cleared)
        yield {
          type: EventType.SWAP,
          indices: [i, j]
        }
      }
    }

    // Final swap of pivot
    [arr[i + 1], arr[high]] = [arr[high], arr[i+1]];
    yield {
      type: EventType.SWAP,
      indices: [i+1, high]
    }
    
    const pi = i + 1;
    
    // Clear the pivot highlight before recursing
    yield {
      type: EventType.CLEAR,
      indices: [high]
    }

    // Mark sorted position with persistent green
    yield {
      type: EventType.HIGHLIGHT,
      indices: [pi],
      color: "rgb(34 197 94)", // Green
      persist: true
    }

    yield * quickSort(arr, low, pi - 1);
    yield * quickSort(arr, pi + 1, high);
  }
}
```

## Event Types Reference

### HIGHLIGHT Event
```typescript
{
  type: EventType.HIGHLIGHT,
  indices: number[],        // Indices to highlight
  color?: string,           // RGB color (optional, defaults to green)
  persist?: boolean         // If true, keeps highlight until CLEAR event
}
```

### CLEAR Event
```typescript
{
  type: EventType.CLEAR,
  indices: number[]         // Indices to clear (empty array = clear all)
}
```

### Existing Events
- **SWAP**: Swaps two elements (auto-cleared)
- **COMPARE**: Highlights comparison (auto-cleared)

## Use Cases

1. **Pivot Markers**: Highlight pivot elements in quick sort
2. **Sorted Regions**: Mark already-sorted portions of the array
3. **Boundary Markers**: Show partition boundaries
4. **Special Elements**: Mark min/max elements during selection
5. **Search Targets**: Highlight target elements in search algorithms

## Color Suggestions

- **Green** `rgb(34 197 94)`: Sorted/final position
- **Purple** `rgb(168 85 247)`: Pivot/special element
- **Blue** `rgb(59 130 246)`: Current working range
- **Red** `rgb(239 68 68)`: Elements to avoid/boundaries
- **Amber** `rgb(251 191 36)`: Temporary markers

## Important Notes

1. **Persistent highlights are tracked per index**: Each index can only have one persistent highlight
2. **Restart clears all**: Restarting the animation clears all persistent highlights
3. **View change clears all**: Switching algorithms clears all persistent highlights
4. **No auto-clear on CLEAR events**: CLEAR events don't get cleared themselves (they don't have visual state)
5. **Performance**: Large numbers of persistent highlights are fine - tracked in a Set for O(1) operations
