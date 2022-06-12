import type { ComputedRef, Ref } from "vue";

import { CoreModel } from "./CoreModel";

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

  constructor(public $resourceName: string, public $axios: Axios);

  public collection(): ComputedRef<Ref<Partial<RI>>[]>;

  public item(id: string | number): Ref<Partial<RI>>;

  public index(options?: IndexOptions): {
    data: ComputedRef<Ref<Partial<RI>>[]>;
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  };

  public show(
    id: string | number,
    options?: ShowOptions
  ): {
    data: Ref<Partial<RI> | Record<string, never>>;
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  };

  public store(
    payloaded: Partial<RI>,
    options?: StoreOptions
  ): {
    data: ComputedRef<Partial<RI> | null>;
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  };

  public update(
    id: string | number,
    data: Partial<RI>,
    options?: UpdateOptions
  ): {
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  };
  public destroy(
    id: string | number,
    options?: DestroyOptions
  ): {
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  };
}
