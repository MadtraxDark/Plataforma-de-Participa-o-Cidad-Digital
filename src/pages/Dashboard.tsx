import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Vote,
  TrendingUp,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Settings,
  FileText,
  Calendar,
  ThumbsUp,
  ChevronRight,
  Megaphone,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  // Dados mockados - substituir por dados reais da API
  const stats = [
    {
      title: "Consultas Ativas",
      value: "12",
      icon: MessageSquare,
      color: "bg-blue-500",
      change: "+3 esta semana",
    },
    {
      title: "Votações Abertas",
      value: "8",
      icon: Vote,
      color: "bg-emerald-500",
      change: "+2 esta semana",
    },
    {
      title: "Cidadãos Ativos",
      value: "1.2k",
      icon: Users,
      color: "bg-purple-500",
      change: "+150 este mês",
    },
    {
      title: "Propostas Enviadas",
      value: "45",
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+12 esta semana",
    },
  ];

  const activeConsultations = [
    {
      id: 1,
      title: "Melhorias no Transporte Público",
      category: "Transporte",
      participants: 342,
      endDate: "15/11/2025",
      status: "Ativa",
    },
    {
      id: 2,
      title: "Revitalização da Praça Central",
      category: "Urbanismo",
      participants: 289,
      endDate: "20/11/2025",
      status: "Ativa",
    },
    {
      id: 3,
      title: "Programa de Reciclagem Municipal",
      category: "Meio Ambiente",
      participants: 456,
      endDate: "25/11/2025",
      status: "Ativa",
    },
  ];

  const recentVotes = [
    {
      id: 1,
      title: "Horário de Funcionamento dos Parques",
      votes: 1234,
      timeLeft: "2 dias",
    },
    {
      id: 2,
      title: "Implementação de Ciclovias",
      votes: 987,
      timeLeft: "5 dias",
    },
    {
      id: 3,
      title: "Iluminação em Vias Públicas",
      votes: 756,
      timeLeft: "7 dias",
    },
  ];

  const notifications = [
    {
      id: 1,
      type: "vote",
      title: "Nova votação disponível",
      time: "2 horas atrás",
      read: false,
    },
    {
      id: 2,
      type: "consultation",
      title: "Consulta pública encerrando em breve",
      time: "5 horas atrás",
      read: false,
    },
    {
      id: 3,
      type: "update",
      title: "Sua proposta foi aprovada",
      time: "1 dia atrás",
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden cursor-pointer"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">
                  Participa Terê
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar consultas, votações, propostas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => toast("Configurações em desenvolvimento")}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hidden sm:block cursor-pointer"
              >
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 hidden sm:block cursor-pointer"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out pt-16 lg:pt-0`}
        >
          <nav className="px-4 py-6 space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-900 bg-emerald-50 rounded-lg font-medium cursor-pointer"
            >
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <MessageSquare className="h-5 w-5" />
              Consultas Públicas
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <Vote className="h-5 w-5" />
              Votações
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <FileText className="h-5 w-5" />
              Minhas Propostas
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <Megaphone className="h-5 w-5" />
              Notícias
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <Calendar className="h-5 w-5" />
              Eventos
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <ShieldCheck className="h-5 w-5" />
              Transparência
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo(a) de volta!
            </h1>
            <p className="text-gray-600">
              Confira as últimas atualizações e participe das decisões da sua
              cidade.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <p className="text-xs text-emerald-600 font-medium">
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Consultations */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Consultas Públicas Ativas
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast("Funcionalidade em desenvolvimento")}
                  className="cursor-pointer"
                >
                  Ver todas
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {activeConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {consultation.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {consultation.participants} participantes
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Até {consultation.endDate}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        {consultation.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                        {consultation.category}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto cursor-pointer"
                      >
                        Participar
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications & Quick Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => toast("Funcionalidade em desenvolvimento")}
                    className="w-full bg-white text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Nova Proposta
                  </Button>
                  <Button
                    onClick={() => toast("Funcionalidade em desenvolvimento")}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer"
                    variant="outline"
                  >
                    <Vote className="h-4 w-4 mr-2" />
                    Ver Votações
                  </Button>
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Notificações Recentes
                </h3>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notification.read
                          ? "bg-gray-50 hover:bg-gray-100"
                          : "bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            notification.read ? "bg-gray-200" : "bg-blue-200"
                          }`}
                        >
                          <Bell className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm ${
                              notification.read
                                ? "text-gray-700"
                                : "text-gray-900 font-medium"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 cursor-pointer"
                  onClick={() => toast("Funcionalidade em desenvolvimento")}
                >
                  Ver todas as notificações
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Votes Section */}
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Votações em Destaque
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast("Funcionalidade em desenvolvimento")}
                className="cursor-pointer"
              >
                Ver todas
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentVotes.map((vote) => (
                <div
                  key={vote.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Vote className="h-5 w-5 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-600">
                      Encerra em {vote.timeLeft}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {vote.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{vote.votes} votos</span>
                    </div>
                    <Button size="sm" className="cursor-pointer">
                      Votar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
