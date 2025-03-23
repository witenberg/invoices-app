"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  message: string;
  confirmText: string;
  onConfirm: () => void;
  triggerText: string;
  triggerClassName?: string;
}

export function ConfirmationModal({
  message,
  confirmText,
  onConfirm,
  triggerText,
  triggerClassName = "text-blue-600 hover:text-blue-900"
}: ConfirmationModalProps) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={handleClick}
      >
        {triggerText}
      </button>

      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <div 
            className="relative bg-white p-6 rounded-lg shadow-lg w-96 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg mb-4">{message}</p>
            <div className="flex justify-end space-x-2">
              <Button 
                className="w-full bg-white-600 text-blue-600 border hover:text-blue-800 hover:bg-white" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  onConfirm();
                  setOpen(false);
                }}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}