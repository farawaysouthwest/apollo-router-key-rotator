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
const graphql_request_1 = require("graphql-request");
const graphql_1 = require("../libs/graphql");
var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum[OrderStatusEnum["PENDING"] = 0] = "PENDING";
    OrderStatusEnum[OrderStatusEnum["COMPLETED"] = 1] = "COMPLETED";
    OrderStatusEnum[OrderStatusEnum["ROLLING_BACK"] = 2] = "ROLLING_BACK";
    OrderStatusEnum[OrderStatusEnum["ERRORED"] = 3] = "ERRORED";
    OrderStatusEnum[OrderStatusEnum["SUPERSEDED"] = 4] = "SUPERSEDED";
})(OrderStatusEnum || (OrderStatusEnum = {}));
/// Service Class ///
class ApolloService {
    constructor({ apolloKey, baseURL, graphId, graphVariant, }) {
        this.graphId = graphId;
        this.graphVariant = graphVariant;
        this.client = new graphql_request_1.GraphQLClient(baseURL, {
            headers: {
                "Content-Type": "application/json",
                "apollographql-client-name": "supergraph-key-rotator",
                "apollographql-client-version": process.env.VERSION || "1.0",
                "X-API-KEY": apolloKey,
            },
        });
    }
    /**
     * Send supergraph key to Apollo Router
     */
    setSupergraphKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`### key: ${key.secrets[0].value}`);
            return yield this.client.request(graphql_1.setRouterSecretQuery, {
                graphId: this.graphId,
                name: this.graphVariant,
                input: key,
            });
        });
    }
}
exports.default = ApolloService;
