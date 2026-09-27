import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const caseStudies = [
    {
      company: 'OmniVanguard Logistics',
      metric: '+142%',
      metricLabel: 'Inbound Response Velocity in 90 Days',
      summary:
        'Replaced 4 disconnected Zapier zaps with a single resilient n8n webhook workflow. High-intent freight quote requests are parsed, matched with fleet capacity, and messaged to dispatchers in 800 milliseconds.',
      quote:
        'SyncPulse eliminated our 15-minute lead drop-off window entirely. Inbound leads are in our reps Slack channels before the prospect even closes their browser tab.',
      author: 'David K., Head of Revenue Operations at OmniVanguard',
    },
    {
      company: 'AeroCloud Security',
      metric: '$2.8M',
      metricLabel: 'Sourced Pipeline Routed Autonomously',
      summary:
        'Evaluated company size and tech stack directly via n8n multi-branch conditions. Accounts above 500 employees get routed directly into Account Executive calendars with customized prep dossiers.',
      quote:
        'Having our demo landing page post directly into n8n gave our engineering team complete auditability without paying thousands of dollars for proprietary form aggregators.',
      author: 'Claire Martin, VP of Demand Generation at AeroCloud',
    },
  ];

  return (
    <section id="use-cases" className="py-20 md:py-28 border-b border-neutral-850">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Validated Outcomes
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-display text-white tracking-tight [text-wrap:balance]">
            Proven Across High-Volume Revenue Teams
          </h2>
          <p className="mt-4 text-base text-neutral-400 leading-relaxed">
            See how modern B2B organizations eliminate pipeline latency with deterministic webhook delivery.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study) => (
            <div
              key={study.company}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 flex flex-col justify-between hover:border-neutral-750 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                  <span className="text-base font-bold text-white tracking-tight">
                    {study.company}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Production Case Study</span>
                </div>

                <div className="mt-6">
                  <div className="text-4xl sm:text-5xl font-extrabold font-display text-white tabular-nums tracking-tight">
                    {study.metric}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-indigo-400">
                    {study.metricLabel}
                  </div>
                </div>

                <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
                  {study.summary}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800/80">
                <blockquote className="text-xs italic text-neutral-400 leading-relaxed">
                  &ldquo;{study.quote}&rdquo;
                </blockquote>
                <div className="mt-3 text-xs font-medium text-neutral-300">
                  {study.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
