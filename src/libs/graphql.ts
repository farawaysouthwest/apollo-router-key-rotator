import {gql} from "graphql-request";

export const setRouterSecretQuery = gql`
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
