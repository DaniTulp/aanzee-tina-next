import React, { createContext, useState, useContext, useEffect } from "react";
import { useDirectusClient } from "./DirectusProvider";
import { LoginModal } from "./LoginModal";

export type Credentials = {
  email: string;
  password: string;
};

type AuthContextProps = {
  login: (credentials: Credentials) => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextProps>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props: any) {
  const LoggedOutComponent = props.Unauthenticated || LoginModal;
  const client = useDirectusClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      setIsAuthenticated(await client.isLoggedIn());
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (credentials: Credentials) => {
    try {
      await client.login({ ...credentials, ...client.config });
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };
  return isLoading ? (
    <span>Loading...</span>
  ) : (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
      }}
      {...props}
    >
      {!isAuthenticated && <LoggedOutComponent />}
      {props.children}
    </AuthContext.Provider>
  );
}
