import React from 'react';

interface FooterProps {
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSettings }) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-850 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-850">
          <div>
            <a href="/" className="text-xl font-bold tracking-tight text-white font-display">
              SyncPulse
            </a>
            <p className="mt-1 text-xs text-neutral-400 max-w-md">
              Enterprise inbound lead automation with sub-100ms structured webhook dispatch directly into n8n workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <a href="#architecture" className="hover:text-neutral-200 transition-colors">
              Architecture
            </a>
            <a href="#capabilities" className="hover:text-neutral-200 transition-colors">
              Capabilities
            </a>
            <a href="#use-cases" className="hover:text-neutral-200 transition-colors">
              Case Studies
            </a>
            <a href="#n8n-integration" className="hover:text-neutral-200 transition-colors">
              n8n Guide
            </a>
            <button
              type="button"
              onClick={onOpenSettings}
              className="hover:text-neutral-200 transition-colors cursor-pointer text-left"
            >
              Configure Webhook
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            &copy; {new Date().getFullYear()} SyncPulse Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>TLS 1.3 Certified</span>
            <span aria-hidden="true">·</span>
            <span>Zero Data Storage Passthrough</span>
            <span aria-hidden="true">·</span>
            <span>n8n Community Compatible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
