"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
    message: string;
    confirmText: string;
    onConfirm: () => void;
    children: ReactNode;
}

export function ConfirmationModal({ message, confirmText, onConfirm, children }: ConfirmationModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div onClick={() => setOpen(true)}>{children}</div>

            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                     <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 z-50">
                        <p className="text-lg mb-4">{message}</p>
                        <div className="flex justify-end space-x-2">
                            <Button className="w-full bg-white-600 text-blue-600 border hover:text-blue-800 hover:bg-white" onClick={() => setOpen(false)}>
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
