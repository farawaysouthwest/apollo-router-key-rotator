"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = void 0;
const crypto_1 = require("crypto");
function generateKey(size = 32) {
    const buffer = (0, crypto_1.randomBytes)(size);
    return buffer.toString("hex");
}
exports.generateKey = generateKey;
