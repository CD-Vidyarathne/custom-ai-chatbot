import { supabase } from '../config/supabase.js';

export interface PersonaRow {
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
}

export interface UpdatePersonaInput {
  name?: string;
  system_prompt?: string;
  greeting_message?: string | null;
  fallback_message?: string | null;
  ai_provider?: string;
  model_name?: string;
  temperature?: number;
  max_tokens?: number;
  is_active?: boolean;
}

/** Get current persona by org_id (active one) or by persona_id. */
export async function getPersonaByOrgId(orgId: string): Promise<PersonaRow | null> {
  const { data, error } = await supabase
    .from('persona')
    .select('*')
    .eq('org_id', orgId)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch persona: ${error.message}`);
  return data as PersonaRow | null;
}

/** Get persona by persona_id. */
export async function getPersonaById(personaId: string): Promise<PersonaRow | null> {
  const { data, error } = await supabase
    .from('persona')
    .select('*')
    .eq('persona_id', personaId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch persona: ${error.message}`);
  }
  return data as PersonaRow;
}

/** Update persona. Validates non-empty name and system_prompt if provided. */
export async function updatePersona(
  personaId: string,
  input: UpdatePersonaInput
): Promise<PersonaRow | null> {
  if (input.name !== undefined && typeof input.name === 'string' && !input.name.trim()) {
    throw new Error('Persona name cannot be empty');
  }
  if (
    input.system_prompt !== undefined &&
    typeof input.system_prompt === 'string' &&
    !input.system_prompt.trim()
  ) {
    throw new Error('System prompt cannot be empty');
  }

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { updated_at: now };
  if (input.name !== undefined) updates.name = input.name;
  if (input.system_prompt !== undefined) updates.system_prompt = input.system_prompt;
  if (input.greeting_message !== undefined) updates.greeting_message = input.greeting_message;
  if (input.fallback_message !== undefined) updates.fallback_message = input.fallback_message;
  if (input.ai_provider !== undefined) updates.ai_provider = input.ai_provider;
  if (input.model_name !== undefined) updates.model_name = input.model_name;
  if (input.temperature !== undefined) updates.temperature = input.temperature;
  if (input.max_tokens !== undefined) updates.max_tokens = input.max_tokens;
  if (input.is_active !== undefined) updates.is_active = input.is_active;

  const { error } = await supabase.from('persona').update(updates).eq('persona_id', personaId);
  if (error) throw new Error(`Failed to update persona: ${error.message}`);
  return getPersonaById(personaId);
}
