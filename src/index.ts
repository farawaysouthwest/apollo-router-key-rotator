import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {Request, Response} from "@google-cloud/functions-framework";
import ApolloService from "./service/apollo";
import KeyStore from "./service/keystore";

const apolloKey = process.env.APOLLO_KEY || "";
const apolloUri = process.env.APOLLO_API_URI || "";
const graphId = process.env.GRAPH_ID || "";
const graphVariant = process.env.GRAPH_VARIANT || "";
const secretName = process.env.SECRET_NAME || "";

// create layers
const secretClient = new SecretManagerServiceClient();
const keyStore = new KeyStore(secretClient, secretName);
const apolloService = new ApolloService({
  apolloKey,
  baseURL: apolloUri,
  graphId,
  graphVariant,
});

export async function main(req: Request, res: Response) {
  try {
    // create new key and load to key vault.
    const version = await keyStore.rotateKey();

    // send new key to Apollo.
    if (version) {
      console.log(`version: ${version}`);

      const status = await apolloService.setSupergraphKey({
        secrets: [{name: "SUPERGRAPH_API_KEY", value: version}],
      });

      res.status(200).send({
        RouterSecret: status,
      });
    }
    if (!version) throw new Error("error creating secret");
  } catch (error) {
    console.error(error);
    res.status(500).send((error as Error).message);
  }
}
