import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VisitorButton from "../components/VisitorButton";
import { vi } from "vitest";

// mocks
const guestLoginMock = vi.fn();
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({
    guestLogin: guestLoginMock,
  }),
}));

describe("VisitorButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar guestLogin e redirecionar para /tasks", async () => {
    guestLoginMock.mockResolvedValueOnce();

    render(<VisitorButton />);

    const button = screen.getByRole("button", {
      name: /entrar como visitante/i,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(guestLoginMock).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith("/tasks");
    });
  });

  it("deve exibir erro se guestLogin falhar", async () => {
    guestLoginMock.mockRejectedValueOnce(new Error("Erro simulado"));

    render(<VisitorButton />);

    const button = screen.getByRole("button", {
      name: /entrar como visitante/i,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/não foi possível autenticar como visitante/i)
      ).toBeInTheDocument();
    });
  });
});
