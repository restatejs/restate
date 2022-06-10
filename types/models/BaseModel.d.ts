import { CoreModel } from "./CoreModel";

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

export declare class BaseModel<RI> extends CoreModel<RI> {
  public $pk = "id";

  constructor(public $resourceName: string, public $axios: Axios) {
    super($resourceName);
  }

  public index(options?: IndexOptions): {
    data: ComputedRef<Ref<Partial<RI>>[]>;
    load: Promise<boolean>;
  };

  public show(
    id: string | number,
    options?: ShowOptions
  ): {
    data: Ref<Partial<RI> | Record<string, never>>;
    load: Promise<boolean>;
  };

  public async store(
    data: Partial<RI>,
    options?: StoreOptions
  ): Promise<boolean>;

  public async update(
    id: string | number,
    data: Partial<RI>,
    options?: UpdateOptions
  ): Promise<boolean>;

  public async destroy(
    id: string | number,
    options?: DestroyOptions
  ): Promise<boolean>;
}
