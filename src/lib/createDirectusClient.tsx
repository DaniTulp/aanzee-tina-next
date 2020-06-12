import { SDK } from "@directus/sdk-js";
import { IStorageAPI } from "@directus/sdk-js/dist/types/Configuration";
//TODO fix env as a configuration parameter not .env
export function createServerClient(preview: boolean = false) {
  return new SDK({
    url: process.env.DIRECTUS_URL!,
    project: process.env.DIRECTUS_PROJECT!,
    token: preview
      ? process.env.DIRECTUS_PREVIEW_TOKEN!
      : process.env.DIRECTUS_TOKEN!,
    mode: "jwt",
  });
}

export function createBrowserClient() {
  return new SDK({
    project: process.env.NEXT_PUBLIC_DIRECTUS_PROJECT!,
    url: process.env.NEXT_PUBLIC_DIRECTUS_URL!,
    mode: "jwt",
    persist: true,
    storage: window.sessionStorage as IStorageAPI,
  });
}
