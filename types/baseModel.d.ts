import { IPK, IResource, IResourceItem } from "types";

import { Restate, CoreModel } from "@/index";

export interface HTTPConfig {
  url: string;
}

export interface HTTPResponse<R extends Object | []> {
  data: R;
  meta: Record<string, unknown>;
}

export type HTTPResponseItem<RI> = HTTPResponse<RI>;

export type HTTPResponseCollection<RI> = HTTPResponse<
  RI[]
>;

export interface IndexOptions<RI> {
  query?: Record<string, string>;
  store?: (resource: IResource<RI>, response: HTTPResponse<R>) => void;
  merge?: boolean;
}

export type ShowOptions<RI> = {
  query?: Record<string, string>;
  store?: (resource: IResource<RI>, response: HTTPResponse<R>) => void;
};

export type StoreOptions<RI> = {
  query?: Record<string, string>;
  store?: (resource: IResource<RI>, response: HTTPResponse<R>) => void;
};

export type UpdateOptions<RI> = {
  query?: Record<string, string>;
  store?: (resource: IResource<RI>, response: HTTPResponse<R>) => void;
};

export interface DestroyOptions<RI> {
  query?: Record<string, string>;
  store?: (resource: IResource<RI>) => void;
}

export declare class BaseModel<RI> extends CoreModel {
  public $pk: string;

  constructor(public $resourceName: string, public $restate: Restate);

  public async index(options?: IndexOptions<RI>): Promise<RI[]>;

  public async show(
    id: IPK,
    options?: ShowOptions<RI>
  ): Promise<RI | undefined>;

  public async store(
    data: Record<string, Partial<RI>>,
    options?: StoreOptions<RI>
  ): Promise<boolean>;

  public async update(
    id: IPK,
    data: Record<string, Partial<RI>>,
    options?: UpdateOptions<RI>
  ): Promise<boolean>;

  public async destroy(id: IPK, options?: DestroyOptions<RI>): Promise<boolean>;
}
