import React, { useState, useId } from 'react';
import { Send, Sliders, Code2, Sparkles, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { LeadFormData, WebhookConfig, WebhookDispatchResult, PresetLead } from '../types/n8n';
import { buildN8nPayload, dispatchToN8n } from '../services/webhookService';

interface InteractiveLeadCaptureProps {
  webhookConfig: WebhookConfig;
  onOpenSettings: () => void;
  onDispatchComplete: (result: WebhookDispatchResult) => void;
}

const PRESET_LEADS: PresetLead[] = [
  {
    label: 'Enterprise SaaS',
    tag: '500+ seats',
    data: {
      fullName: 'Sarah Chen',
      email: 'sarah.chen@cloudscale-enterprise.com',
      company: 'CloudScale Technologies',
      teamSize: '201-1000',
      monthlyLeads: '2,500 - 10,000',
      primaryWorkflowGoal: 'Automate inbound qualification & instant SDR Slack notifications with AI lead scoring',
      notes: 'Currently evaluating n8n self-hosted workflows to replace costly Zapier enterprise plan.',
    },
  },
  {
    label: 'Fintech Scaleup',
    tag: 'Global Ops',
    data: {
      fullName: 'Marcus Vance',
      email: 'm.vance@valencypayments.io',
      company: 'Valency Payments',
      teamSize: '51-200',
      monthlyLeads: '500 - 2,500',
      primaryWorkflowGoal: 'Enrich lead domain data via Clearbit and sync directly into HubSpot & Postgres',
      notes: 'Need strict SOC-2 compliant pass-through with no third-party data caching.',
    },
  },
  {
    label: 'AI Automation Agency',
    tag: 'B2B Inbound',
    data: {
      fullName: 'Elena Rostova',
      email: 'elena@vanguard-automations.com',
      company: 'Vanguard Systems',
      teamSize: '11-50',
      monthlyLeads: '< 500',
      primaryWorkflowGoal: 'Trigger personalized AI dynamic email sequences and book Google Meet sessions',
      notes: 'Testing webhook trigger with test n8n node before rolling out to 15 client accounts.',
    },
  },
];

export const InteractiveLeadCapture: React.FC<InteractiveLeadCaptureProps> = ({
  webhookConfig,
  onOpenSettings,
  onDispatchComplete,
}) => {
  const formId = useId();
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    company: '',
    teamSize: '11-50',
    monthlyLeads: '500 - 2,500',
    primaryWorkflowGoal: 'Automate inbound qualification & instant SDR Slack notifications with AI lead scoring',
    notes: '',
  });

  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastSubmissionSuccess, setLastSubmissionSuccess] = useState<boolean | null>(null);

  const currentPayload = buildN8nPayload(formData);

  const applyPreset = (preset: PresetLead) => {
    setFormData(preset.data);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Business email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setLastSubmissionSuccess(null);

    try {
      const payload = buildN8nPayload(formData);
      const result = await dispatchToN8n(payload, webhookConfig);
      setLastSubmissionSuccess(result.success);
      onDispatchComplete(result);
    } catch {
      setLastSubmissionSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="demo-request-section" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Presets */}
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Live Inbound Pipeline
            </div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-display text-white tracking-tight [text-wrap:balance]">
              Test the n8n Inbound Webhook Trigger
            </h2>
            <p className="mt-4 text-base text-neutral-300 leading-relaxed">
              Submit the form to dispatch an authentic HTTP POST payload to your designated n8n webhook. You can provide your own live n8n webhook URL, or run a simulated test execution.
            </p>

            {/* Quick Fill Presets */}
            <div className="mt-8">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Instant Test Presets (1-Click Fill)</span>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {PRESET_LEADS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 text-left hover:border-indigo-500/50 hover:bg-neutral-900 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {preset.label}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {preset.data.fullName} · {preset.data.company}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 bg-neutral-800/80 px-2 py-1 rounded">
                      {preset.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Webhook Endpoint Status Box */}
            <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${webhookConfig.url ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-amber-400'}`} />
                  <span className="text-xs font-semibold text-neutral-200">
                    Webhook Destination
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <Sliders className="h-3 w-3" />
                  <span>Configure</span>
                </button>
              </div>

              <div className="mt-2 font-mono text-xs text-neutral-300 bg-neutral-950 p-2.5 rounded-lg border border-neutral-850 break-all select-all">
                {webhookConfig.url ? webhookConfig.url : 'Simulated Endpoint (Click Configure to set custom URL)'}
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Dispatch Mode: <span className="text-neutral-200 font-medium capitalize">{webhookConfig.mode}</span></span>
                <span>Format: <span className="text-neutral-200 font-medium">application/json</span></span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form & JSON Inspector */}
          <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            {/* Header Tabs: Form vs Raw JSON payload */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-lg border border-neutral-850">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'form'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Demo Lead Form
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('json')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'json'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Live n8n Payload Preview</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-mono text-[11px] text-indigo-400">POST /webhook</span>
              </div>
            </div>

            {/* Tab 1: Form Inputs */}
            {activeTab === 'form' && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`${formId}-name`} className="block text-xs font-medium text-neutral-300">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id={`${formId}-name`}
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Sarah Chen"
                      className={`mt-1.5 w-full rounded-lg border ${errors.fullName ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-neutral-800'} bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${formId}-email`} className="block text-xs font-medium text-neutral-300">
                      Work Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sarah@company.com"
                      className={`mt-1.5 w-full rounded-lg border ${errors.email ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-neutral-800'} bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`${formId}-company`} className="block text-xs font-medium text-neutral-300">
                      Company Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id={`${formId}-company`}
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. CloudScale Technologies"
                      className={`mt-1.5 w-full rounded-lg border ${errors.company ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-neutral-800'} bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.company}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${formId}-team`} className="block text-xs font-medium text-neutral-300">
                      Team Size
                    </label>
                    <select
                      id={`${formId}-team`}
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                    >
                      <option value="1-10">1 - 10 employees</option>
                      <option value="11-50">11 - 50 employees</option>
                      <option value="51-200">51 - 200 employees</option>
                      <option value="201-1000">201 - 1,000 employees (Enterprise)</option>
                      <option value="1000+">1,000+ employees (Strategic)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`${formId}-leads`} className="block text-xs font-medium text-neutral-300">
                      Estimated Monthly Inbound Leads
                    </label>
                    <select
                      id={`${formId}-leads`}
                      value={formData.monthlyLeads}
                      onChange={(e) => setFormData({ ...formData, monthlyLeads: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                    >
                      <option value="< 500">&lt; 500 leads/mo</option>
                      <option value="500 - 2,500">500 - 2,500 leads/mo</option>
                      <option value="2,500 - 10,000">2,500 - 10,000 leads/mo</option>
                      <option value="10,000+">10,000+ leads/mo</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`${formId}-goal`} className="block text-xs font-medium text-neutral-300">
                      Primary Workflow Objective
                    </label>
                    <select
                      id={`${formId}-goal`}
                      value={formData.primaryWorkflowGoal}
                      onChange={(e) => setFormData({ ...formData, primaryWorkflowGoal: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                    >
                      <option value="Automate inbound qualification & instant SDR Slack notifications with AI lead scoring">
                        SDR Slack Alert &amp; AI Lead Scoring
                      </option>
                      <option value="Enrich lead domain data via Clearbit and sync directly into HubSpot & Postgres">
                        CRM &amp; Database Enrichment
                      </option>
                      <option value="Trigger personalized AI dynamic email sequences and book Google Meet sessions">
                        Dynamic AI Outreach Sequence
                      </option>
                      <option value="Custom multi-branch routing logic">
                        Custom Multi-Branch Workflow
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor={`${formId}-notes`} className="block text-xs font-medium text-neutral-300">
                    Integration Notes or Payload Metadata
                  </label>
                  <textarea
                    id={`${formId}-notes`}
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional message or custom attributes to pass into the webhook payload..."
                    className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                  />
                </div>

                {/* Submission CTA bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="text-xs text-neutral-400">
                    <span>Target: </span>
                    <span className="font-mono text-neutral-200">
                      {webhookConfig.url ? 'Custom Webhook' : 'Simulated Pipeline'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Dispatching to n8n...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Post Lead to n8n Webhook</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Live JSON Payload Preview */}
            {activeTab === 'json' && (
              <div className="mt-6">
                <div className="flex items-center justify-between pb-2 text-xs text-neutral-400 font-mono">
                  <span>Method: POST · Content-Type: application/json</span>
                  <span className="text-indigo-400">Ready to Send</span>
                </div>
                <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs overflow-x-auto max-h-[380px]">
                  <pre className="text-neutral-300">
                    {JSON.stringify(currentPayload, null, 2)}
                  </pre>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    This exact payload will be posted to the configured n8n Webhook node.
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send This Payload</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
