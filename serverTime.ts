import { onCall } from 'firebase-functions/v2/https';
import { requireActive } from './auth';
export const getServerTime=onCall({region:'asia-southeast1'},async req=>{await requireActive(req);return {serverTime:Date.now()};});
