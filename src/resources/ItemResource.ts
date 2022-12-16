import type { ResourceEntity } from "types/resources";
import type {
  ComputedState,
  ItemResourceOptions,
  State,
} from "types/resources/ItemResource";

class ItemResource<RI extends ResourceEntity, Raw extends ResourceEntity = RI> {
  protected $state: State<Raw>;

  protected readonly $computedState: ComputedState<RI>;

  constructor({ state, computedState }: ItemResourceOptions<RI, Raw>) {
    this.$state = state;
    this.$computedState = computedState;
  }

  public get(): ComputedState<RI> {
    return this.$computedState;
  }

  public set(data: Raw): void {
    this.$state.value = data;
  }

  public setProperty<P extends string & keyof Raw>(
    prop: P,
    value: Raw[P]
  ): void {
    const item = this.$state.value;

    if (!item) {
      throw new Error("Property not updated.");
    }

    item[prop] = value;
  }

  public has(): boolean {
    return !!this.$state.value;
  }

  public clear(): void {
    this.$state.value = undefined;
  }
}

export { ItemResource };
