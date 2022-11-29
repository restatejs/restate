import type { PickNumberOrStringKeys, ResourceEntity } from "types/resources";
import type { ResourceCollectionState } from "types/resources/CollectionResource";

import type { ComputedRef, Ref } from "vue";
import { toRef, reactive, computed } from "vue";

class CollectionResource<
  RI extends ResourceEntity,
  PK extends PickNumberOrStringKeys<RI>
> {
  public state: ResourceCollectionState<RI, PK>;

  constructor() {
    this.state = reactive({ data: {} }) as ResourceCollectionState<RI, PK>;
  }

  public get(id: RI[PK]): Ref<RI | undefined> {
    const item = this.state.data[id];

    if (!item) {
      this.state.data[id] = undefined;
    }

    return toRef(this.state.data, id);
  }

  public getAll(): ComputedRef<RI[]> {
    const computedCollection = computed(() => {
      const collection = Object.values(this.state.data);

      return collection as RI[];
    });

    return computedCollection;
  }

  public set(id: RI[PK], data: RI): Ref<RI> {
    this.state.data[id] = data;

    return toRef(this.state.data, id) as Ref<RI>;
  }

  public setProperty<P extends string & keyof RI>(
    id: RI[PK],
    prop: P,
    value: RI[P]
  ): Ref<RI> {
    const item = this.state.data[id];

    if (!item) {
      throw new Error("Property not updated.");
    }

    item[prop] = value;

    return toRef(this.state.data, id) as Ref<RI>;
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
