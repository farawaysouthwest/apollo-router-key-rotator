import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Request, Response } from "@google-cloud/functions-framework";
import ApolloService from "./service/apollo";
import KeyStore from "./service/keystore";
import { createLogger, transports } from "winston";

const apolloKey = process.env.APOLLO_KEY || "";
const apolloUri = process.env.APOLLO_API_URI || "";
const graphId = process.env.GRAPH_ID || "";
const graphVariant = process.env.GRAPH_VARIANT || "";
const secretName = process.env.SECRET_NAME || "";

// create layers
const consoleTransport = new transports.Console();

const logger = createLogger({
  transports: [consoleTransport],
  exceptionHandlers: [consoleTransport],
});
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
      const { secrets } = await apolloService.setSupergraphKey({
        name: "SUPERGRAPH_API_KEY",
        value: version,
      });

      logger.info({
        status: "key rotation complete",
        hash: secrets[0].hash,
      });
      res.status(200).send({
        status: secrets[0].hash,
      });
      return;
    }

    // throw error if key can't be created.
    throw new Error("error creating secret");
  } catch (error) {
    logger.error(error);
    res.status(500).send((error as Error).message);
  }
}
