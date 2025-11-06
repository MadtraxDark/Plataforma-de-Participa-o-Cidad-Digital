import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  CheckCircle2,
  Lock,
  Megaphone,
  User,
  Mail,
  CreditCard,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  XCircle,
  Loader2,
} from "lucide-react";
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

      if (!isPasswordValid) {
        toast.error("A senha não atende a todos os requisitos");
        setLoading(false);
        return;
      }

      // Simulando cadastro (substituir por chamada real à API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch {
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

  // Validação de senha em tempo real
  const passwordValidation = useMemo(() => {
    const password = formData.password;
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [formData.password]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-linear-to-br from-emerald-600 to-teal-700 text-white">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Users className="w-7 h-7" />
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
                  <CheckCircle2 className="w-5 h-5" />
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
                  <Lock className="w-5 h-5" />
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
                  <Megaphone className="w-5 h-5" />
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
                  <User className="h-5 w-5 text-gray-400" />
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
                  <Mail className="h-5 w-5 text-gray-400" />
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
                    <CreditCard className="h-5 w-5 text-gray-400" />
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
                    <Phone className="h-5 w-5 text-gray-400" />
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
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-11 pr-11 h-12 text-base"
                  placeholder="Mínimo 8 caracteres"
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 cursor-pointer"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Validação de senha em tempo real */}
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {passwordValidation.minLength ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-300" />
                  )}
                  <span
                    className={
                      passwordValidation.minLength
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    Mínimo de 8 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.hasUpperCase ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-300" />
                  )}
                  <span
                    className={
                      passwordValidation.hasUpperCase
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    Uma letra maiúscula
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.hasLowerCase ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-300" />
                  )}
                  <span
                    className={
                      passwordValidation.hasLowerCase
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    Uma letra minúscula
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.hasNumber ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-300" />
                  )}
                  <span
                    className={
                      passwordValidation.hasNumber
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    Um número
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.hasSpecialChar ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-300" />
                  )}
                  <span
                    className={
                      passwordValidation.hasSpecialChar
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    Um caractere especial (!@#$%^&*)
                  </span>
                </div>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Confirmar Senha <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <ShieldCheck className="h-5 w-5 text-gray-400" />
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
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
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
