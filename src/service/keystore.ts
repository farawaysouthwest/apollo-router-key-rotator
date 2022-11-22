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
      const key = generateKey();

      const [version] = await this.keyClient.addSecretVersion({
        parent: this.secretName,
        payload: {data: key},
      });

      return version.name || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getKey(secretVersion: string) {
    try {
      const [version] = await this.keyClient.accessSecretVersion({
        name: secretVersion,
      });

      if (version.payload?.data) return version.payload?.data;

      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
