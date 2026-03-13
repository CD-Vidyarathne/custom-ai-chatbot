export interface Conversation {
    id: string;
    name: string;
    avatar: string;
    status: string;
    timestamp: string;
}

export interface Message {
    sender: "user" | "ai";
    content: string;
}
