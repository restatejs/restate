import type { Ref } from "vue";
import { ref } from "vue";

export function load(request: () => Promise<void>): {
  loaded: Promise<boolean>;
  loading: Ref<boolean>;
} {
  const loading = ref(true);

  const loaded = (async () => {
    await request();

    loading.value = false;

    return true;
  })();

  return {
    loaded,
    loading,
  };
}
