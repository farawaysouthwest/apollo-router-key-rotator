import axios, {Axios, HeadersDefaults} from "axios";

export default class ApolloService {
  private client: Axios;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }
}
