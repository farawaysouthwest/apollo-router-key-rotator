"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const keygen_1 = require("../libs/keygen");
class KeyStore {
    constructor(keyClient, secretName) {
        this.keyClient = keyClient;
        this.secretName = secretName;
    }
    rotateKey() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // generate new key value.
                const key = (0, keygen_1.generateKey)();
                // create new version in key vault, add value.
                const [version] = yield this.keyClient.addSecretVersion({
                    parent: this.secretName,
                    payload: { data: key },
                });
                // return full version name
                return key;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
}
exports.default = KeyStore;
