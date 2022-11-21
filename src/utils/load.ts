import type { Load } from "types/utils/load";

import { ref } from "vue";

export function load<D>(callback: () => Promise<void>, data?: D): Load<D> {
  const loading = ref(true);

  const loaded = (async () => {
    await callback();

    loading.value = false;

    return true;
  })();

  const response: any = {
    loaded,
    loading,
  };

  if (data) {
    response.data = data;
  }

  return response;
}
