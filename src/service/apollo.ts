import {GraphQLClient} from "graphql-request";
import {setRouterSecretQuery} from "../libs/graphql";

/// Types ///
interface ApolloServiceOptions {
  baseURL: string;
  apolloKey: string;
  graphId: string;
  graphVariant: string;
}

interface SecretsInput {
  secrets: [
    {
      name: string;
      value: string;
    }
  ];
}
interface OrderStatus {
  order: OrderStatusEnum;
}

enum OrderStatusEnum {
  PENDING,
  COMPLETED,
  ROLLING_BACK,
  ERRORED,
  SUPERSEDED,
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
  public async setSupergraphKey(key: SecretsInput) {
    return await this.client.request<OrderStatus>(setRouterSecretQuery, {
      id: this.graphId,
      name: this.graphVariant,
      input: key,
    });
  }
}
