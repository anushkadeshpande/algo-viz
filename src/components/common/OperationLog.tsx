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
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 min-w-[500px]">
      <div className="text-sm text-gray-400 mb-2">Current Operation:</div>
      <div className="text-white font-mono text-lg">
        {currentOperation || "Ready to start..."}
      </div>
    </div>
  );
};

export default OperationLog;
