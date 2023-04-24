import { gql } from "graphql-request";

export const setRouterSecretQuery = gql`
  mutation setSecrets(
    $graphId: ID!
    $name: String!
    $input: RouterSecretsInput!
  ) {
    graph(id: $graphId) {
      variant(name: $name) {
        router {
          setSecrets(input: $input) {
            ... on RouterSecretsSuccess {
              secrets {
                createdAt
                name
              }
            }
          }
        }
      }
    }
  }
`;
