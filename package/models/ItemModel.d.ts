import type { Axios } from "axios";

import type { ComputedProperties, ResourceEntity } from "../resources";
import type { ComputedState, ItemResource } from "../resources/ItemResource";
import type { Load } from "../utils/load";
import { HTTPModel } from "./HTTPModel";

export type MapAfterRequest<Response> = (item: Response) => unknown;

export interface ItemModelOptions<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI
> {
  resourceName: string;
  axios: Axios;
  computedProperties?: ComputedProperties<RI>;
  mapAfterRequest?: MapAfterRequest<Raw>;
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
  public readonly $resource: ItemResource<RI, Raw>;

  protected readonly $mapAfterRequest?: MapAfterRequest<Raw>;

  constructor(options: ItemModelOptions<RI, Raw>);

  public data(): ComputedState<RI>;

  public show(options?: ShowOptions): Load;

  public update(data: Partial<RI>, options?: UpdateOptions): Load;
}
