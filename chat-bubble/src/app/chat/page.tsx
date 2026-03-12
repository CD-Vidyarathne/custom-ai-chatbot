"use client";
import { useState, useEffect } from "react";
import ChatBubble from "@/components/ChatBubble";
import ChatWindow from "@/components/ChatWindow";

export default function ChatPage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.parent.postMessage(
      {
        type: "SET_SIZE",
        state: isOpen ? "open" : "closed",
      },
      "*",
    );
  }, [isOpen]);

  return (
    <div className="flex h-full w-full flex-col items-end justify-end">
      {isOpen ? (
        <ChatWindow onClose={() => setIsOpen(false)} />
      ) : (
        <ChatBubble onClick={() => setIsOpen(true)} />
      )}
    </div>
  );
}
