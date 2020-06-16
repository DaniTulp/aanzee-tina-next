import { createContext, useContext, useMemo } from "react";
import SDK from "@directus/sdk-js";
export const ERROR_MISSING_CLIENT = `useDirectusClient could not find an instance of Directus SDK`;

export const DirectusContext = createContext<SDK>(null);

export function useDirectusClient(): SDK {
  const directusclient = useContext(DirectusContext);
  const client = useMemo(() => directusclient, []);
  if (!client) {
    throw new Error(ERROR_MISSING_CLIENT);
  }
  return client;
}
