import { useContext } from "react";
import AuthContext from "../contexts/AuthContexts"; 
import type { AuthContextType } from "../contexts/AuthContexts"; 

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx as AuthContextType;
};
