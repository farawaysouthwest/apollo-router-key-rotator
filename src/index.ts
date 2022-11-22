import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {mainHandler} from "./controller/controller";
import ApolloService from "./service/apollo";
import KeyStore from "./service/keystore";

const secretClient = new SecretManagerServiceClient();

// create layers
const keyStore = new KeyStore(secretClient);
const apolloService = new ApolloService("test");

export function main(req: any, res: any) {
  mainHandler(req, res, keyStore, apolloService);
}
