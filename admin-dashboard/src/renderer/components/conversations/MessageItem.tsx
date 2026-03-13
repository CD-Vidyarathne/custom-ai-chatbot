import React from "react";
import { Message } from "./types";

interface MessageItemProps {
    message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const isUser = message.sender === "user";

    return (
        <div
            className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-xs p-3 rounded-lg ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
            >
                {message.content}
            </div>
        </div>
    );
};
