import React, { useState } from 'react';
import { ArrowRight, Zap, CheckCircle2, Play, Activity } from 'lucide-react';
import { WebhookConfig } from '../types/n8n';

interface HeroProps {
  webhookConfig: WebhookConfig;
  onOpenSettings: () => void;
  onQuickPing: () => void;
  isPinging: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  webhookConfig,
  onOpenSettings,
  onQuickPing,
  isPinging,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const scrollToLeadForm = () => {
    const el = document.getElementById('demo-request-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-neutral-850">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-purple-600/8 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top quiet kicker (zero pill discipline: unboxed clean text) */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-400">
          <span className="text-indigo-400 font-semibold uppercase tracking-wider text-[11px]">
            n8n Webhook Architecture
          </span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Zero Middleware Latency</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="text-neutral-300">HTTP POST 1.1 / 2.0 Ready</span>
        </div>

        {/* Primary Headline with text-balance and max-width */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1] [text-wrap:balance]">
            Autonomous Inbound Lead Qualification, Dispatched Instantly to n8n
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-3xl [text-wrap:balance]">
            Transform high-intent visitor inquiries into enriched CRM records and real-time sales alerts. Connect your live n8n webhook endpoint with zero latency and structured JSON contracts.
          </p>
        </div>

        {/* CTA Block & Quick Connectivity Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            type="button"
            onClick={scrollToLeadForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Test Live Lead Capture Form</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900/90 px-5 py-3.5 text-sm font-medium text-neutral-200 hover:border-neutral-600 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Configure n8n Webhook URL</span>
          </button>

          <button
            type="button"
            onClick={onQuickPing}
            disabled={isPinging}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3.5 text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors cursor-pointer disabled:opacity-60"
            title="Send lightweight ping payload to verify webhook node response"
          >
            {isPinging ? (
              <>
                <Activity className="h-4 w-4 animate-spin text-indigo-400" />
                <span>Pinging...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                <span>Quick Ping Webhook</span>
              </>
            )}
          </button>
        </div>

        {/* Claim-to-Proof Adjacency: Concrete Quantitative Rigor */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-neutral-800/80 py-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums tracking-tight">
              &lt; 92ms
            </div>
            <div className="mt-1 text-xs text-neutral-400 font-medium">
              Mean Dispatch Latency
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums tracking-tight">
              +142%
            </div>
            <div className="mt-1 text-xs text-neutral-400 font-medium">
              SDR Outreach Speed
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums tracking-tight">
              4.8M+
            </div>
            <div className="mt-1 text-xs text-neutral-400 font-medium">
              Webhook Payloads Routed
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums tracking-tight">
              99.99%
            </div>
            <div className="mt-1 text-xs text-neutral-400 font-medium">
              Pipeline Delivery Rate
            </div>
          </div>
        </div>

        {/* Hero Visual Focal Carrier: High Fidelity Generated Asset with fallback */}
        <div className="mt-12 relative rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-2xl">
          <div className="relative aspect-[16/9] w-full max-h-[520px] overflow-hidden bg-neutral-950">
            {!imageError ? (
              <img
                src="images/hero_modern_automation_1790500254707.jpg"
                alt="SyncPulse automation control center and modern enterprise workflow studio"
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`h-full w-full object-cover object-center transition-opacity duration-700 ${imageLoaded ? 'opacity-90' : 'opacity-0'}`}
              />
            ) : null}

            {/* Fallback container if image is loading or fails */}
            {(!imageLoaded || imageError) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-indigo-950/30 p-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Activity className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-white">SyncPulse Live Webhook Pipeline</h3>
                <p className="mt-1 text-xs text-neutral-400 max-w-md">
                  Active connection orchestrating inbound form submissions directly into your n8n workflows.
                </p>
              </div>
            )}

            {/* Scrim Overlay for high-contrast legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

            {/* In-situ Live Telemetry Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md rounded-xl border border-neutral-700/60 bg-neutral-900/90 p-4 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-mono font-medium text-neutral-200">
                    n8n Webhook Listener
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">
                  {webhookConfig.url ? 'Production Target' : 'Demo Sandbox'}
                </span>
              </div>
              <div className="mt-2.5 font-mono text-[11px] text-neutral-300 truncate">
                <span className="text-indigo-400 font-semibold">POST </span>
                {webhookConfig.url || 'https://demo-n8n.internal.syncpulse.io/webhook/lead-intake'}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Payload Format: JSON</span>
                <span className="text-emerald-400 font-medium">Ready for Inbound</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
