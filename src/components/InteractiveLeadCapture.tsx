import React, { useState, useId } from 'react';
import { Send, Code2, Sparkles, AlertCircle, RefreshCw, Workflow } from 'lucide-react';
import { LeadFormData, WebhookConfig, WebhookDispatchResult, PresetLead } from '../types/n8n';
import { buildN8nPayload, dispatchToN8n } from '../services/webhookService';

interface InteractiveLeadCaptureProps {
  webhookConfig: WebhookConfig;
  onOpenSettings: () => void;
  onDispatchComplete: (result: WebhookDispatchResult) => void;
}

// The 3 course workflows on the n8n instance (production webhook URLs)
const N8N_WORKFLOWS = [
  {
    id: 'wf1',
    label: 'WF1 · Simple',
    description: 'Webhook → Google Sheets',
    url: 'https://n8n.srv974672.hstgr.cloud/webhook/cours-wf1',
  },
  {
    id: 'wf2',
    label: 'WF2 · Filtre IA',
    description: 'Webhook → Filtre IA → Google Sheets',
    url: 'https://n8n.srv974672.hstgr.cloud/webhook/cours-wf2',
  },
  {
    id: 'wf3',
    label: 'WF3 · Filtre IA + Email',
    description: 'Webhook → Filtre IA → Google Sheets → Email',
    url: 'https://n8n.srv974672.hstgr.cloud/webhook/cours-wf3',
  },
];

const PRESET_LEADS: PresetLead[] = [
  {
    label: 'Vraie demande',
    tag: 'valide',
    data: {
      nom: 'Marie Durand',
      email: 'marie.durand@example.com',
      entreprise: 'Boulangerie Durand',
      message: 'Bonjour, je voudrais automatiser la prise de commandes de ma boulangerie et recevoir un devis.',
    },
  },
  {
    label: 'Message bidon',
    tag: 'non significatif',
    data: {
      nom: 'aaa',
      email: 'test@test.com',
      entreprise: 'zzz',
      message: 'qsdfqsdf test test',
    },
  },
  {
    label: 'Spam publicitaire',
    tag: 'non significatif',
    data: {
      nom: 'Promo SEO',
      email: 'promo@seo-rapide.biz',
      entreprise: 'SEO Rapide',
      message: 'Boostez votre site en première page de Google en 48h !!! Offre exceptionnelle, cliquez ici.',
    },
  },
];

const EMPTY_FORM: LeadFormData = { nom: '', email: '', entreprise: '', message: '' };

export const InteractiveLeadCapture: React.FC<InteractiveLeadCaptureProps> = ({
  webhookConfig,
  onDispatchComplete,
}) => {
  const formId = useId();
  const [formData, setFormData] = useState<LeadFormData>(EMPTY_FORM);
  const [workflowId, setWorkflowId] = useState(N8N_WORKFLOWS[0].id);

  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedWorkflow = N8N_WORKFLOWS.find((wf) => wf.id === workflowId) ?? N8N_WORKFLOWS[0];
  const currentPayload = buildN8nPayload(formData);

  const applyPreset = (preset: PresetLead) => {
    setFormData(preset.data);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Adresse email invalide';
    }
    if (!formData.message.trim()) newErrors.message = 'Le message est obligatoire';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = buildN8nPayload(formData);
      const result = await dispatchToN8n(payload, { ...webhookConfig, url: selectedWorkflow.url });
      onDispatchComplete(result);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `mt-1.5 w-full rounded-lg border ${hasError ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-neutral-800'} bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`;

  const fieldError = (key: string) =>
    errors[key] && (
      <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {errors[key]}
      </p>
    );

  return (
    <section id="demo-request-section" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Presets */}
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Démo en direct
            </div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-display text-white tracking-tight [text-wrap:balance]">
              Envoyer le formulaire vers n8n
            </h2>
            <p className="mt-4 text-base text-neutral-300 leading-relaxed">
              Choisissez un des 3 workflows n8n, remplissez le formulaire et envoyez : les données partent directement vers le webhook n8n choisi.
            </p>

            {/* Quick Fill Presets */}
            <div className="mt-8">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Exemples (remplissage en 1 clic)</span>
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
                        {preset.data.nom} · {preset.data.entreprise}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 bg-neutral-800/80 px-2 py-1 rounded">
                      {preset.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected webhook destination */}
            <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
                <span className="text-xs font-semibold text-neutral-200">
                  Destination : {selectedWorkflow.label}
                </span>
              </div>
              <div className="mt-2 font-mono text-xs text-neutral-300 bg-neutral-950 p-2.5 rounded-lg border border-neutral-850 break-all select-all">
                {selectedWorkflow.url}
              </div>
              <div className="mt-2.5 text-[11px] text-neutral-400">
                {selectedWorkflow.description}
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
                  Formulaire
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
                  <span>Données envoyées (JSON)</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-mono text-[11px] text-indigo-400">POST /webhook/cours-{selectedWorkflow.id}</span>
              </div>
            </div>

            {/* Workflow selector */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                <Workflow className="h-3.5 w-3.5 text-indigo-400" />
                <span>Workflow n8n de destination</span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {N8N_WORKFLOWS.map((wf) => (
                  <button
                    key={wf.id}
                    type="button"
                    onClick={() => setWorkflowId(wf.id)}
                    className={`rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer ${
                      wf.id === workflowId
                        ? 'border-indigo-500 bg-indigo-950/40 text-white'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{wf.label}</div>
                    <div className="mt-0.5 text-[11px] text-neutral-400">{wf.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab 1: Form Inputs */}
            {activeTab === 'form' && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`${formId}-nom`} className="block text-xs font-medium text-neutral-300">
                      Nom <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id={`${formId}-nom`}
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="ex. Marie Durand"
                      className={inputClass(!!errors.nom)}
                    />
                    {fieldError('nom')}
                  </div>

                  <div>
                    <label htmlFor={`${formId}-email`} className="block text-xs font-medium text-neutral-300">
                      Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ex. marie@entreprise.fr"
                      className={inputClass(!!errors.email)}
                    />
                    {fieldError('email')}
                  </div>
                </div>

                <div>
                  <label htmlFor={`${formId}-entreprise`} className="block text-xs font-medium text-neutral-300">
                    Entreprise
                  </label>
                  <input
                    id={`${formId}-entreprise`}
                    type="text"
                    value={formData.entreprise}
                    onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                    placeholder="ex. Boulangerie Durand"
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <label htmlFor={`${formId}-message`} className="block text-xs font-medium text-neutral-300">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id={`${formId}-message`}
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Votre demande..."
                    className={`${inputClass(!!errors.message)} resize-none`}
                  />
                  {fieldError('message')}
                </div>

                {/* Submission CTA bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="text-xs text-neutral-400">
                    <span>Destination : </span>
                    <span className="font-mono text-neutral-200">{selectedWorkflow.label}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Envoi vers n8n...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Envoyer à n8n</span>
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
                </div>
                <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs overflow-x-auto max-h-[380px]">
                  <pre className="text-neutral-300">
                    {JSON.stringify(currentPayload, null, 2)}
                  </pre>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    Exactement ce que reçoit le nœud Webhook de n8n.
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Envoyer ces données</span>
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
