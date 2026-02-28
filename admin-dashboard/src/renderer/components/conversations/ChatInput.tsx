import React, { useState } from "react";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");
    const [isPaused, setIsPaused] = useState(false);

    const handleSend = () => {
        if (message.trim() && !isPaused) {
            onSendMessage(message);
            setMessage("");
        }
    };

    return (
        <div
            className="p-4 border-t bg-white"
            style={{ borderColor: "var(--color-border)" }}
        >
            <div className="flex items-center">
                <label className="mr-4">
                    <input
                        type="checkbox"
                        checked={isPaused}
                        onChange={() => setIsPaused(!isPaused)}
                    />
                    <span
                        className="ml-2"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Pause AI
                    </span>
                </label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isPaused}
                    className="flex-1 p-2 border rounded mr-4"
                    style={{ borderColor: "var(--color-border)" }}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={isPaused}
                >
                    Send
                </button>
            </div>
        </div>
    );
};
