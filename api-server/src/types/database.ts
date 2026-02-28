export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ChatStatus = 'active' | 'closed' | 'abandoned';
export type MessageSource = 'user' | 'assistant' | 'system';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed';

export interface Database {
  public: {
    Tables: {
      organization: {
        Row: {
          org_id: string;
          owner_user_id: string;
          org_name: string;
          email: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          org_id?: string;
          owner_user_id: string;
          org_name: string;
          email: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          org_id?: string;
          owner_user_id?: string;
          org_name?: string;
          email?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      persona: {
        Row: {
          persona_id: string;
          org_id: string;
          name: string;
          system_prompt: string;
          greeting_message: string | null;
          fallback_message: string | null;
          ai_provider: string;
          model_name: string;
          temperature: number;
          max_tokens: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          persona_id?: string;
          org_id: string;
          name: string;
          system_prompt: string;
          greeting_message?: string | null;
          fallback_message?: string | null;
          ai_provider?: string;
          model_name?: string;
          temperature?: number;
          max_tokens?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          persona_id?: string;
          org_id?: string;
          name?: string;
          system_prompt?: string;
          greeting_message?: string | null;
          fallback_message?: string | null;
          ai_provider?: string;
          model_name?: string;
          temperature?: number;
          max_tokens?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      consumer: {
        Row: {
          consumer_id: string;
          persona_id: string;
          org_id: string;
          name: string | null;
          email: string | null;
          phone_number: string | null;
          fingerprint: string | null;
          ip_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          consumer_id?: string;
          persona_id: string;
          org_id: string;
          name?: string | null;
          email?: string | null;
          phone_number?: string | null;
          fingerprint?: string | null;
          ip_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          consumer_id?: string;
          persona_id?: string;
          org_id?: string;
          name?: string | null;
          email?: string | null;
          phone_number?: string | null;
          fingerprint?: string | null;
          ip_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_session: {
        Row: {
          session_id: string;
          consumer_id: string;
          persona_id: string;
          org_id: string;
          status: ChatStatus;
          lead_captured: boolean;
          started_at: string;
          ended_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          session_id?: string;
          consumer_id: string;
          persona_id: string;
          org_id: string;
          status?: ChatStatus;
          lead_captured?: boolean;
          started_at?: string;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          session_id?: string;
          consumer_id?: string;
          persona_id?: string;
          org_id?: string;
          status?: ChatStatus;
          lead_captured?: boolean;
          started_at?: string;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      message: {
        Row: {
          msg_id: string;
          session_id: string;
          sequence_no: number;
          msg_source: MessageSource;
          content: string;
          tokens_used: number | null;
          is_deleted: boolean;
          created_at: string;
        };
        Insert: {
          msg_id?: string;
          session_id: string;
          sequence_no: number;
          msg_source: MessageSource;
          content: string;
          tokens_used?: number | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Update: {
          msg_id?: string;
          session_id?: string;
          sequence_no?: number;
          msg_source?: MessageSource;
          content?: string;
          tokens_used?: number | null;
          is_deleted?: boolean;
          created_at?: string;
        };
      };
      qualified_lead: {
        Row: {
          lead_id: string;
          consumer_id: string;
          session_id: string | null;
          org_id: string;
          name: string | null;
          email: string | null;
          phone_number: string | null;
          notes: string | null;
          status: LeadStatus;
          captured_at: string;
          updated_at: string;
        };
        Insert: {
          lead_id?: string;
          consumer_id: string;
          session_id?: string | null;
          org_id: string;
          name?: string | null;
          email?: string | null;
          phone_number?: string | null;
          notes?: string | null;
          status?: LeadStatus;
          captured_at?: string;
          updated_at?: string;
        };
        Update: {
          lead_id?: string;
          consumer_id?: string;
          session_id?: string | null;
          org_id?: string;
          name?: string | null;
          email?: string | null;
          phone_number?: string | null;
          notes?: string | null;
          status?: LeadStatus;
          captured_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      chat_status: ChatStatus;
      message_source: MessageSource;
      lead_status: LeadStatus;
    };
  };
}
