"use client";
import { useState } from "react";
import InitialForm from "./InitialForm";
import Conversation from "./Conversation";

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "chat">("form");

  return (
    <div className="flex h-[550px] w-[380px] flex-col overflow-hidden rounded-2xl bg-(--color-bg-primary) shadow-2xl ring-1 ring-(--color-border) animate-in slide-in-from-bottom-5 duration-300">
      <header className="flex items-center justify-between bg-(--color-primary) p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-(--color-accent)/20" />
          <h3 className="text-sm font-semibold">Support Chat</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-white/10"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {step === "form" ? (
          <InitialForm onComplete={() => setStep("chat")} />
        ) : (
          <Conversation />
        )}
      </div>
    </div>
  );
}
