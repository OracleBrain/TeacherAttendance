import * as React from "react";
import { useToast } from "../../hooks/use-toast";
import { Toast } from "./toast";

export function Toaster() {
  const { toasts } = useToast();
  
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 md:pb-8 md:pr-8 max-w-md w-full space-y-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}
