import fs from 'fs';
import path from 'path';
import { logStep } from './logger';

interface HarEntry {
  request: { method: string; url: string; bodySize?: number };
  response: { status: number; content?: { size?: number } };
  time?: number;
}

interface HarFile {
  log: { entries: HarEntry[] };
}

export interface HarAnomaly {
  readonly type: 'slow' | 'large-payload' | 'error-status';
  readonly method: string;
  readonly url: string;
  readonly value: number;
  readonly threshold: number;
}

interface AnalyzeOptions {
  readonly maxDurationMs?: number;
  readonly maxPayloadBytes?: number;
}

const DEFAULT_MAX_DURATION_MS = 2000;
const DEFAULT_MAX_PAYLOAD_BYTES = 1_048_576;

export const HAR_DIR = path.resolve('reports', 'har');

export const analyzeHar = (harPath: string, options?: AnalyzeOptions): HarAnomaly[] => {
  const maxDuration = options?.maxDurationMs ?? DEFAULT_MAX_DURATION_MS;
  const maxPayload = options?.maxPayloadBytes ?? DEFAULT_MAX_PAYLOAD_BYTES;

  if (!fs.existsSync(harPath)) {
    logStep(`WARN: HAR file not found at ${harPath}`);
    return [];
  }

  const raw = fs.readFileSync(harPath, 'utf-8');
  const har: HarFile = JSON.parse(raw);
  const anomalies: HarAnomaly[] = [];

  for (const entry of har.log.entries) {
    const { method, url } = entry.request;
    const shortUrl = url.replace(/https?:\/\/[^/]+/, '');
    const duration = entry.time ?? 0;
    const payloadSize = entry.response?.content?.size ?? 0;
    const status = entry.response?.status ?? 0;

    if (duration > maxDuration) {
      anomalies.push({ type: 'slow', method, url: shortUrl, value: Math.round(duration), threshold: maxDuration });
    }

    if (payloadSize > maxPayload) {
      anomalies.push({ type: 'large-payload', method, url: shortUrl, value: payloadSize, threshold: maxPayload });
    }

    if (status >= 500) {
      anomalies.push({ type: 'error-status', method, url: shortUrl, value: status, threshold: 500 });
    }
  }

  if (anomalies.length > 0) {
    logStep(`WARN: ${anomalies.length} anomaly(s) found`);
    for (const a of anomalies) {
      if (a.type === 'slow') logStep(`  ⚠ SLOW: ${a.method} ${a.url} ${a.value}ms (limit: ${a.threshold}ms)`);
      else if (a.type === 'large-payload') logStep(`  ⚠ LARGE: ${a.method} ${a.url} ${(a.value / 1024).toFixed(1)}KB`);
      else logStep(`  ⚠ ERROR: ${a.method} ${a.url} status ${a.value}`);
    }
  } else {
    logStep('PASS: No anomalies detected');
  }

  return anomalies;
};

export const analyzeAllHarFiles = (options?: AnalyzeOptions): HarAnomaly[] => {
  if (!fs.existsSync(HAR_DIR)) return [];

  const harFiles = fs.readdirSync(HAR_DIR).filter((f) => f.endsWith('.har'));
  const allAnomalies: HarAnomaly[] = [];

  for (const file of harFiles) {
    logStep(`INFO: Analyzing ${file}`);
    allAnomalies.push(...analyzeHar(path.join(HAR_DIR, file), options));
  }

  logStep(`INFO: Total anomalies: ${allAnomalies.length} across ${harFiles.length} file(s)`);
  return allAnomalies;
};
