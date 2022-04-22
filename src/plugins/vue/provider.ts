import axios from "axios";

import { AxiosHTTPClient } from "@/implementations/httpClient/axios/AxiosHttpClient";
import { VueStore } from "@/implementations/store/vue/VueStore";

const axiosHttpClient = new AxiosHTTPClient(axios);
const vueStore = new VueStore();

export const provider = {
  httpClient: axiosHttpClient,
  store: vueStore,
};
