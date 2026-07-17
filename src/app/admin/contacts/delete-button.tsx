"use client";

import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="flex items-center gap-2 text-sm px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
