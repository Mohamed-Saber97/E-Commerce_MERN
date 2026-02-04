import { createContext, useContext } from "react";

interface AuthContectType {
  username: string | null;
  token: string | null;

  isAuthenticated: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContectType>({
  username: null,
  token: null,
  login: () => {},
  isAuthenticated: false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
