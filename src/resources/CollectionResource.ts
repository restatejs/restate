import type {
  ComputedPropertiesMap,
  PickNumberOrStringKeys,
  ResourceEntity,
} from "types/resources";
import type {
  CollectionResourceOptions,
  SetAllOptions,
  State,
} from "types/resources/CollectionResource";
import type { Indexes } from "types/resources/Indexes";

class CollectionResource<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI,
  PK extends PickNumberOrStringKeys<Raw> = PickNumberOrStringKeys<Raw>
> {
  protected readonly $primaryKey: PK;

  protected $indexes: Indexes<Raw[PK]>;

  protected $state: State<RI>;

  protected readonly $computedPropertiesMap: ComputedPropertiesMap<Raw>;

  constructor({
    primaryKey,
    indexes,
    state,
    computedProperties,
  }: CollectionResourceOptions<RI, Raw, PK>) {
    this.$primaryKey = primaryKey;
    this.$indexes = indexes;
    this.$state = state;
    this.$computedPropertiesMap = new Map(Object.entries(computedProperties));
  }

  public get(id: Raw[PK]): RI | undefined {
    const index = this.$indexes.get(id);

    return index !== undefined ? this.$state.value[index] : undefined;
  }

  public getAll(): State<RI> {
    return this.$state;
  }

  public set(id: Raw[PK], data: Raw): number {
    let index = this.$indexes.get(id);

    if (index === undefined) {
      index = this.$state.value.length;
      this.$indexes.set(id, index);
      this.$state.value[index] = this.$defineItemComputedProperties(data);
    } else {
      this.$state.value[index] = this.$defineItemComputedProperties(data);
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

    this.$state.value = collection.map((item) =>
      this.$defineItemComputedProperties(item)
    );
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

    if (item === undefined) {
      throw new Error("Property not updated.");
    }

    (item as any)[prop] = value;

    this.$defineItemComputedProperties(item as unknown as Raw);
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

  protected $defineItemComputedProperties(item: Raw): RI {
    this.$computedPropertiesMap.forEach((callback, key) => {
      item[key] = callback(item) as any;
    });

    return item as unknown as RI;
  }
}

export { CollectionResource };
