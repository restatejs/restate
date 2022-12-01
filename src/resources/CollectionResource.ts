import type { PickNumberOrStringKeys, ResourceEntity } from "types/resources";
import type { ResourceCollectionState } from "types/resources/CollectionResource";

import type { ComputedRef, Ref } from "vue";
import { toRef, computed, reactive } from "vue";

class CollectionResource<
  RI extends ResourceEntity,
  PK extends PickNumberOrStringKeys<RI>
> {
  protected state: ResourceCollectionState<RI, PK>;

  constructor() {
    this.state = reactive({ data: {} }) as ResourceCollectionState<RI, PK>;
  }

  public get(id: RI[PK]): Ref<Readonly<RI> | undefined> {
    const item = this.state.data[id];

    if (!item) {
      this.state.data[id] = undefined;
    }

    return toRef(this.state.data, id);
  }

  public getAll(): ComputedRef<(RI | undefined)[]> {
    const items = computed(() =>
      Object.values<RI | undefined>(this.state.data)
    );

    return items;
  }

  public set(id: RI[PK], data: RI): Readonly<RI> {
    this.state.data[id] = data;

    return this.state.data[id] as Readonly<RI>;
  }

  public setProperty<P extends string & keyof RI>(
    id: RI[PK],
    prop: P,
    value: RI[P]
  ): Readonly<RI> {
    const item = this.state.data[id];

    if (!item) {
      throw new Error("Property not updated.");
    }

    item[prop] = value;

    return this.state.data[id] as Readonly<RI>;
  }

  public has(id: RI[PK]): boolean {
    return id in this.state.data;
  }

  public delete(id: RI[PK]): void {
    delete this.state.data[id];
  }

  public clear(): void {
    this.state.data = {} as Record<RI[PK], RI | undefined>;
  }
}

export { CollectionResource };
