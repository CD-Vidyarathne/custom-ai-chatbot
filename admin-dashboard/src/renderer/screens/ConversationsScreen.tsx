import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ChatList } from '../components/conversations/ChatList';
import { ChatWindow } from '../components/conversations/ChatWindow';
import { Conversation, Message } from '../components/conversations/types';
import { generateChatTranscript } from '../components/utils/pdfGenerator';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import {
    getConsumerMessages,
    getConversationMessages,
    getAdminConversations,
    type ConversationMessage,
    type ConversationSummary,
} from '../api/client';

export function ConversationsScreen() {
    const location = useLocation() as {
        state?: { consumerId?: string; sessionId?: string; consumerName?: string };
    };
    const [searchParams] = useSearchParams();
    const sessionFromQuery = searchParams.get('session');
    const consumerFromQuery = searchParams.get('consumer');
    const sessionFromState = location.state?.sessionId;
    const consumerFromState = location.state?.consumerId;

    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [messagesError, setMessagesError] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [conversationsError, setConversationsError] = useState<string | null>(
        null
    );
    const [searchQuery, setSearchQuery] = useState('');

    const mapMessagesToUi = useCallback(
        (rows: ConversationMessage[]): Message[] =>
            rows.map((m) => ({
                sender: m.msg_source === 'user' ? 'user' : 'ai',
                content: m.content,
            })),
        []
    );

    const loadRecentConversations = useCallback(async () => {
        setLoadingConversations(true);
        setConversationsError(null);
        const result = await getAdminConversations();
        setLoadingConversations(false);
        if ('error' in result) {
            setConversations([]);
            setConversationsError(
                result.status === 401
                    ? 'Please sign in to view conversations.'
                    : result.error
            );
            return;
        }

        const convs = result.data.conversations;

        const list: Conversation[] = convs.map(
            (conv) => ({
                id: conv.session_id,
                name: `Session ${conv.session_id.slice(0, 8)}`,
                avatar: 'https://via.placeholder.com/40',
                status: conv.last_message 
                    ? conv.last_message.substring(0, 40) + (conv.last_message.length > 40 ? '...' : '') 
                    : (conv.status === 'active' ? 'Active AI' : 'Closed'),
                timestamp: conv.last_activity_at
                    ? new Date(conv.last_activity_at).toLocaleString()
                    : new Date(conv.updated_at).toLocaleString(),
            })
        );

        setConversations(list);
    }, []);

    const fetchMessagesForSession = useCallback(
        async (sessionId: string) => {
            if (!sessionId) return;
            setLoadingMessages(true);
            setMessagesError(null);
            const result = await getConversationMessages(sessionId);
            setLoadingMessages(false);
            if ('error' in result) {
                setMessages([]);
                setMessagesError(
                    result.status === 404 ? 'Conversation not found.' : result.error
                );
                return;
            }
            const uiMessages = mapMessagesToUi(result.data.messages);
            setMessages(uiMessages);

            const lastCreatedAt =
                result.data.messages[result.data.messages.length - 1]?.created_at;
            setConversations((prev) => {
                const exists = prev.some((c) => c.id === sessionId);
                const timestamp =
                    lastCreatedAt && !Number.isNaN(Date.parse(lastCreatedAt))
                        ? new Date(lastCreatedAt).toLocaleTimeString()
                        : new Date().toLocaleTimeString();
                if (!exists) {
                    return [
                        {
                            id: sessionId,
                            name: `Conversation ${sessionId.slice(0, 8)}`,
                            avatar: 'https://via.placeholder.com/40',
                            status: 'Active AI',
                            timestamp,
                        },
                        ...prev,
                    ];
                }
                return prev.map((c) => (c.id === sessionId ? { ...c, timestamp } : c));
            });
        },
        [mapMessagesToUi]
    );

    const fetchMessagesForConsumer = useCallback(
        async (consumerId: string, displayName?: string) => {
            if (!consumerId) return;
            setLoadingMessages(true);
            setMessagesError(null);
            const result = await getConsumerMessages(consumerId);
            setLoadingMessages(false);
            if ('error' in result) {
                setMessages([]);
                setMessagesError(
                    result.status === 404
                        ? 'Messages not found for this consumer.'
                        : result.error
                );
                return;
            }

            const uiMessages = mapMessagesToUi(result.data.messages);
            setMessages(uiMessages);

            if (uiMessages.length > 0) {
                const last = result.data.messages[result.data.messages.length - 1];
                const timestamp =
                    last.created_at && !Number.isNaN(Date.parse(last.created_at))
                        ? new Date(last.created_at).toLocaleTimeString()
                        : new Date().toLocaleTimeString();
                setConversations([
                    {
                        id: consumerId,
                        name:
                            displayName && displayName.trim().length > 0
                                ? displayName
                                : `Consumer ${consumerId.slice(0, 8)}`,
                        avatar: 'https://via.placeholder.com/40',
                        status: 'Active AI',
                        timestamp,
                    },
                ]);
                setActiveChatId(consumerId);
            }
        },
        [mapMessagesToUi]
    );

    useEffect(() => {
        const consumerId = consumerFromQuery || consumerFromState || null;
        const sessionId = sessionFromQuery || sessionFromState || null;

        if (consumerId) {
            void fetchMessagesForConsumer(consumerId, location.state?.consumerName);
            return;
        }

        if (sessionId) {
            setActiveChatId(sessionId);
            void fetchMessagesForSession(sessionId);
            return;
        }

        // No consumer/session provided: load recent conversations list for navbar entry.
        void loadRecentConversations();
    }, [
        consumerFromQuery,
        consumerFromState,
        sessionFromQuery,
        sessionFromState,
        fetchMessagesForConsumer,
        fetchMessagesForSession,
        location.state,
        loadRecentConversations,
    ]);

    const handleSelectChat = (id: string) => {
        setActiveChatId(id);
        if (consumerFromQuery && id === consumerFromQuery) {
            void fetchMessagesForConsumer(consumerFromQuery);
        } else {
            void fetchMessagesForSession(id);
        }
    };

    const activeConversation = useMemo(
        () => conversations.find((chat) => chat.id === activeChatId) ?? null,
        [conversations, activeChatId]
    );

    const filteredConversations = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return conversations;
        return conversations.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.id.toLowerCase().includes(q) ||
                c.timestamp.toLowerCase().includes(q)
        );
    }, [conversations, searchQuery]);

    return (
        <div className="h-full">
            <div className="mb-6">
                <h1
                    className="text-3xl font-bold"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    Conversations
                </h1>
                <p
                    className="text-sm mt-1"
                    style={{ color: 'var(--color-text-muted)' }}
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
                            placeholder="🔍 Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 border rounded w-full text-sm mt-2"
                            style={{ borderColor: 'var(--color-border)' }}
                        />
                    </div>
                    {loadingConversations ? (
                        <div className="p-4">
                            <LoadingSkeleton className="h-24 w-full" />
                        </div>
                    ) : conversationsError ? (
                        <div className="p-4">
                            <ErrorMessage
                                message={conversationsError}
                                onRetry={loadRecentConversations}
                            />
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-4 text-sm text-(--color-text-muted)">
                            {conversations.length === 0
                                ? 'No conversations found yet.'
                                : 'No matches for your search.'}
                        </div>
                    ) : (
                        <ChatList
                            chats={filteredConversations}
                            activeChatId={activeChatId || ''}
                            onSelectChat={handleSelectChat}
                        />
                    )}
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-sm border border-(--color-border) flex flex-col relative">
                    <div className="p-4 border-b border-(--color-border) flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-(--color-text-primary)">
                                Live Chat Window
                            </h1>
                            <div className="flex items-center mt-2">
                                <span
                                    className="text-sm font-bold"
                                    style={{
                                        color: 'var(--color-text-primary)',
                                    }}
                                >
                                    {activeConversation?.name ||
                                        'Select a conversation from the conversations list'}
                                </span>
                            </div>
                        </div>
                        <div
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-2xl cursor-pointer hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                            style={{
                                color: 'var(--color-text-muted)',
                                marginTop: 'auto',
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
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <button
                                        disabled={!activeChatId}
                                        onClick={() => {
                                            if (!activeConversation) return;

                                            generateChatTranscript(activeConversation.name, messages);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                                        style={{
                                            color: 'var(--color-text-primary)',
                                        }}
                                    >
                                        <span>📥</span>
                                        <span>Download Transcript</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {messagesError && (
                        <div className="p-4">
                            <ErrorMessage
                                message={messagesError}
                                onRetry={
                                    activeChatId
                                        ? () => {
                                            const consumerId =
                                                consumerFromQuery || consumerFromState || null;
                                            if (consumerId && activeChatId === consumerId) {
                                                void fetchMessagesForConsumer(
                                                    consumerId,
                                                    location.state?.consumerName
                                                );
                                            } else {
                                                void fetchMessagesForSession(activeChatId);
                                            }
                                        }
                                        : undefined
                                }
                            />
                        </div>
                    )}

                    {loadingMessages && messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center p-4">
                            <LoadingSkeleton className="w-full h-32 max-w-xl" />
                        </div>
                    ) : (
                        <ChatWindow messages={messages} />
                    )}
                </div>
            </div>
        </div>
    );
}
