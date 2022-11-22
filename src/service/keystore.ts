import {SecretManagerServiceClient} from "@google-cloud/secret-manager";

export default class KeyStore {
  private keyClient: SecretManagerServiceClient;

  constructor(keyClient: SecretManagerServiceClient) {
    this.keyClient = keyClient;
  }
}
