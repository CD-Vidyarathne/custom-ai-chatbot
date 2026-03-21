import { supabase } from "../config/supabase.js";
import { CreateLeadDTO, LeadStatus } from "../types/lead.js";

export const leadService = {
  async createLead(data: CreateLeadDTO) {
    const { data: newLead, error } = await supabase
      .from("qualified_lead")
      .insert([
        {
          ...data,
          status: "new",
          captured_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return newLead;
  },

  async getLeadsByOrg(orgId: string) {
    const { data, error } = await supabase
      .from("qualified_lead")
      .select("lead_id, created_at, name, email, phone_number, status")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};
