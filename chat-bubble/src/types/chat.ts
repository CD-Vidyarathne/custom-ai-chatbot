export interface Message {
  message_id?: string;
  session_id: string;
  sender: "user" | "ai";
  content: string;
  sequence_no?: number;
  created_at?: string;
}

export interface ChatSession {
  session_id: string;
  org_id: string;
  consumer_id: string;
  status: "active" | "closed";
  lead_captured: boolean;
}
