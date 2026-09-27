import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface WebhookDispatchRecord {
  id: string;
  timestamp: string;
  webhookUrl: string;
  mode: 'proxy' | 'simulate' | 'direct';
  status: number;
  statusText: string;
  latencyMs: number;
  success: boolean;
  requestPayload: any;
  responseBody: any;
  error?: string;
}

const dispatchHistory: WebhookDispatchRecord[] = [];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'SyncPulse n8n Dispatcher',
      timestamp: new Date().toISOString(),
      historyCount: dispatchHistory.length,
    });
  });

  // Post to n8n Webhook Proxy
  app.post('/api/n8n/dispatch', async (req: Request, res: Response) => {
    const { webhookUrl, payload, customHeaders = {}, mode = 'proxy' } = req.body;
    const startTime = performance.now();
    const eventId = 'ev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);

    // If simulate mode or empty webhook URL
    if (mode === 'simulate' || !webhookUrl || typeof webhookUrl !== 'string' || webhookUrl.trim() === '') {
      const simulatedLatency = Math.floor(Math.random() * 80) + 75; // 75ms - 155ms
      const record: WebhookDispatchRecord = {
        id: eventId,
        timestamp: new Date().toISOString(),
        webhookUrl: webhookUrl || 'https://demo-n8n.internal.syncpulse.io/webhook/lead-intake',
        mode: 'simulate',
        status: 200,
        statusText: 'OK (Simulated n8n Workflow)',
        latencyMs: simulatedLatency,
        success: true,
        requestPayload: payload,
        responseBody: {
          message: 'Workflow was started successfully',
          executionId: 'exec_' + Math.random().toString(36).substring(2, 10),
          workflowName: 'Inbound Demo Qualification & Routing',
          status: 'success',
          executionTimeMs: simulatedLatency,
          receivedData: {
            contact: payload?.lead?.email || 'test@example.com',
            company: payload?.lead?.company || 'Acme Corp',
            priorityTier: (payload?.lead?.teamSize && parseInt(payload?.lead?.teamSize) > 50) ? 'Tier 1 - Strategic' : 'Standard Inbound',
          },
          nodesExecuted: [
            { node: 'n8n Webhook Intake', status: 'success', executionMs: 8 },
            { node: 'Validate & Deduplicate', status: 'success', executionMs: 14 },
            { node: 'Enrich via Clearbit/Apollo', status: 'success', executionMs: 38 },
            { node: 'Score Lead (AI Classifier)', status: 'success', executionMs: 25 },
            { node: 'Post Slack Alert #revenue-ops', status: 'success', executionMs: 19 },
            { node: 'Create CRM Opportunity', status: 'success', executionMs: 22 },
          ],
        },
      };

      dispatchHistory.unshift(record);
      if (dispatchHistory.length > 50) dispatchHistory.pop();

      return res.status(200).json(record);
    }

    // Proxy mode: Forward directly to real n8n instance
    try {
      const headersToSend: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'SyncPulse-LandingPage-Webhook/1.0',
        ...customHeaders,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: headersToSend,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - startTime);

      let responseData: any;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch {
          responseData = { message: 'Received non-JSON content' };
        }
      } else {
        const text = await response.text();
        responseData = text || { message: response.statusText || 'Response received' };
      }

      const record: WebhookDispatchRecord = {
        id: eventId,
        timestamp: new Date().toISOString(),
        webhookUrl: webhookUrl.trim(),
        mode: 'proxy',
        status: response.status,
        statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
        latencyMs,
        success: response.ok,
        requestPayload: payload,
        responseBody: responseData,
      };

      dispatchHistory.unshift(record);
      if (dispatchHistory.length > 50) dispatchHistory.pop();

      return res.status(response.status).json(record);
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      const errorMessage = err?.name === 'AbortError'
        ? 'Request timed out after 15 seconds. Ensure your n8n instance is accessible and responding.'
        : err?.message || 'Failed to reach n8n webhook URL';

      const record: WebhookDispatchRecord = {
        id: eventId,
        timestamp: new Date().toISOString(),
        webhookUrl: webhookUrl.trim(),
        mode: 'proxy',
        status: 502,
        statusText: 'Bad Gateway / Connection Failed',
        latencyMs,
        success: false,
        requestPayload: payload,
        responseBody: null,
        error: errorMessage,
      };

      dispatchHistory.unshift(record);
      if (dispatchHistory.length > 50) dispatchHistory.pop();

      return res.status(502).json(record);
    }
  });

  // History query
  app.get('/api/n8n/history', (req: Request, res: Response) => {
    res.json({
      history: dispatchHistory,
      total: dispatchHistory.length,
    });
  });

  // Clear history
  app.delete('/api/n8n/history', (req: Request, res: Response) => {
    dispatchHistory.length = 0;
    res.json({ success: true, message: 'History cleared' });
  });

  // Integrate Vite for development or static build for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SyncPulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
