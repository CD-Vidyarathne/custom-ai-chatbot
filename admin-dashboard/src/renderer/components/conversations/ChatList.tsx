import React from "react";
import { Conversation } from "./types";

interface ChatListProps {
    chats: Conversation[];
    activeChatId: string;
    onSelectChat: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
    chats,
    activeChatId,
    onSelectChat,
}) => {
    return (
        <div className="bg-white h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`p-4 cursor-pointer flex items-center justify-between ${activeChatId === chat.id ? "bg-gray-100" : ""}`}
                        onClick={() => onSelectChat(chat.id)}
                    >
                        <div className="flex items-center">
                            <div>
                                <p
                                    className="font-bold text-sm"
                                    style={{
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    {chat.name}
                                </p>
                                <p
                                    className="text-xs font-semibold"
                                    style={{
                                        color:
                                            chat.status === "Active AI"
                                                ? "darkgreen"
                                                : chat.status ===
                                                    "Human Help Needed"
                                                  ? "orange"
                                                  : "var(--color-text-muted)",
                                    }}
                                >
                                    {chat.status}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">
                            {chat.timestamp}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
