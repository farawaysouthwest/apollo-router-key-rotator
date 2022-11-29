import {assert, expect} from "chai";
import {GraphQLClient, Variables} from "graphql-request";
import {describe, it} from "mocha";
import {restore, reset, stub} from "sinon";
import {setRouterSecretQuery} from "../../libs/graphql";
import ApolloService from "../../service/apollo";

describe("Apollo Service", () => {
  // data
  const graphId = "testGraph";
  const graphVariant = "testVariant";
  const baseURL = "testUrl";
  const apolloKey = "testKey";

  // mocks

  const mockRequest = stub(GraphQLClient.prototype, "request");

  let service: ApolloService;

  before(
    () =>
      (service = new ApolloService({
        apolloKey,
        baseURL,
        graphId,
        graphVariant,
      }))
  );

  after(() => restore());

  afterEach(() => reset());

  it("Test setSupergraphKey", async () => {
    const result = await service.setSupergraphKey({
      secrets: [{name: "test", value: "testval"}],
    });

    assert.equal(mockRequest.calledOnce, true);
  });
});
