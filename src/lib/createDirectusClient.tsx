import { SDK as DirectusSDK } from "@directus/sdk-js";
import {
  IStorageAPI,
  IConfigurationOptions,
} from "@directus/sdk-js/dist/types/Configuration";
//TODO fix env as a configuration parameter not .env
export function createServerClient(preview: boolean = false) {
  return new DirectusSDK({
    url: process.env.DIRECTUS_URL!,
    project: process.env.DIRECTUS_PROJECT!,
    token: preview
      ? process.env.DIRECTUS_PREVIEW_TOKEN!
      : process.env.DIRECTUS_TOKEN!,
    mode: "jwt",
  });
}


export function createBrowserClient() {
  return SDK.getInstance({
    project: process.env.NEXT_PUBLIC_DIRECTUS_PROJECT!,
    url: process.env.NEXT_PUBLIC_DIRECTUS_URL!,
    mode: "jwt",
    persist: true,
    storage: window.sessionStorage as IStorageAPI,
  });
}

/**
 * Created this as a singleton because each time a browser client is created
 * it fires of a refresh event.
 */
class SDK extends DirectusSDK {
  private static instance: DirectusSDK;
  private constructor(options: IConfigurationOptions) {
    super(options);
  }

  public static getInstance(options: IConfigurationOptions) {
    if (!SDK.instance) {
      SDK.instance = new SDK(options);
    }
    return SDK.instance;
  }
}
