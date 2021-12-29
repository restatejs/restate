import { CoreModel } from "@/models/CoreModel";
import { Restate } from "@/Restate";

import {
  IHTTPClient,
  IPK,
  IResource,
  IResourceCollection,
  IResourceItem,
} from ".";

export interface HTTPConfig {
  url: string;
}

export interface HTTPResponse<R extends IResourceItem | IResourceCollection> {
  data: R;
  meta: Record<string, unknown>;
}

export type HTTPResponseItem<RI extends IResourceItem> = HTTPResponse<RI>;

export type HTTPResponseCollection<RI extends IResourceItem> = HTTPResponse<
  IResourceCollection<RI>
>;

export interface MethodOptions<
  RI extends IResourceItem,
  R extends IResourceItem | IResourceCollection
> {
  query?: Record<string, string>;
  store?: (resource: IResource<RI>, response: HTTPResponse<R>) => void;
}

export interface IndexOptions<RI extends IResourceItem>
  extends MethodOptions<RI, IResourceCollection<RI>> {
  merge?: boolean;
}

export type ShowOptions<RI> = MethodOptions<RI, RI>;

export type StoreOptions<RI> = MethodOptions<RI, RI>;

export type UpdateOptions<RI> = MethodOptions<RI, RI>;

export interface DestroyOptions<RI> extends MethodOptions<RI, never> {
  store?: (resource: IResource<RI>) => void;
}

export declare class BaseModel<
  RI extends IResourceItem = IResourceItem
> extends CoreModel {
  private $resource: IResource<RI>;

  private $httpClient: IHTTPClient;

  private $pk: string;

  constructor(private $resourceName: string, private $restate: Restate);

  public async index(
    options?: IndexOptions<RI>
  ): Promise<IResourceCollection<RI>>;

  public async show(
    id: IPK,
    options?: ShowOptions<RI>
  ): Promise<RI | undefined>;

  public async store(
    data: Partial<RI>,
    options?: StoreOptions<RI>
  ): Promise<boolean>;

  public async update(
    id: IPK,
    data: Partial<RI>,
    options?: UpdateOptions<RI>
  ): Promise<boolean>;

  public async destroy(id: IPK, options?: DestroyOptions<RI>): Promise<boolean>;
}
