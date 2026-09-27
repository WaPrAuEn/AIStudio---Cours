import { WebhookConfig, WebhookDispatchResult, LeadFormData } from '../types/n8n';

export const DEFAULT_WEBHOOK_URL = ''; // Empty defaults to simulated demo workflow if no user URL provided

export function buildN8nPayload(formData: LeadFormData, metadataOverrides?: Record<string, any>) {
  return {
    event: 'lead.demo_requested',
    specVersion: '1.0',
    timestamp: new Date().toISOString(),
    id: 'evt_' + Math.random().toString(36).substring(2, 11),
    lead: {
      fullName: formData.fullName,
      email: formData.email,
      company: formData.company,
      teamSize: formData.teamSize,
      monthlyLeads: formData.monthlyLeads,
      primaryWorkflowGoal: formData.primaryWorkflowGoal,
      notes: formData.notes || null,
    },
    context: {
      source: 'syncpulse_landing_page',
      channel: 'web_inbound_demo',
      referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SyncPulseWebClient',
      locale: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
      ...metadataOverrides,
    },
  };
}

export async function dispatchToN8n(
  payload: any,
  config: WebhookConfig
): Promise<WebhookDispatchResult> {
  const startTime = performance.now();
  const headersToSend: Record<string, string> = {
    ...config.customHeaders,
  };

  if (config.authHeaderKey && config.authHeaderValue) {
    headersToSend[config.authHeaderKey.trim()] = config.authHeaderValue.trim();
  }

  // If user selected direct browser mode
  if (config.mode === 'direct' && config.url) {
    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headersToSend,
        },
        body: JSON.stringify(payload),
      });

      const latencyMs = Math.round(performance.now() - startTime);
      let responseBody: any;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }

      return {
        id: 'direct_' + Date.now().toString(36),
        timestamp: new Date().toISOString(),
        webhookUrl: config.url,
        mode: 'direct',
        status: response.status,
        statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
        latencyMs,
        success: response.ok,
        requestPayload: payload,
        responseBody: responseBody || { message: 'Webhook received' },
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        id: 'direct_' + Date.now().toString(36),
        timestamp: new Date().toISOString(),
        webhookUrl: config.url,
        mode: 'direct',
        status: 0,
        statusText: 'CORS or Network Failure',
        latencyMs,
        success: false,
        requestPayload: payload,
        responseBody: null,
        error: `Browser blocked the request (likely CORS). Switch to "Server Proxy" mode in Webhook Settings to bypass CORS restrictions: ${err.message}`,
      };
    }
  }

  // Standard path: Server proxy or simulate
  try {
    const res = await fetch('/api/n8n/dispatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhookUrl: config.url,
        payload,
        customHeaders: headersToSend,
        mode: config.mode,
      }),
    });

    const data: WebhookDispatchResult = await res.json();
    return data;
  } catch (err: any) {
    // Fallback if local backend is temporarily unreachable
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      id: 'local_err_' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      webhookUrl: config.url || 'https://demo-n8n.internal.syncpulse.io/webhook/lead-intake',
      mode: config.mode,
      status: 500,
      statusText: 'Internal Dispatch Error',
      latencyMs,
      success: false,
      requestPayload: payload,
      responseBody: null,
      error: err?.message || 'Failed to dispatch via proxy',
    };
  }
}

export async function fetchDispatchHistory(): Promise<WebhookDispatchResult[]> {
  try {
    const res = await fetch('/api/n8n/history');
    if (!res.ok) return [];
    const data = await res.json();
    return data.history || [];
  } catch {
    return [];
  }
}

export async function clearDispatchHistory(): Promise<boolean> {
  try {
    const res = await fetch('/api/n8n/history', { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}
