import type { PickNumberOrStringKeys, ResourceEntity } from "types/resources";
import type {
  CollectionResourceOptions,
  ComputedState,
  SetAllOptions,
  State,
} from "types/resources/CollectionResource";
import type { Indexes } from "types/resources/Indexes";

import type { ComputedRef } from "vue";
import { computed } from "vue";

class CollectionResource<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI,
  PK extends PickNumberOrStringKeys<Raw> = PickNumberOrStringKeys<Raw>
> {
  protected readonly $primaryKey: PK;

  protected $indexes: Indexes<Raw[PK]>;

  protected $state: State<Raw>;

  protected readonly $computedState: ComputedState<RI>;

  constructor({
    primaryKey,
    indexes,
    state,
    computedState,
  }: CollectionResourceOptions<RI, Raw, PK>) {
    this.$primaryKey = primaryKey;
    this.$indexes = indexes;
    this.$state = state;
    this.$computedState = computedState;
  }

  public get(id: Raw[PK]): ComputedRef<RI | undefined> {
    const itemComputed = computed(() => {
      const index = this.$indexes.get(id);

      return index !== undefined
        ? this.$computedState.value[index].data
        : undefined;
    });

    return itemComputed;
  }

  public getAll(): ComputedState<RI> {
    return this.$computedState;
  }

  public set(id: Raw[PK], data: Raw): number {
    let index = this.$indexes.get(id);

    if (index === undefined) {
      index = this.$state.value.length;
      this.$indexes.set(id, index);
      this.$state.value[index] = { data };
    } else {
      this.$state.value[index].data = data;
    }

    return index;
  }

  public setAll(collection: Raw[], options?: SetAllOptions): void {
    if (options?.clear === false) {
      this.$indexes.setAll(
        collection.map((item, index) => [item[this.$primaryKey], index]),
        { clear: false }
      );
    } else {
      this.clear();
      this.$indexes.setAll(
        collection.map((item, index) => [item[this.$primaryKey], index])
      );
    }

    this.$state.value = collection.map((item) => ({ data: item }));
  }

  public setProperty<P extends string & keyof Raw>(
    id: Raw[PK],
    prop: P,
    value: Raw[P]
  ): void {
    const index = this.$indexes.get(id);

    if (index === undefined) {
      throw new Error("Property not updated.");
    }

    const item = this.$state.value[index];

    if (item.data === undefined) {
      throw new Error("Property not updated.");
    }

    item.data[prop] = value;
  }

  public has(id: Raw[PK]): boolean {
    return this.$indexes.has(id);
  }

  public delete(id: Raw[PK]): void {
    const index = this.$indexes.get(id);

    if (index === undefined) {
      throw new Error("Item not removed.");
    }

    this.$state.value.splice(index, 1);
    this.$indexes.delete(id);
  }

  public clear(): void {
    this.$indexes.clear();
    this.$state.value = [];
  }
}

export { CollectionResource };
