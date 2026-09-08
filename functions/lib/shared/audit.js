"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = audit;
const firebase_1 = require("./firebase");
async function audit(actor, action, entityType, entityId, detail = {}) { await firebase_1.db.collection('auditLogs').add({ actorUid: actor.uid, actorRole: actor.role, action, entityType, entityId, detail, createdAt: firebase_1.FieldValue.serverTimestamp() }); }
