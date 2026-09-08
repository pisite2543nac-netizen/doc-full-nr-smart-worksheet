"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = exports.FieldValue = exports.bucket = exports.adminAuth = exports.db = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
Object.defineProperty(exports, "FieldValue", { enumerable: true, get: function () { return firestore_1.FieldValue; } });
Object.defineProperty(exports, "Timestamp", { enumerable: true, get: function () { return firestore_1.Timestamp; } });
const auth_1 = require("firebase-admin/auth");
const storage_1 = require("firebase-admin/storage");
if (!(0, app_1.getApps)().length)
    (0, app_1.initializeApp)();
exports.db = (0, firestore_1.getFirestore)();
exports.adminAuth = (0, auth_1.getAuth)();
exports.bucket = (0, storage_1.getStorage)().bucket();
