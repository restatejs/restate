import type { Ref } from "vue";

export interface SetAllOptions {
  clear?: boolean;
}

export type IndexesMap<Key extends number | string> = Record<
  Key,
  number | undefined
>;

export declare class Indexes<Key extends number | string> {
  protected $storage: Ref<IndexesMap<Key>>;

  public get(key: Key): number | undefined;

  public set(key: Key, index: number): void;

  public setAll(indexes: [Key, number][], options?: SetAllOptions): void;

  public has(key: Key): boolean;

  public delete(key: Key): void;

  public clear(): void;
}
