import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Custom hook for making elements resizable
 * 
 * @param initialSize - Initial size in pixels
 * @param minSize - Minimum size constraint in pixels
 * @param maxSize - Maximum size constraint in pixels
 * @param direction - Direction of resize: 'horizontal' (width) or 'vertical' (height)
 * @returns Object containing size, isResizing state, container ref, and resize handler
 */
export const useResizable = (
  initialSize: number,
  minSize = 100,
  maxSize = 600,
  direction: 'horizontal' | 'vertical' = 'vertical'
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const startPosRef = useRef<{ x: number; y: number; size: number }>({ x: 0, y: 0, size: initialSize });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    let delta: number;
    
    if (direction === 'vertical') {
      // For vertical resize (height), calculate change from start position
      delta = startPosRef.current.y - e.clientY;
    } else {
      // For horizontal resize (width), calculate change from start position
      delta = startPosRef.current.x - e.clientX;
    }
    
    const newSize = startPosRef.current.size + delta;
    
    // Constrain size between min and max
    const constrainedSize = Math.min(Math.max(newSize, minSize), maxSize);
    setSize(constrainedSize);
  }, [isResizing, direction, minSize, maxSize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = direction === 'vertical' ? 'ns-resize' : 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp, direction]);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      size: size
    };
    setIsResizing(true);
  }, [size]);

  return {
    size,
    isResizing,
    containerRef,
    startResize
  };
};
