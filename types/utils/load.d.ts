import type { Ref } from "vue";

export interface Load {
  loaded: Promise<boolean>;
  loading: Ref<boolean>;
}

export declare function load(request: () => Promise<void>): Load;
