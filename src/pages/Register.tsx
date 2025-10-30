import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiUsers,
  HiCheckCircle,
  HiLockClosed,
  HiSpeakerphone,
  HiUser,
  HiMail,
  HiIdentification,
  HiPhone,
  HiEye,
  HiEyeOff,
  HiShieldCheck,
} from "react-icons/hi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (
        !formData.name ||
        !formData.email ||
        !formData.cpf ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error("Preencha todos os campos obrigatórios");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("As senhas não coincidem");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
        setLoading(false);
        return;
      }

      // Simulando cadastro (substituir por chamada real à API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({
      ...formData,
      cpf: formatted,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({
      ...formData,
      phone: formatted,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-linear-to-br from-emerald-600 to-teal-700 text-white">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <HiUsers className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-bold">Participa Terê</h1>
            </div>

            <h2 className="text-2xl font-semibold">
              Junte-se à Nossa Comunidade
            </h2>

            <p className="text-emerald-100 text-lg leading-relaxed">
              Faça parte da transformação de Teresópolis. Sua voz é importante
              para construir uma cidade melhor para todos.
            </p>

            <div className="space-y-4 pt-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <HiCheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Cadastro Gratuito</h3>
                  <p className="text-emerald-100 text-sm">
                    Rápido e sem custos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <HiLockClosed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Dados Seguros</h3>
                  <p className="text-emerald-100 text-sm">
                    Suas informações protegidas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <HiSpeakerphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Participe Ativamente</h3>
                  <p className="text-emerald-100 text-sm">
                    Sua opinião faz diferença
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Criar Conta
            </h2>
            <p className="text-gray-600">Preencha seus dados para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <HiUser className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-11 h-12 text-base"
                  placeholder="Digite seu nome completo"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                E-mail <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <HiMail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-11 h-12 text-base"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* CPF e Telefone - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-gray-700">
                  CPF <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <HiIdentification className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="cpf"
                    name="cpf"
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    maxLength={14}
                    className="pl-11 h-12 text-base"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Telefone
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <HiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                    className="pl-11 h-12 text-base"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Senha <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <HiLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-11 pr-11 h-12 text-base"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                >
                  {showPassword ? (
                    <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Confirmar Senha <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <HiShieldCheck className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-11 pr-11 h-12 text-base"
                  placeholder="Digite a senha novamente"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                >
                  {showConfirmPassword ? (
                    <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
