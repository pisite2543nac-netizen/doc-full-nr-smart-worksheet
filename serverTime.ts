import { httpsCallable } from 'firebase/functions';
import { functions, demoMode } from '../lib/firebase';
let cached: Promise<number> | null = null;
export function getServerOffsetMs(): Promise<number> {
  if (demoMode || !functions) return Promise.resolve(0);
  if (!cached) cached = (async () => {
    const started = Date.now();
    const fn = httpsCallable<undefined, { serverTime: number }>(functions, 'getServerTime');
    const res = await fn();
    const ended = Date.now();
    const midpoint = started + (ended - started) / 2;
    return res.data.serverTime - midpoint;
  })().catch(() => 0);
  return cached;
}
