import ApolloService from "../service/apollo";
import KeyStore from "../service/keystore";
import {Request, Response} from "@google-cloud/functions-framework";
import {generateKey} from "../libs/keygen";

export function mainHandler(
  req: Request,
  res: Response,
  keyStore: KeyStore,
  apolloService: ApolloService
) {
  res.send(generateKey());
}
