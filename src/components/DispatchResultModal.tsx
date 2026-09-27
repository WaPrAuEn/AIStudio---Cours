import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Copy, Check, Clock, Globe, ArrowRight, ExternalLink } from 'lucide-react';
import { WebhookDispatchResult } from '../types/n8n';

interface DispatchResultModalProps {
  result: WebhookDispatchResult | null;
  onClose: () => void;
  onSendAnother: () => void;
}

export const DispatchResultModal: React.FC<DispatchResultModalProps> = ({
  result,
  onClose,
  onSendAnother,
}) => {
  const [activeTab, setActiveTab] = useState<'response' | 'payload' | 'telemetry'>('response');
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const isSuccess = result.success;

  const handleCopy = async (data: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl text-left my-8">
        {/* Header Status Banner */}
        <div className="flex items-start justify-between pb-5 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${isSuccess ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {isSuccess ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-display text-white">
                  {isSuccess ? 'Webhook Dispatched Successfully' : 'Webhook Execution Failed'}
                </h3>
                <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${isSuccess ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                  HTTP {result.status || 'ERR'}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Clock className="h-3 w-3 text-neutral-500" />
                  {result.latencyMs}ms roundtrip
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[11px] text-neutral-400 truncate max-w-[280px]">
                  {result.webhookUrl}
                </span>
              </div>
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

        {/* Error message if failed */}
        {result.error && (
          <div className="mt-4 rounded-xl border border-rose-800/60 bg-rose-950/30 p-4 text-xs text-rose-200">
            <div className="font-semibold text-rose-300 mb-1">Dispatch Error:</div>
            <div>{result.error}</div>
            <div className="mt-2 text-neutral-400 text-[11px]">
              Tip: If you are using a local n8n instance or an n8n Cloud webhook, make sure the workflow is active or currently listening in test mode.
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="mt-6 flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('response')}
              className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
                activeTab === 'response'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              n8n Response Body
            </button>
            <span className="text-neutral-600">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('payload')}
              className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
                activeTab === 'payload'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Posted Payload
            </button>
            <span className="text-neutral-600">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('telemetry')}
              className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
                activeTab === 'telemetry'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Event Envelope
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              handleCopy(activeTab === 'response' ? result.responseBody : result.requestPayload)
            }
            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-mono text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px]">Copy JSON</span>
              </>
            )}
          </button>
        </div>

        {/* Tab 1: Response */}
        {activeTab === 'response' && (
          <div className="mt-3">
            {result.responseBody?.nodesExecuted && Array.isArray(result.responseBody.nodesExecuted) && (
              <div className="mb-3 rounded-xl border border-neutral-800 bg-neutral-950/70 p-3">
                <div className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Workflow Execution Pipeline
                </div>
                <div className="space-y-1.5">
                  {result.responseBody.nodesExecuted.map((node: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-neutral-200">{node.node}</span>
                      </div>
                      <span className="text-neutral-500 tabular-nums text-[11px]">
                        +{node.executionMs}ms
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs max-h-[260px] overflow-y-auto">
              <pre className="text-emerald-300">
                {JSON.stringify(result.responseBody || { status: result.status, message: result.statusText }, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Dispatched Payload */}
        {activeTab === 'payload' && (
          <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs max-h-[280px] overflow-y-auto">
            <pre className="text-indigo-300">
              {JSON.stringify(result.requestPayload, null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 3: Telemetry Envelope */}
        {activeTab === 'telemetry' && (
          <div className="mt-3 space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-400">Event Identifier</span>
              <span className="text-neutral-200 font-semibold">{result.id}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-400">Timestamp (ISO)</span>
              <span className="text-neutral-200">{result.timestamp}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-400">Dispatch Mode</span>
              <span className="text-neutral-200 uppercase">{result.mode}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-400">Execution Roundtrip</span>
              <span className="text-emerald-400 tabular-nums">{result.latencyMs} ms</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onSendAnother();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <span>Send Another Test</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
