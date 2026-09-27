export interface LeadFormData {
  fullName: string;
  email: string;
  company: string;
  teamSize: string;
  monthlyLeads: string;
  primaryWorkflowGoal: string;
  notes: string;
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
