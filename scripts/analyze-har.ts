import { analyzeAllHarFiles } from '../src/utils/har-utils';
import { logStep } from '../src/utils/logger';

logStep('INFO: Run HAR performance analysis');

const anomalies = analyzeAllHarFiles({ maxDurationMs: 2000, maxPayloadBytes: 1_048_576 });

if (anomalies.length > 0) {
  logStep(`FAIL: ${anomalies.length} anomaly(s) detected`);
  process.exit(1);
}

logStep('PASS: No performance anomalies');
process.exit(0);
