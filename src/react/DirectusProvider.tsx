import { createBrowserClient } from "../lib/createDirectusClient";
import { DirectusContext, useDirectusClient } from "./useDirectus";
import React, { ReactNode, useEffect } from "react";
import { usePreview } from "./usePreview";
import { useCMS } from "tinacms";

export function DirectusProvider({
  children,
  onUnauthenticated,
}: {
  children: ReactNode;
  onUnauthenticated?: Function;
}) {
  const preview = usePreview();
  const client = createBrowserClient();
  return (
    <DirectusContext.Provider value={client}>
      {preview ? (
        <AuthWrapper onUnauthenticated={onUnauthenticated}>
          {children}
        </AuthWrapper>
      ) : (
        <>{children}</>
      )}
    </DirectusContext.Provider>
  );
}

const AuthWrapper = ({
  children,
  onUnauthenticated,
}: {
  children: ReactNode;
  onUnauthenticated?: Function;
}) => {
  const client = useDirectusClient();
  const [isLoading, setisLoading] = React.useState(true);
  const cms = useCMS();
  useEffect(() => {
    async function checkLogin() {
      const isAuthenticated = await client.isLoggedIn();
      if (!isAuthenticated) {
        typeof onUnauthenticated === "function"
          ? onUnauthenticated()
          : cms.alerts.error("Logged out");
      }
      setisLoading(false);
    }
    checkLogin();
  }, []);
  return isLoading ? <span>Loading...</span> : <>{children}</>;
};
