/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WebhookConfig, WebhookDispatchResult } from './types/n8n';
import { dispatchToN8n, fetchDispatchHistory, clearDispatchHistory } from './services/webhookService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorkflowSection } from './components/WorkflowSection';
import { CapabilitiesBento } from './components/CapabilitiesBento';
import { InteractiveLeadCapture } from './components/InteractiveLeadCapture';
import { N8nGuideSection } from './components/N8nGuideSection';
import { UseCasesSection } from './components/UseCasesSection';
import { PricingSection } from './components/PricingSection';
import { Footer } from './components/Footer';
import { WebhookConfigModal } from './components/WebhookConfigModal';
import { DispatchResultModal } from './components/DispatchResultModal';
import { DispatchHistoryDrawer } from './components/DispatchHistoryDrawer';

const LOCAL_STORAGE_CONFIG_KEY = 'syncpulse_n8n_config';

export default function App() {
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      url: '',
      mode: 'proxy',
      customHeaders: {},
      authHeaderKey: '',
      authHeaderValue: '',
    };
  });

  const [history, setHistory] = useState<WebhookDispatchResult[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeResult, setActiveResult] = useState<WebhookDispatchResult | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Sync config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(webhookConfig));
    } catch {
      // ignore
    }
  }, [webhookConfig]);

  // Load history on mount
  useEffect(() => {
    fetchDispatchHistory().then((items) => {
      if (items && items.length > 0) {
        setHistory(items);
      }
    });
  }, []);

  const handleSaveConfig = (newConfig: WebhookConfig) => {
    setWebhookConfig(newConfig);
  };

  const handleDispatchComplete = (result: WebhookDispatchResult) => {
    setHistory((prev) => [result, ...prev.slice(0, 49)]);
    setActiveResult(result);
  };

  const handleQuickPing = async (targetUrl?: string, targetMode?: 'proxy' | 'direct') => {
    const urlToUse = targetUrl !== undefined ? targetUrl : webhookConfig.url;
    const modeToUse = targetMode !== undefined ? targetMode : webhookConfig.mode;

    setIsPinging(true);
    const pingPayload = {
      event: 'connection.ping',
      source: 'SyncPulse Webhook Console',
      timestamp: new Date().toISOString(),
      details: {
        message: 'Quick verification ping from SyncPulse landing page.',
        readyForInbound: true,
      },
    };

    try {
      const result = await dispatchToN8n(pingPayload, {
        ...webhookConfig,
        url: urlToUse,
        mode: modeToUse,
      });
      setHistory((prev) => [result, ...prev.slice(0, 49)]);
      setActiveResult(result);
    } finally {
      setIsPinging(false);
    }
  };

  const handleClearHistory = async () => {
    await clearDispatchHistory();
    setHistory([]);
  };

  const scrollToLeadForm = () => {
    const el = document.getElementById('demo-request-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 3-Zone Top Bar */}
      <Navbar
        webhookConfig={webhookConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          webhookConfig={webhookConfig}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onQuickPing={() => handleQuickPing()}
          isPinging={isPinging}
        />

        {/* Mechanism Flow (Editorial Numbering) */}
        <WorkflowSection />

        {/* Core Capabilities Bento Grid */}
        <CapabilitiesBento />

        {/* The Live Interactive Lead Capture with Direct POST to n8n */}
        <InteractiveLeadCapture
          webhookConfig={webhookConfig}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onDispatchComplete={handleDispatchComplete}
        />

        {/* Validated Case Studies & Concrete Adjacency */}
        <UseCasesSection />

        {/* n8n Integration Guide & cURL Spec */}
        <N8nGuideSection onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Transparent Pricing */}
        <PricingSection onSelectTier={scrollToLeadForm} />
      </main>

      {/* Quiet Footer */}
      <Footer onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Modals & Drawers */}
      <WebhookConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={webhookConfig}
        onSave={handleSaveConfig}
        onTestPing={(testUrl, testMode) => handleQuickPing(testUrl, testMode)}
        isPinging={isPinging}
      />

      <DispatchResultModal
        result={activeResult}
        onClose={() => setActiveResult(null)}
        onSendAnother={scrollToLeadForm}
      />

      <DispatchHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => setActiveResult(item)}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
