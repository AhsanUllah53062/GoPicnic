import { useState } from "react";
import { loginUser } from "../services/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await loginUser(email, password);
      return userCredential.user;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
