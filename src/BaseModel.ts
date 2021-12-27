import { IHTTPClient, IPK, IResource, IResourceItem } from "types";
import { Restate } from "@/Restate";
import { CoreModel } from "./CoreModel";

class BaseModel<RI extends IResourceItem = IResourceItem> extends CoreModel {
  private $resource: IResource<RI>;

  private $httpClient: IHTTPClient;

  private $pk: string;

  constructor(private $resourceName: string, private $restate: Restate) {
    super($resourceName, $restate);

    this.$pk = "id";

    this.$httpClient = $restate.httpClient;

    if (!this.$restate.store.has($resourceName)) {
      this.$resource = this.$restate.store.add<RI>($resourceName);
    }
    else {
      this.$resource = this.$restate.store.get<RI>($resourceName);
    }
  }

  public get state(): RI[] {
    return this.$resource.getAll();
  }

  public async index(): Promise<RI[]> {
    const data = await this.$httpClient.get<RI[]>(`/${this.$resourceName}`);

    if (!Array.isArray(data)) {
      throw new TypeError("A resposta da requisição http deve ser um array.");
    }

    data.forEach(item => this.$resource.set(item[this.$pk], item));

    return this.$resource.getAll();
  }

  public async show(id: IPK): Promise<RI | undefined> {
    const item = await this.$httpClient.get<RI>(`/${this.$resourceName}/${id}`);

    if (item !== null && typeof item !== "object") {
      throw new TypeError("A resposta da requisição http deve ser um objeto.");
    }

    this.$resource.set(item[this.$pk], item);

    return this.$resource.get(id);
  }

  public async store(data: Record<string, number | string>): Promise<this> {
    const item = await this.$httpClient.post<RI>(`/${this.$resourceName}`, data);

    if (item !== null && typeof item !== "object") {
      throw new TypeError("A resposta da requisição http deve ser um objeto.");
    }

    this.$resource.set(item[this.$pk], item);

    return this;
  }

  public async update(id: IPK, data: Record<string, number | string>): Promise<boolean> {
    await this.$httpClient.put<RI>(`/${this.$resourceName}/${id}`, data);

    const entries = Object.entries(data);

    for (const [key, val] of entries)
      this.$resource.setProperty(id, key, val);

    return true;
  }

  public async destroy(id: IPK): Promise<boolean> {
    await this.$httpClient.delete<RI>(`/${this.$resourceName}/${id}`);

    this.$resource.delete(id);

    return true;
  }
}

export { BaseModel };
