import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import { AuthContext } from "../auth/AuthContext";
import { vi } from "vitest";
import { act } from "react";

describe("Login Page", () => {
  const mockLogin = vi.fn();

  const renderLogin = (customContext = {}) => {
    render(
      <AuthContext.Provider
        value={{
          login: mockLogin,
          isAuthenticated: false,
          loading: false,
          ...customContext,
        }}
      >
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test("exibe campos de email e senha", () => {
    renderLogin();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^entrar$/i })).toBeInTheDocument(); // botão de submit
    expect(screen.getByRole("button", { name: /entrar como visitante/i })).toBeInTheDocument(); // botão de visitante
  });

  test("chama login com dados válidos", async () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Senha");
    const loginButton = screen.getByRole("button", { name: /^entrar$/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "senha123" } });

    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(mockLogin).toHaveBeenCalledWith("user@example.com", "senha123");
  });

  test("mostra erro ao falhar login", async () => {
    const errorLogin = vi.fn().mockRejectedValue(new Error("Credenciais inválidas"));

    renderLogin({ login: errorLogin });

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Senha");
    const loginButton = screen.getByRole("button", { name: /^entrar$/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "senha123" } });

    await act(async () => {
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});
