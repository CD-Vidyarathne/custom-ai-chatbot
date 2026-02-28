import React, { useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";
import { Message } from "./types";

interface ChatWindowProps {
    messages: Message[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop =
                chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            className="flex-1 bg-white flex flex-col"
            style={{ borderColor: "var(--color-border)" }}
        >
            <div ref={chatWindowRef} className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        No conversations selected yet
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <MessageItem key={index} message={message} />
                    ))
                )}
            </div>
            <div className="text-(--color-text-muted) cursor-pointer">
                <span className="vertical-dots">...</span>
                {/* Options menu logic */}
            </div>
        </div>
    );
};
