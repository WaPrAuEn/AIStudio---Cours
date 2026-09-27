import React from 'react';
import { Sliders, ArrowUpRight } from 'lucide-react';
import { WebhookConfig } from '../types/n8n';

interface NavbarProps {
  webhookConfig: WebhookConfig;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  webhookConfig,
  onOpenSettings,
  onOpenHistory,
  historyCount,
}) => {
  const isCustomUrl = !!webhookConfig.url && webhookConfig.url.trim().length > 0;

  const scrollToLeadForm = () => {
    const el = document.getElementById('demo-request-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="/" className="text-xl font-bold tracking-tight text-white font-display transition-opacity hover:opacity-90">
          SyncPulse
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <a href="#architecture" className="hover:text-white transition-colors">
            Architecture
          </a>
          <a href="#capabilities" className="hover:text-white transition-colors">
            Capabilities
          </a>
          <a href="#use-cases" className="hover:text-white transition-colors">
            Workflows
          </a>
          <a href="#n8n-integration" className="hover:text-white transition-colors">
            n8n Guide
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-neutral-700 hover:bg-neutral-850 hover:text-white transition-colors cursor-pointer"
            title="Configure n8n Webhook Endpoint"
          >
            <span className={`inline-block h-2 w-2 rounded-full ${isCustomUrl ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-amber-400 ring-2 ring-amber-500/20'}`} />
            <span className="hidden sm:inline font-mono text-[11px]">
              {isCustomUrl ? 'Custom n8n Connected' : 'Simulated n8n'}
            </span>
            <Sliders className="h-3.5 w-3.5 text-neutral-400" />
          </button>

          {historyCount > 0 && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
              title="View recent webhook dispatches"
            >
              <span className="font-mono text-[11px] tabular-nums text-indigo-400 font-semibold">{historyCount}</span>
              <span>Logged</span>
            </button>
          )}

          <button
            type="button"
            onClick={scrollToLeadForm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 active:bg-indigo-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Request Demo</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-indigo-200" />
          </button>
        </div>
      </div>
    </header>
  );
};
