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

// Static site (GitHub Pages): no backend, the browser POSTs directly to the n8n webhook.
// The n8n webhook must allow this site's origin (CORS).
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

  const url = (config.url || '').trim();
  const id = 'direct_' + Date.now().toString(36);

  if (!url) {
    return {
      id,
      timestamp: new Date().toISOString(),
      webhookUrl: '',
      mode: 'direct',
      status: 0,
      statusText: 'No webhook URL',
      latencyMs: 0,
      success: false,
      requestPayload: payload,
      responseBody: null,
      error: 'No n8n webhook URL configured. Open Webhook Settings and paste your n8n webhook URL.',
    };
  }

  try {
    const response = await fetch(url, {
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
      id,
      timestamp: new Date().toISOString(),
      webhookUrl: url,
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
      id,
      timestamp: new Date().toISOString(),
      webhookUrl: url,
      mode: 'direct',
      status: 0,
      statusText: 'CORS or Network Failure',
      latencyMs,
      success: false,
      requestPayload: payload,
      responseBody: null,
      error: `Browser could not reach the webhook (likely CORS). In n8n, set the Webhook node's "Allowed Origins (CORS)" option to this site's origin: ${err.message}`,
    };
  }
}
