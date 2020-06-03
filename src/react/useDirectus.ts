import * as React from "react";
import SDK from "@directus/sdk-js";
import { useRouter } from "next/router";
import Axios from "axios";
import { useInterval } from "./useInterval";

export const ERROR_MISSING_CLIENT = `useDirectusAuthClient could not find an instance of Directus SDK`;

export const DirectusContext = React.createContext<SDK | null>(null);

//TODO would like to merge these two objects.
export function useDirectusAuthClient(): [SDK, boolean] {
  const client = React.useContext(DirectusContext);
  if (!client) {
    throw new Error(ERROR_MISSING_CLIENT);
  }
  const [isCheckingLogin, setIsCheckingLogin] = React.useState(true);
  const router = useRouter();
  useInterval(async () => {
    await client!.api.auth.refreshIfNeeded();

    const token = client!.config.token;
    try {
      await Axios.post("/api/preview", {
        token,
      });
    } catch (exception) {
      //TODO check error code.
      router.push("/admin");
    }
    setIsCheckingLogin(false);
  }, 20 * 1000);
  return [client, isCheckingLogin];
}

export function useDirectusClient(): SDK {
  const client = React.useContext(DirectusContext);
  if (!client) {
    throw new Error(ERROR_MISSING_CLIENT);
  }
  return client;
}
