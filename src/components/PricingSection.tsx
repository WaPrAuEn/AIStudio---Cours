import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectTier: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectTier }) => {
  const tiers = [
    {
      name: 'Developer Sandbox',
      price: '$0',
      period: 'forever free',
      description: 'Ideal for configuring, testing, and verifying local or cloud n8n workflows.',
      features: [
        'Unlimited webhook payload simulations',
        'Direct browser client & server proxy dispatch',
        'cURL command spec export',
        'Interactive payload inspector',
        'Community workflow templates',
      ],
      cta: 'Test Live Sandbox Now',
      highlighted: false,
    },
    {
      name: 'Production Pipeline',
      price: '$79',
      period: 'per month',
      description: 'Built for scaling demand gen teams with multi-region delivery redundancy.',
      features: [
        'Up to 100,000 monthly webhook dispatches',
        'Automated exponential retry on 5xx failures',
        'HMAC SHA-256 webhook signature validation',
        'Sub-80ms mean global routing latency',
        'Real-time Slack failure alerts',
      ],
      cta: 'Deploy Production Pipeline',
      highlighted: true,
    },
    {
      name: 'Enterprise Dedicated',
      price: 'Custom',
      period: 'annual agreement',
      description: 'Dedicated air-gapped infrastructure with zero-log customer data agreements.',
      features: [
        'Unlimited payload volume',
        'Air-gapped on-premises or VPC deployment',
        'Custom mTLS mutual authentication',
        '99.99% contractual uptime SLA',
        'Dedicated Solutions Architect for n8n',
      ],
      cta: 'Contact Solutions Engineering',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 border-b border-neutral-850">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Predictable Pricing
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-display text-white tracking-tight [text-wrap:balance]">
            Transparent Infrastructure for Every Scale
          </h2>
          <p className="mt-4 text-base text-neutral-400 leading-relaxed">
            Start immediately in the sandbox without a credit card, or scale with enterprise-grade SLA backing.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all ${
                tier.highlighted
                  ? 'border-2 border-indigo-500 bg-neutral-900/90 shadow-2xl shadow-indigo-600/10 relative'
                  : 'border border-neutral-800 bg-neutral-900/40 hover:border-neutral-750'
              }`}
            >
              <div>
                {tier.highlighted && (
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
                    Most Popular for Revenue Teams
                  </div>
                )}
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {tier.name}
                </h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  {tier.description}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold font-display text-white tabular-nums tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-xs text-neutral-400">{tier.period}</span>
                </div>

                <div className="mt-8 space-y-3 border-t border-neutral-800/80 pt-6">
                  {tier.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={onSelectTier}
                  className={`w-full rounded-xl py-3 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    tier.highlighted
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500'
                      : 'border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-750 hover:text-white'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
