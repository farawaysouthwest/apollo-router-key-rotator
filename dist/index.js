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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const secret_manager_1 = require("@google-cloud/secret-manager");
const apollo_1 = __importDefault(require("./service/apollo"));
const keystore_1 = __importDefault(require("./service/keystore"));
const apolloKey = process.env.APOLLO_KEY || "";
const apolloUri = process.env.APOLLO_API_URI || "";
const graphId = process.env.GRAPH_ID || "";
const graphVariant = process.env.GRAPH_VARIANT || "";
const secretName = process.env.SECRET_NAME || "";
// create layers
const secretClient = new secret_manager_1.SecretManagerServiceClient();
const keyStore = new keystore_1.default(secretClient, secretName);
const apolloService = new apollo_1.default({
    apolloKey,
    baseURL: apolloUri,
    graphId,
    graphVariant,
});
function main(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // create new key and load to key vault.
            const version = yield keyStore.rotateKey();
            // send new key to Apollo.
            if (version) {
                console.log(`version: ${version}`);
                const status = yield apolloService.setSupergraphKey({
                    secrets: [{ name: "SUPERGRAPH_API_KEY", value: version }],
                });
                res.status(200).send({
                    RouterSecret: status,
                });
            }
            if (!version)
                throw new Error("error creating secret");
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    });
}
exports.main = main;
