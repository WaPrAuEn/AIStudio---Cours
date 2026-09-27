import React from 'react';
import { ShieldCheck, Cpu, Code2, Gauge, Zap, Network } from 'lucide-react';

export const CapabilitiesBento: React.FC = () => {
  return (
    <section id="capabilities" className="py-20 md:py-28 border-b border-neutral-850">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Engine Specifications
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-display text-white tracking-tight [text-wrap:balance]">
            Precision Engineering for Mission-Critical Lead Pipelines
          </h2>
          <p className="mt-4 text-base text-neutral-400 leading-relaxed">
            Built for engineering leaders and revenue operations specialists who demand predictable, auditable, and resilient webhook dispatch.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: 2-column span */}
          <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 hover:border-neutral-750 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Universal n8n Compatibility &amp; Tunnel Resiliency
                </h3>
                <div className="text-xs text-neutral-400">
                  Self-hosted Docker, n8n Cloud, Kubernetes, or local tunneling
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-neutral-300 leading-relaxed max-w-2xl">
              Connect effortlessly to any n8n instance. Our dispatcher seamlessly handles CORS constraints via server-side proxying, supports custom authentication headers (<code className="font-mono text-xs bg-neutral-800 px-1.5 py-0.5 rounded text-indigo-300">X-N8N-API-KEY</code> or <code className="font-mono text-xs bg-neutral-800 px-1.5 py-0.5 rounded text-indigo-300">Authorization: Bearer</code>), and works seamlessly with active webhook test modes.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-800/80">
              <div>
                <div className="font-mono text-xs text-neutral-400 font-semibold uppercase">
                  Protocols
                </div>
                <div className="mt-1 text-sm font-medium text-neutral-200">
                  HTTP/1.1 &amp; HTTP/2 POST
                </div>
              </div>
              <div>
                <div className="font-mono text-xs text-neutral-400 font-semibold uppercase">
                  Authentication
                </div>
                <div className="mt-1 text-sm font-medium text-neutral-200">
                  Bearer Token, Header Auth, None
                </div>
              </div>
              <div>
                <div className="font-mono text-xs text-neutral-400 font-semibold uppercase">
                  Timeout Threshold
                </div>
                <div className="mt-1 text-sm font-medium text-neutral-200">
                  15s Abort with graceful fail
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 1-column span */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 hover:border-neutral-750 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Deterministic JSON Spec
              </h3>
            </div>
            <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
              Every dispatched event strictly conforms to a predictable JSON contract. Access lead attributes, corporate domains, and session telemetry without parsing anomalies.
            </p>
            <div className="mt-6 rounded-lg bg-neutral-950 p-3 border border-neutral-850 font-mono text-[11px] text-neutral-400">
              <span className="text-indigo-400">&#123;</span>
              <br />
              &nbsp;&nbsp;&quot;event&quot;: &quot;lead.demo_requested&quot;,
              <br />
              &nbsp;&nbsp;&quot;lead&quot;: &#123; &quot;company&quot;, &quot;email&quot; &#125;,
              <br />
              &nbsp;&nbsp;&quot;context&quot;: &#123; &quot;origin&quot;, &quot;referrer&quot; &#125;
              <br />
              <span className="text-indigo-400">&#125;</span>
            </div>
          </div>

          {/* Card 3: 1-column span */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 hover:border-neutral-750 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Gauge className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Live Response Telemetry
              </h3>
            </div>
            <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
              Immediate inspection modal displays HTTP status codes, millisecond latency metrics, and parsed execution outputs returned directly by the n8n execution pipeline.
            </p>
            <div className="mt-6 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800 pt-4 font-mono">
              <span>Mean roundtrip:</span>
              <span className="text-emerald-400 font-semibold tabular-nums">78ms - 110ms</span>
            </div>
          </div>

          {/* Card 4: 2-column span */}
          <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 hover:border-neutral-750 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Pass-Through Architecture &amp; Zero Persistent Intermediate Storage
                </h3>
                <div className="text-xs text-neutral-400">
                  Strict confidentiality compliant with enterprise security standards
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
              Sensitive customer inquiries flow directly to your designated automation target over encrypted TLS 1.3 channels. No third-party data broker storage, no unencrypted transit caches, and no tracking scripts. You maintain 100% data sovereignty inside your own n8n workflows.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 pt-6 border-t border-neutral-800/80 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Zero Database Residue</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" />
                <span>Isolated Worker Proxies</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>GDPR &amp; SOC-2 Aligned Invariants</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
