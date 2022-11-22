import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {generateKey} from "../libs/keygen";

export default class KeyStore {
  private keyClient: SecretManagerServiceClient;
  private secretName: string;

  constructor(keyClient: SecretManagerServiceClient, secretName: string) {
    this.keyClient = keyClient;
    this.secretName = secretName;
  }

  public async rotatekey() {
    try {
      // generate new key value.
      const key = generateKey();

      // create new version in key vault, add value.
      const [version] = await this.keyClient.addSecretVersion({
        parent: this.secretName,
        payload: {data: key},
      });

      // return full version name
      return version.name || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getKey(secretVersion: string) {
    try {
      // get secret value.
      const [version] = await this.keyClient.accessSecretVersion({
        name: secretVersion,
      });

      // return payload.
      if (version.payload?.data) return version.payload?.data;

      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
