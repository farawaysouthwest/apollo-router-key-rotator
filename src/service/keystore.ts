import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {generateKey} from "../libs/keygen";

export default class KeyStore {
  private keyClient: SecretManagerServiceClient;
  private secretName: string;

  constructor(keyClient: SecretManagerServiceClient, secretName: string) {
    this.keyClient = keyClient;
    this.secretName = secretName;
  }

  public async rotateKey() {
    try {
      // generate new key value.
      const key = generateKey();

      // create new version in key vault, add value.
      const [version] = await this.keyClient.addSecretVersion({
        parent: this.secretName,
        payload: {data: key},
      });

      // return full version name
      return key;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
