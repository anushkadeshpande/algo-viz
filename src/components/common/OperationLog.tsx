import { useEffect, useRef } from "react";
import { useResizable } from "../../hooks/useResizable";

/**
 * OperationLog Component
 * 
 * Displays all operations happening during the algorithm animation
 * Shows step-by-step history of what actions have been taken
 * Auto-scrolls to show the latest operation
 * Resizable - users can drag the top border to adjust height
 */

interface OperationLogProps {
  operations: string[];
}

const OperationLog = ({ operations }: OperationLogProps) => {
  const logEndRef = useRef<HTMLDivElement>(null);
  const { size: height, containerRef, startResize } = useResizable(256, 100, 600, 'vertical');

  // Auto-scroll to the bottom when new operations are added
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [operations]);

  return (
    <div 
      ref={containerRef}
      className="bg-gray-800 w-full flex flex-col relative"
      style={{ height: `${height}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-yellow-500 transition-colors z-10 group"
        onMouseDown={startResize}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            Drag to resize
          </div>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-gray-400 px-4 py-3 flex justify-between items-center border-b border-gray-700">
        <span className="font-semibold">Operation Log</span>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
          {operations.length} step{operations.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {operations.length === 0 ? (
          <div className="text-gray-500 font-mono text-sm">Ready to start...</div>
        ) : (
          <div className="space-y-1">
            {operations.map((operation, index) => (
              <div
                key={index}
                className={`text-white font-mono text-xs sm:text-sm break-words py-1.5 px-3 rounded transition-colors ${
                  index === operations.length - 1 
                    ? 'bg-gray-700 border-l-4 border-yellow-500 font-semibold' 
                    : 'hover:bg-gray-700'
                }`}
              >
                {operation}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationLog;
