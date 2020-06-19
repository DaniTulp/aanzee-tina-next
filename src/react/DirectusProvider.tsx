import { createBrowserClient } from "../lib/createDirectusClient";
import React, { ReactNode, useMemo, createContext, useContext } from "react";
import { AuthProvider } from "./AuthProvider";

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

export function DirectusProvider({
  children,
  Unauthenticated,
}: {
  children?: ReactNode;
  Unauthenticated?: React.FC;
}) {
  return (
    <DirectusContext.Provider value={createBrowserClient()}>
      <AuthProvider Unauthenticated={Unauthenticated}>{children}</AuthProvider>
    </DirectusContext.Provider>
  );
}
