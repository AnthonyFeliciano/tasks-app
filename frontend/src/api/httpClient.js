const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getToken = () => localStorage.getItem("token");
const getTokenType = () => localStorage.getItem("token_type") || "Bearer";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `${getTokenType()} ${getToken()}`,
});

export async function apiFetch(path, options = {}, auth = true) {
  const url = `${BASE_URL}${path}`;

  const headers = auth
    ? { ...authHeaders(), ...options.headers }
    : { "Content-Type": "application/json", ...options.headers };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // JSON inválido
      throw {
        status: response.status,
        data: {
          message: "Erro desconhecido ao processar resposta da API.",
        },
      };
    }

    const isFieldErrorObject =
      data?.message && typeof data.message === "object" && !Array.isArray(data.message);

    
    throw {
      status: response.status,
      data: {
        message: !isFieldErrorObject ? data.message : undefined,
        errors: isFieldErrorObject ? data.message : undefined,
      },
    };
  }

  if (response.status === 204) return null;

  return response.json();
}
