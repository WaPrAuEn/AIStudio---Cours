import React from 'react';
import { X, Trash2, Clock, CheckCircle2, AlertCircle, ArrowUpRight, ExternalLink } from 'lucide-react';
import { WebhookDispatchResult } from '../types/n8n';

interface DispatchHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: WebhookDispatchResult[];
  onSelectResult: (result: WebhookDispatchResult) => void;
  onClearHistory: () => void;
}

export const DispatchHistoryDrawer: React.FC<DispatchHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
      <div className="relative h-full w-full max-w-md bg-neutral-900 border-l border-neutral-800 p-6 flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              Webhook Dispatch Log
            </h3>
            <div className="text-xs text-neutral-400">
              {history.length} {history.length === 1 ? 'event' : 'events'} recorded in session
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List of dispatches */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
              <Clock className="h-10 w-10 stroke-1 mb-2 text-neutral-600" />
              <div className="text-sm font-medium text-neutral-400">No Webhook Events Yet</div>
              <div className="text-xs text-neutral-500 mt-1 max-w-xs">
                Submit the lead capture form or click Quick Ping to send your first event to n8n.
              </div>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectResult(item)}
                className="w-full text-left rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 hover:border-indigo-500/60 hover:bg-neutral-950 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.success ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span className="font-mono text-xs font-semibold text-neutral-200">
                      HTTP {item.status}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-400 tabular-nums">
                    {item.latencyMs}ms
                  </span>
                </div>

                <div className="mt-2 text-xs font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                  {item.requestPayload?.nom || item.requestPayload?.event || 'Ping Event'}
                  {item.requestPayload?.entreprise && ` · ${item.requestPayload.entreprise}`}
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span className="truncate max-w-[200px]">{item.webhookUrl}</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Event Log</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-neutral-800 px-3.5 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-750 hover:text-white transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
