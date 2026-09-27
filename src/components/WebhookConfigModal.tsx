import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Zap, HelpCircle, Shield, AlertTriangle } from 'lucide-react';
import { WebhookConfig } from '../types/n8n';

interface WebhookConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WebhookConfig;
  onSave: (newConfig: WebhookConfig) => void;
  onTestPing: (url: string) => void;
  isPinging: boolean;
}

const SAMPLE_N8N_WORKFLOW_JSON = {
  name: "SyncPulse Inbound Lead Intake",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "syncpulse-lead",
        responseMode: "onReceived",
        responseData: "allEntries",
        options: {}
      },
      name: "Webhook Intake",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [240, 300]
    },
    {
      parameters: {
        jsCode: "// Extract lead details\nconst lead = $json.body.lead;\nconst context = $json.body.context;\n\nreturn [{\n  json: {\n    leadName: lead.fullName,\n    email: lead.email,\n    company: lead.company,\n    teamSize: lead.teamSize,\n    goal: lead.primaryWorkflowGoal,\n    priorityScore: lead.teamSize.includes('1000') ? 'Tier 1' : 'Standard'\n  }\n}];"
      },
      name: "Transform Lead",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [460, 300]
    },
    {
      parameters: {
        respondWith: "json",
        responseBody: "{\n  \"status\": \"success\",\n  \"message\": \"Lead successfully routed through n8n\",\n  \"lead\": \"={{ $json.leadName }}\"\n}"
      },
      name: "Respond to Webhook",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [680, 300]
    }
  ],
  connections: {
    "Webhook Intake": {
      main: [
        [{ node: "Transform Lead", type: "main", index: 0 }]
      ]
    },
    "Transform Lead": {
      main: [
        [{ node: "Respond to Webhook", type: "main", index: 0 }]
      ]
    }
  }
};

export const WebhookConfigModal: React.FC<WebhookConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onTestPing,
  isPinging,
}) => {
  const [url, setUrl] = useState(config.url || '');
  const mode = 'direct' as const;
  const [authHeaderKey, setAuthHeaderKey] = useState(config.authHeaderKey || '');
  const [authHeaderValue, setAuthHeaderValue] = useState(config.authHeaderValue || '');
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'setup' | 'workflowJson'>('setup');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      url: url.trim(),
      mode,
      customHeaders: {},
      authHeaderKey: authHeaderKey.trim(),
      authHeaderValue: authHeaderValue.trim(),
    });
    onClose();
  };

  const handleCopyWorkflow = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(SAMPLE_N8N_WORKFLOW_JSON, null, 2));
      setCopiedWorkflow(true);
      setTimeout(() => setCopiedWorkflow(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl text-left my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
          <div>
            <h3 className="text-xl font-bold font-display text-white">
              Configure n8n Webhook Destination
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Set your target n8n instance and optional authentication header.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Webhook URL Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              n8n Webhook URL
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-n8n-instance.com/webhook/syncpulse-lead"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 font-mono text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => onTestPing(url)}
                  disabled={isPinging}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {isPinging ? 'Pinging...' : 'Ping Test'}
                </button>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-400">
              Paste either the <strong className="text-neutral-300">Test URL</strong> (while building your n8n workflow) or <strong className="text-neutral-300">Production URL</strong> (after activating the workflow).
            </p>
          </div>

          {/* Optional Authentication Header */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-neutral-400" />
              <span className="text-xs font-semibold text-neutral-200">
                Optional Authentication Header
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-400">Header Key</label>
                <input
                  type="text"
                  value={authHeaderKey}
                  onChange={(e) => setAuthHeaderKey(e.target.value)}
                  placeholder="e.g. Authorization or X-N8N-API-KEY"
                  className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-xs text-white placeholder-neutral-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400">Header Value / Token</label>
                <input
                  type="password"
                  value={authHeaderValue}
                  onChange={(e) => setAuthHeaderValue(e.target.value)}
                  placeholder="Bearer your_secret_token"
                  className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-xs text-white placeholder-neutral-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* n8n Setup & Template Drawer */}
          <div className="border-t border-neutral-800 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('setup')}
                  className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-colors ${activeGuideTab === 'setup' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-neutral-400 hover:text-neutral-200'}`}
                >
                  Quick Setup Steps
                </button>
                <span className="text-neutral-600">·</span>
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('workflowJson')}
                  className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-colors ${activeGuideTab === 'workflowJson' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-neutral-400 hover:text-neutral-200'}`}
                >
                  Copy n8n Workflow Template
                </button>
              </div>

              {activeGuideTab === 'workflowJson' && (
                <button
                  type="button"
                  onClick={handleCopyWorkflow}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedWorkflow ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Workflow JSON</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {activeGuideTab === 'setup' ? (
              <div className="mt-3 text-xs text-neutral-300 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-indigo-400 font-bold">1.</span>
                  <span>In your n8n workspace, add a <strong className="text-white">Webhook</strong> node.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-indigo-400 font-bold">2.</span>
                  <span>Set <strong className="text-white">HTTP Method</strong> to <code className="bg-neutral-800 px-1 py-0.5 rounded text-indigo-300">POST</code> and Path to e.g. <code className="bg-neutral-800 px-1 py-0.5 rounded text-indigo-300">syncpulse-lead</code>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-indigo-400 font-bold">3.</span>
                  <span>Click <strong className="text-white">&quot;Listen for Test Event&quot;</strong> in n8n, then copy the <strong className="text-white">Test URL</strong> and paste it into the field above.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-indigo-400 font-bold">4.</span>
                  <span>Click <strong className="text-white">&quot;Ping Test&quot;</strong> or submit the lead form to verify the live execution!</span>
                </div>
              </div>
            ) : (
              <div className="mt-3 relative rounded-xl border border-neutral-800 bg-neutral-950 p-3 font-mono text-[11px] text-neutral-300 max-h-[160px] overflow-y-auto">
                <pre>{JSON.stringify(SAMPLE_N8N_WORKFLOW_JSON, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 flex items-center justify-end gap-3 pt-5 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
