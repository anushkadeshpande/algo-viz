import { AlgorithmEvent, EventType, HighlightEvent, ClearEvent } from "../../../types/algorithmEvents";

function* quickSort(arr: Array<number>, low = 0, high = arr.length - 1): Generator<AlgorithmEvent> {
  if (low < high) {
    const pivot = arr[high];

    // Highlight the pivot element (persistent purple highlight)
    yield {
      type: EventType.HIGHLIGHT,
      indices: [high],
      color: "rgb(168 85 247)", // Purple for pivot
      persist: true
    } as HighlightEvent;

    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield {
          type: EventType.SWAP,
          indices: [i, j]
        }
      }
    }

    // Place pivot in its final position
    [arr[i + 1], arr[high]] = [arr[high], arr[i+1]];
    yield {
      type: EventType.SWAP,
      indices: [i+1, high]
    }
    
    const pi = i + 1;

    // Clear the old pivot highlight from 'high' position
    yield {
      type: EventType.CLEAR,
      indices: [high]
    } as ClearEvent;

    // Mark the pivot's final sorted position with green
    yield {
      type: EventType.HIGHLIGHT,
      indices: [pi],
      color: "rgb(34 197 94)", // Green for sorted
      persist: true
    } as HighlightEvent;

    // Recursively sort left and right partitions
    yield * quickSort(arr, low, pi - 1);
    yield * quickSort(arr, pi + 1, high);
  }
}

export default quickSort;