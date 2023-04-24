import { GraphQLClient } from "graphql-request";
import { setRouterSecretQuery } from "../libs/graphql";
import { OrderStatus, SecretInput } from "../libs/operations-types";

/// Types ///
interface ApolloServiceOptions {
  baseURL: string;
  apolloKey: string;
  graphId: string;
  graphVariant: string;
}

/// Service Class ///
export default class ApolloService {
  private client: GraphQLClient;
  private graphId: string;
  private graphVariant: string;

  constructor({
    apolloKey,
    baseURL,
    graphId,
    graphVariant,
  }: ApolloServiceOptions) {
    this.graphId = graphId;
    this.graphVariant = graphVariant;
    this.client = new GraphQLClient(baseURL, {
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
  public async setSupergraphKey(key: SecretInput) {
    return await this.client.request<OrderStatus>(setRouterSecretQuery, {
      graphId: this.graphId,
      name: this.graphVariant,
      input: key,
    });
  }
}
