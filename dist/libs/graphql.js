"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRouterSecretQuery = void 0;
const graphql_request_1 = require("graphql-request");
exports.setRouterSecretQuery = (0, graphql_request_1.gql) `
  mutation SetSecrets(
    $input: RouterSecretsInput!
    $name: String!
    $graphId: ID!
  ) {
    graph(id: $graphId) {
      variant(name: $name) {
        router {
          setSecrets(input: $input) {
            ... on RouterSecretsSuccess {
              order {
                status
              }
            }
          }
        }
      }
    }
  }
`;
