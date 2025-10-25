/**
 * OperationLog Component
 * 
 * Displays the current operation happening during the sorting animation
 * Shows step-by-step information about what values are being swapped
 */

interface OperationLogProps {
  currentOperation: string;
}

const OperationLog = ({ currentOperation }: OperationLogProps) => {
  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 sm:p-4 w-full max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl">
      <div className="text-xs sm:text-sm text-gray-400 mb-2">Current Operation:</div>
      <div className="text-white font-mono text-sm sm:text-base md:text-lg break-words">
        {currentOperation || "Ready to start..."}
      </div>
    </div>
  );
};

export default OperationLog;
