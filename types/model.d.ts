import { IHTTPClient, IPK, IResource, IResourceItem } from ".";
import { Restate } from "@/Restate";

export declare class Model<RI extends IResourceItem = IResourceItem> {
  private $resource: IResource<RI>;

  private $httpClient: IHTTPClient;

  private $pk: string;

  constructor(private $resourceName: string, private $restate: Restate)

  public get state(): RI[];

  public async index(): Promise<RI[]>

  public async show(id: IPK): Promise<RI | undefined>

  public async store(data: Record<string, number | string>): Promise<this>

  public async update(id: IPK, data: Record<string, number | string>): Promise<boolean>

  public async destroy(id: IPK): Promise<boolean>
}
