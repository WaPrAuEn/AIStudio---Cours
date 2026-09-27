import React, { useState } from 'react';
import { ArrowRight, Copy, Check, Terminal, ExternalLink, Zap, CheckCircle2 } from 'lucide-react';

interface N8nGuideSectionProps {
  onOpenSettings: () => void;
}

export const N8nGuideSection: React.FC<N8nGuideSectionProps> = ({ onOpenSettings }) => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'selfhosted'>('selfhosted');
  const [copiedCurl, setCopiedCurl] = useState(false);

  const sampleCurl = `curl -X POST https://your-n8n.example.com/webhook/syncpulse-lead \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "lead.demo_requested",
    "lead": {
      "fullName": "Sarah Chen",
      "email": "sarah@cloudscale.com",
      "company": "CloudScale",
      "teamSize": "201-1000",
      "monthlyLeads": "2,500 - 10,000",
      "primaryWorkflowGoal": "SDR Slack Alert & AI Scoring"
    }
  }'`;

  const handleCopyCurl = async () => {
    try {
      await navigator.clipboard.writeText(sampleCurl);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section id="n8n-integration" className="py-20 md:py-28 border-b border-neutral-850">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Developer Integration
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-display text-white tracking-tight [text-wrap:balance]">
            Connect Any n8n Instance in Under 3 Minutes
          </h2>
          <p className="mt-4 text-base text-neutral-400 leading-relaxed">
            Whether you run n8n on Docker, Kubernetes, AWS ECS, or n8n Cloud, SyncPulse delivers standardized JSON payloads ready for immediate consumption.
          </p>
        </div>

        {/* Tab switcher: Self-Hosted vs n8n Cloud */}
        <div className="mt-12 flex items-center justify-between flex-wrap gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('selfhosted')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'selfhosted'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Self-Hosted Docker / K8s
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cloud')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'cloud'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              n8n Cloud Managed
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Open Webhook Settings Panel</span>
          </button>
        </div>

        {/* Guide Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="flex items-start gap-3">
                <span className="font-mono text-sm font-bold text-indigo-400">Step 1</span>
                <div>
                  <h4 className="text-base font-semibold text-white">Create a Webhook Node in n8n</h4>
                  <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                    Inside your n8n workflow canvas, add the official <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded">Webhook</code> trigger node. Set the HTTP Method to <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded">POST</code> and set Path to <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded">lead-intake</code>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="flex items-start gap-3">
                <span className="font-mono text-sm font-bold text-indigo-400">Step 2</span>
                <div>
                  <h4 className="text-base font-semibold text-white">Configure Response Mode</h4>
                  <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                    Set Response Mode to <strong className="text-neutral-200">&quot;On Received&quot;</strong> for immediate acknowledgement, or add a <strong className="text-neutral-200">&quot;Respond to Webhook&quot;</strong> node at the end of your workflow to return custom AI classification results or assigned AE names.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="flex items-start gap-3">
                <span className="font-mono text-sm font-bold text-indigo-400">Step 3</span>
                <div>
                  <h4 className="text-base font-semibold text-white">Paste Webhook URL in SyncPulse</h4>
                  <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                    Copy your n8n Test or Production URL, open the SyncPulse Webhook Settings modal, paste it in, and submit any test lead.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: cURL / Raw inspection */}
          <div className="lg:col-span-5 rounded-xl border border-neutral-800 bg-neutral-950 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-850">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <Terminal className="h-4 w-4 text-indigo-400" />
                <span>Standard cURL Test Spec</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCurl}
                className="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCurl ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-[300px]">
              <pre>{sampleCurl}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
