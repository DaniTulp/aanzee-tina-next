import { SDK } from "@directus/sdk-js";
import { IStorageAPI } from "@directus/sdk-js/dist/types/Configuration";
export function createServerClient(preview: boolean = false) {
  const client = new SDK({
    url: process.env.DIRECTUS_URL!,
    project: process.env.DIRECTUS_PROJECT!,
    token: preview
      ? process.env.DIRECTUS_PREVIEW_TOKEN!
      : process.env.DIRECTUS_TOKEN!,
    mode: "jwt",
  });
  return client;
}

export function createBrowserClient() {
  const client = new SDK({
    project: process.env.NEXT_PUBLIC_DIRECTUS_PROJECT!,
    url: process.env.NEXT_PUBLIC_DIRECTUS_URL!,
    mode: "jwt",
    persist: true,
    storage: window.sessionStorage as IStorageAPI,
  });
  //Remove default auth checker
  clearInterval(client.api.auth.refreshInterval);
  client.api.auth.refreshInterval = undefined;
  return client;
}
