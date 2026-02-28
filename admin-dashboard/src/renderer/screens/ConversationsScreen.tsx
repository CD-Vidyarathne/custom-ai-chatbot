import { ChatList } from "../components/conversations/ChatList";
import { ChatWindow } from "../components/conversations/ChatWindow";
import { ChatInput } from "../components/conversations/ChatInput";
import { InsightPanel } from "../components/conversations/InsightPanel";
import { Conversation, Message } from "../components/conversations/types";
import React, { useState } from "react";

export function ConversationsScreen() {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

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
            status: "Human Help Needed",
            timestamp: "12:45 PM",
        },
    ];

    const customerDetails = {
        ipLocation: "127.0.0.1",
        currentPage: "http://example.com",
    };

    const handleSelectChat = (id: string) => {
        setActiveChatId(id);
        // Fetch messages for the selected chat (mocked for now)
        setMessages([
            { sender: "user", content: "Hello!" },
            { sender: "ai", content: "Hi there! How can I assist you today?" },
        ]);
    };

    const handleSendMessage = (message: string) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "user", content: message },
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

            {/* <div
                className="bg-white rounded-xl p-6 shadow-sm border"
                style={{ borderColor: 'var(--color-border)' }}
            >
                <div
                    className="text-center py-12"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    <p>No conversations yet</p>
                </div>
            </div> */}

            <div className="h-full flex space-x-6">
                {/* Left Pane: Conversation List */}
                <div className="w-1/4 bg-white rounded-xl shadow-sm border border-(--color-border) flex flex-col">
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

                {/* Middle Pane: Chat Window */}
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
                                            (chat) => chat.id === activeChatId,
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
                                        (chat) => chat.id === activeChatId,
                                    )?.name || "Select a conversation"}
                                </span>
                            </div>
                        </div>
                        <div
                            className="text-2xl cursor-pointer hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                            style={{
                                color: "var(--color-text-muted)",
                                marginTop: "auto",
                            }}
                            title="More options"
                        >
                            &#8942;
                        </div>
                    </div>
                    <ChatWindow messages={messages} />
                    <div className="mt-auto border-t border-(--color-border) p-4">
                        <label className="flex items-center mb-4">
                            <button
                                className="bg-gray-200 rounded-full w-12 h-6 flex items-center focus:outline-none"
                                onClick={() => {
                                    /* toggle functionality */
                                }}
                            >
                                <span className="w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300"></span>
                            </button>
                            <span className="ml-2 text-sm text-(--color-text-primary)">
                                Pause AI
                            </span>
                        </label>
                        <textarea
                            placeholder="Human reply..."
                            className="w-full p-2 border rounded text-sm"
                            style={{ borderColor: "var(--color-border)" }}
                        ></textarea>
                    </div>
                </div>

                {/* Right Pane: Context & Insights */}
                <div className="w-1/4 bg-white rounded-xl shadow-sm border border-(--color-border) flex flex-col">
                    <InsightPanel
                        confidenceScore={85}
                        customerDetails={customerDetails}
                    />
                </div>
            </div>
        </div>
    );
}
