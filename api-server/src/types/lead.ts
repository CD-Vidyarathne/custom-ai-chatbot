export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export interface Lead {
  lead_id: string;
  created_at: string;
  name: string;
  email: string;
  phone_number: string;
  status: LeadStatus;
  notes?: string;
  org_id: string;
}

export interface CreateLeadDTO {
  consumer_id: string;
  session_id: string;
  org_id: string;
  name: string;
  email: string;
  phone_number: string;
}
