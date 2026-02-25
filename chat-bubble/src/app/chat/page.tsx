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
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-4 p-2">
      {isOpen ? (
        <ChatWindow onClose={() => setIsOpen(false)} />
      ) : (
        <ChatBubble onClick={() => setIsOpen(true)} />
      )}
    </div>
  );
}
