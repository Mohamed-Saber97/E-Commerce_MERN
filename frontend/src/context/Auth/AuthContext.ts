import { createContext, useContext } from "react";

interface AuthContectType {
  username: string | null;
  token: string | null;

  login: (username: string, token: string)=> void;

}

export const AuthContext = createContext<AuthContectType>({username: null, token: null, login: ()=>{}});

export const useAuth = () => useContext(AuthContext);
