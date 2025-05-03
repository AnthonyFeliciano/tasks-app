  import { apiFetch } from "./httpClient";

  export const login = async (email, password) => {
    return apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, false);
  };

  export const register = async ( name, email, password, password_confirmation ) => {
    return apiFetch("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, password_confirmation }),
    }, false);
  };


  export const logout = async () => {
    return apiFetch("/logout", { method: "POST" });
  };
