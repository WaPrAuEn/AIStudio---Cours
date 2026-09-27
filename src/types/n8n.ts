// Fields expected by the course n8n workflows (body.nom, body.email, ...)
export interface LeadFormData {
  nom: string;
  email: string;
  entreprise: string;
  message: string;
}

export interface WebhookConfig {
  url: string;
  mode: 'proxy' | 'simulate' | 'direct';
  customHeaders: Record<string, string>;
  authHeaderKey: string;
  authHeaderValue: string;
  secretToken?: string;
}

export interface WebhookDispatchResult {
  id: string;
  timestamp: string;
  webhookUrl: string;
  mode: 'proxy' | 'simulate' | 'direct';
  status: number;
  statusText: string;
  latencyMs: number;
  success: boolean;
  requestPayload: any;
  responseBody: any;
  error?: string;
}

export interface PresetLead {
  label: string;
  tag: string;
  data: LeadFormData;
}
