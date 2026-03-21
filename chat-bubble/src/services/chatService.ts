import { supabase } from "../config/supabase.js";
import { Message } from "../types/chat.js";

export const chatService = {
  async getChatHistory(sessionId: string) {
    const { data, error } = await supabase
      .from("message")
      .select("*")
      .eq("session_id", sessionId)
      .order("sequence_no", { ascending: true });

    if (error) throw error;
    return data;
  },

  async saveMessage(payload: Message) {
    const { data: lastMsg } = await supabase
      .from("message")
      .select("sequence_no")
      .eq("session_id", payload.session_id)
      .order("sequence_no", { ascending: false })
      .limit(1)
      .single();

    const nextSeq = (lastMsg?.sequence_no || 0) + 1;

    const { data, error } = await supabase
      .from("message")
      .insert([{ ...payload, sequence_no: nextSeq }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSessionState(sessionId: string, updates: Partial<any>) {
    const { error } = await supabase
      .from("chat_session")
      .update(updates)
      .eq("session_id", sessionId);

    if (error) throw error;
  },
};
