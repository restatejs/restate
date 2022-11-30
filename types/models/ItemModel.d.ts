import type { Axios } from "axios";
import type { Ref } from "vue";

import type { ResourceEntity } from "../resources";
import type { ItemResource } from "../resources/ItemResource";
import type { Load } from "../utils/load";
import { HTTPModel } from "./HTTPModel";

export type ComputedProperty<RI, Return = unknown> = (item: Ref<RI>) => Return;

export type ComputedProperties<RI> = Map<keyof RI, ComputedProperty<RI>>;

export type MapAfterRequest<Response> = (item: Response) => unknown;

export interface ItemModelOptions<RI, Response> {
  resourceName: string;
  axios: Axios;
  computedProperties?: {
    [Prop in keyof RI]?: ComputedProperty<RI, RI[Prop]>;
  };
  mapAfterRequest?: MapAfterRequest<Response>;
}

export interface BaseOptions {
  query?: Record<string, string>;
}

export type ShowOptions = BaseOptions;

export type UpdateOptions = BaseOptions;

export declare class ItemModel<
  RI extends ResourceEntity,
  Response extends ResourceEntity = RI
> extends HTTPModel {
  protected readonly $resource: ItemResource<RI>;

  protected readonly $computedProperties: ComputedProperties<RI>;

  protected readonly $mapAfterRequest?: MapAfterRequest<Response>;

  constructor(options: ItemModelOptions<RI, Response>);

  public data(): Ref<RI | undefined>;

  public show(options?: ShowOptions): Load<Ref<RI | undefined>>;

  public update(data: Partial<RI>, options?: UpdateOptions): Load;

  private $insertComputedProperties(data: Ref<RI>): void;
}
