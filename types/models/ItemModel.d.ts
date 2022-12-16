import type { Axios } from "axios";
import type { Ref } from "vue";

import type { ComputedProperties, ResourceEntity } from "../resources";
import type { ItemResource } from "../resources/ItemResource";
import type { Load } from "../utils/load";
import { HTTPModel } from "./HTTPModel";

export type MapAfterRequest<Response> = (item: Response) => unknown;

export interface ItemModelOptions<RI, Response> {
  resourceName: string;
  axios: Axios;
  computedProperties?: ComputedProperties<RI>;
  mapAfterRequest?: MapAfterRequest<Response>;
}

export interface BaseOptions {
  query?: Record<string, string>;
}

export type ShowOptions = BaseOptions;

export type UpdateOptions = BaseOptions;

export declare class ItemModel<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI
> extends HTTPModel {
  protected readonly $resource: ItemResource<RI, Raw>;

  protected readonly $computedProperties: ComputedPropertiesMap<RI>;

  protected readonly $mapAfterRequest?: MapAfterRequest<Raw>;

  constructor(options: ItemModelOptions<RI, Raw>);

  public data(): ComputedState<RI>;

  public show(options?: ShowOptions): Load<ComputedState<RI>>;

  public update(data: Partial<RI>, options?: UpdateOptions): Load;
}
