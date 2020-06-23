import SDK from "@directus/sdk-js";
import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { AuthProvider } from "./AuthProvider";

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
  client,
  Unauthenticated,
}: {
  client: SDK;
  children?: ReactNode;
  Unauthenticated?: React.FC;
}) {
  return (
    <DirectusContext.Provider value={client}>
      <AuthProvider Unauthenticated={Unauthenticated}>{children}</AuthProvider>
    </DirectusContext.Provider>
  );
}
