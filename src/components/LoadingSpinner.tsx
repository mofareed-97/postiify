import { Loader2 } from "lucide-react";
import React from "react";

function LoadingSpinner({ big = false }: { big?: boolean }) {
  const sizeClasses = big ? "w-16 h-16" : "w-5 h-5";
  return (
    <div className="flex justify-center">
      <Loader2 className={`animate-spin ${sizeClasses}`} />
    </div>
  );
}

export default LoadingSpinner;
