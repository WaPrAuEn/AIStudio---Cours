import React from 'react';
import { ArrowRight, Server, GitFork, Send, Database } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Inbound Ingestion & Sanitization',
      icon: Server,
      description:
        'Client-side schema validation inspects form inputs, deduplicates email formats, appends session origin context, and prepares a standardized JSON spec.',
      detail: 'Standardized ISO-8601 timestamps, referrer tracking & client metadata',
    },
    {
      step: '02',
      title: 'Instant HTTP POST to n8n',
      icon: Send,
      description:
        'The landing page fires a structured POST payload to your designated n8n Webhook node with sub-100ms latency and automatic SSL/TLS handshake.',
      detail: 'Supports test URLs, production endpoints, and custom authentication tokens',
    },
    {
      step: '03',
      title: 'Multi-Branch Routing & AI Scoring',
      icon: GitFork,
      description:
        'n8n evaluates company domain, team scale, and intent parameters, routing high-value prospects through instant AI qualification and Clearbit data enrichment.',
      detail: 'Execute parallel logic branches based on tier, geography, or budget',
    },
    {
      step: '04',
      title: 'Automated CRM & Slack Orchestration',
      icon: Database,
      description:
        'Leads are simultaneously written to Salesforce/HubSpot, assigned to the on-duty account executive, and posted to #enterprise-wins with calendar booking links.',
      detail: 'Zero manual data entry; round-robin rep distribution triggered in real-time',
    },
  ];

  return (
    <section id="architecture" className="py-20 md:py-28 border-b border-neutral-850">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Pipeline Architecture
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-display text-white tracking-tight [text-wrap:balance]">
            From Form Submission to Automated Revenue Action
          </h2>
          <p className="mt-4 text-base text-neutral-400 leading-relaxed">
            Eliminate handoff friction. Every inbound prospect submitted on this page triggers an autonomous execution flow directly inside your self-hosted or cloud n8n instance.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 transition-colors hover:border-neutral-750 hover:bg-neutral-900/70"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-indigo-400">
                      {item.step}
                    </span>
                    <div className="h-9 w-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/80">
                  <div className="text-xs text-neutral-500 font-medium">
                    {item.detail}
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-neutral-700 pointer-events-none">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
