import * as React from "react";
import { X } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function Toast({ id, title, description, variant = "default" }: ToastProps) {
  const { dismiss } = useToast();

  return (
    <div 
      className={`
        relative w-full flex items-start space-x-4 rounded-md border p-4 shadow-lg 
        ${variant === "destructive" 
          ? "bg-red-500 text-white border-red-600" 
          : "bg-white border-gray-200"
        }
      `}
      role="alert"
    >
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        {description && <p className="text-sm mt-1">{description}</p>}
      </div>
      <button
        onClick={() => dismiss(id)}
        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
}
