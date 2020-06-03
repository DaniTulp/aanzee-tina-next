import { createBrowserClient } from "../lib/createDirectusClient";
import { DirectusContext, useDirectusAuthClient } from "./useDirectus";
import React, { ReactNode } from "react";
import { usePreview } from "./usePreview";

export function DirectusProvider({ children }: { children: ReactNode }) {
  const preview = usePreview();
  const client = createBrowserClient();
  return (
    <DirectusContext.Provider value={client}>
      {preview ? <AuthWrapper>{children}</AuthWrapper> : <>{children}</>}
    </DirectusContext.Provider>
  );
}

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const [, isLoading] = useDirectusAuthClient();
  return isLoading ? <span>Loading...</span> : <>{children}</>;
};
