import { IPK } from "types";

import { Restate, CoreModel } from "@/index";

export interface HTTPConfig {
  url: string;
}

export interface IndexOptions {
  query?: Record<string, string>;
  merge?: boolean;
}

export type ShowOptions = {
  query?: Record<string, string>;
};

export type StoreOptions = {
  query?: Record<string, string>;
};

export type UpdateOptions = {
  query?: Record<string, string>;
};

export interface DestroyOptions {
  query?: Record<string, string>;
}

export declare class BaseModel<RI> extends CoreModel {
  public $pk: string;

  constructor(public $resourceName: string, public $restate: Restate);

  public async index(options?: IndexOptions): Promise<RI[]>;

  public async show(id: IPK, options?: ShowOptions): Promise<RI | undefined>;

  public async store(
    data: Record<string, Partial<RI>>,
    options?: StoreOptions
  ): Promise<boolean>;

  public async update(
    id: IPK,
    data: Record<string, Partial<RI>>,
    options?: UpdateOptions
  ): Promise<boolean>;

  public async destroy(id: IPK, options?: DestroyOptions): Promise<boolean>;
}
