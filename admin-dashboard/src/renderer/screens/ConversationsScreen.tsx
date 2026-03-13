import { ChatList } from "../components/conversations/ChatList";
import { ChatWindow } from "../components/conversations/ChatWindow";
import { Conversation, Message } from "../components/conversations/types";
import { generateChatTranscript } from "../components/utils/pdfGenerator";
import React, { useState } from "react";

export function ConversationsScreen() {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const conversations: Conversation[] = [
        {
            id: "1",
            name: "Guest 1024",
            avatar: "https://via.placeholder.com/40",
            status: "Active AI",
            timestamp: "12:30 PM",
        },
        {
            id: "2",
            name: "User 78",
            avatar: "https://via.placeholder.com/40",
            status: "Active AI",
            timestamp: "12:45 PM",
        },
    ];

    const handleSelectChat = (id: string) => {
        setActiveChatId(id);
        // Fetch messages for the selected chat (mocked for now)
        setMessages([
            { sender: "user", content: "Hello!" },
            { sender: "ai", content: "Hi there! How can I assist you today?" },
        ]);
    };

    return (
        <div className="h-full">
            <div className="mb-6">
                <h1
                    className="text-3xl font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                >
                    Conversations
                </h1>
                <p
                    className="text-sm mt-1"
                    style={{ color: "var(--color-text-muted)" }}
                >
                    View and manage all chatbot conversations
                </p>
            </div>

            <div className="h-full flex space-x-6">
                <div className="w-1/3 bg-white rounded-xl shadow-sm border border-(--color-border) flex flex-col">
                    <div className="p-4 border-b border-(--color-border)">
                        <h1 className="text-xl font-semibold text-(--color-text-primary)">
                            Conversations List
                        </h1>
                        <input
                            type="text"
                            placeholder="🔍 Search"
                            className="p-2 border rounded w-full text-sm mt-2"
                            style={{ borderColor: "var(--color-border)" }}
                        />
                    </div>
                    <ChatList
                        chats={conversations}
                        activeChatId={activeChatId || ""}
                        onSelectChat={handleSelectChat}
                    />
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-sm border border-(--color-border) flex flex-col">
                    <div className="p-4 border-b border-(--color-border) flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-(--color-text-primary)">
                                Live Chat Window
                            </h1>
                            <div className="flex items-center mt-2">
                                <img
                                    src={
                                        conversations.find(
                                            (chat) => chat.id === activeChatId
                                        )?.avatar || ""
                                    }
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full mr-3"
                                />
                                <span
                                    className="text-sm font-bold"
                                    style={{
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    {conversations.find(
                                        (chat) => chat.id === activeChatId
                                    )?.name ||
                                        "Select a conversation from the conversations list"}
                                </span>
                            </div>
                        </div>
                        <div
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-2xl cursor-pointer hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                            style={{
                                color: "var(--color-text-muted)",
                                marginTop: "auto",
                            }}
                            title="More options"
                        >
                            &#8942;
                        </div>

                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsMenuOpen(false)}
                                ></div>

                                <div
                                    className="absolute right-10 mt-12 w-48 bg-white rounded-md shadow-lg border z-20 overflow-hidden"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}
                                >
                                    <button
                                        disabled={!activeChatId}
                                        onClick={() => {
                                            const activeChat =
                                                conversations.find(
                                                    (c) => c.id === activeChatId
                                                );
                                            if (!activeChat) return;

                                            generateChatTranscript(
                                                activeChat.name,
                                                messages
                                            );
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                                        style={{
                                            color: "var(--color-text-primary)",
                                        }}
                                    >
                                        <span>📥</span>
                                        <span>Download Transcript</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    <ChatWindow messages={messages} />
                </div>
            </div>
        </div>
    );
}
