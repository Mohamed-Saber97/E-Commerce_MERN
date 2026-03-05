import { createContext, useContext } from "react";

interface AuthContectType {
  username: string | null;
  token: string | null;

  isAuthenticated: boolean;
  myOrders: any[];
  login: (username: string, token: string) => void;
  logout: () => void;
  getMyOrders: () => void;
}

export const AuthContext = createContext<AuthContectType>({
  username: null,
  token: null,
  login: () => {},
  isAuthenticated: false,
  myOrders: [],
  logout: () => {},
  getMyOrders: () => {},
});

export const useAuth = () => useContext(AuthContext);
