import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ForgotPassword() {
  return (
    <AuthCard title="Recuperar Senha">
      <form className="flex flex-col gap-4">
        <Input type="email" placeholder="Digite seu email" />
        <Button type="submit">Enviar Link de Recuperação</Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-violet-600 font-semibold hover:underline"
        >
          Voltar para o Login
        </Link>
      </div>
    </AuthCard>
  );
}
