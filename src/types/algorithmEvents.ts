/**
 * Event types that can be emitted by algorithm generators
 * These define all possible operations that can be visualized on the array
 */

export enum EventType {
  SWAP = "swap",
  COMPARE = "compare",
  HIGHLIGHT = "highlight",
  MARK = "mark",
  ACCESS = "access",
  // Add more event types as needed for different algorithms
}

/**
 * Base interface for all algorithm events
 */
export interface AlgorithmEvent {
  type: EventType;
  indices: number[];
  values?: number[];
  metadata?: Record<string, unknown>;
}

/**
 * Specific event types for better type safety
 */
export interface SwapEvent extends AlgorithmEvent {
  type: EventType.SWAP;
  indices: [number, number]; // Exactly 2 indices for swap
}

export interface CompareEvent extends AlgorithmEvent {
  type: EventType.COMPARE;
  indices: number[]; // Can compare multiple elements
  result?: boolean; // Result of comparison
}

export interface HighlightEvent extends AlgorithmEvent {
  type: EventType.HIGHLIGHT;
  indices: number[];
  color?: string;
}

/**
 * Type guard to check if event is a swap event
 */
export const isSwapEvent = (event: AlgorithmEvent): event is SwapEvent => {
  return event.type === EventType.SWAP && event.indices.length === 2;
};

/**
 * Type guard to check if event is a compare event
 */
export const isCompareEvent = (event: AlgorithmEvent): event is CompareEvent => {
  return event.type === EventType.COMPARE;
};

/**
 * Type guard to check if event is a highlight event
 */
export const isHighlightEvent = (event: AlgorithmEvent): event is HighlightEvent => {
  return event.type === EventType.HIGHLIGHT;
};
