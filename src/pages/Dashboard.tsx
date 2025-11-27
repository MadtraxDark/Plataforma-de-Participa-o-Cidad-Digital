import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
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
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [votingFilter, setVotingFilter] = useState<string>("todas");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [newVotingOpen, setNewVotingOpen] = useState(false);
  const [votingTitle, setVotingTitle] = useState("");
  const [votingDescription, setVotingDescription] = useState("");
  const [votingCategory, setVotingCategory] = useState("");
  const [votingDialogOpen, setVotingDialogOpen] = useState(false);
  const [votings, setVotings] = useState([
    {
      id: 1,
      title: "Ampliação da Ciclovia na Avenida Principal",
      description:
        "Proposta para estender a ciclovia existente na Avenida Principal em mais 5 km.",
      category: "Mobilidade",
      status: "ativa",
      endDate: "2025-12-02",
      totalVotes: 0,
      hasVoted: false,
      options: [
        { label: "A favor", votes: 0, percentage: 0 },
        { label: "Contra", votes: 0, percentage: 0 },
        { label: "Abstenção", votes: 0, percentage: 0 },
      ],
    },
    {
      id: 2,
      title: "Construção de Nova Praça no Bairro Central",
      description:
        "Votação sobre a construção de uma praça pública com área verde.",
      category: "Infraestrutura",
      status: "ativa",
      endDate: "2025-11-29",
      totalVotes: 0,
      hasVoted: false,
      options: [
        { label: "A favor", votes: 0, percentage: 0 },
        { label: "Contra", votes: 0, percentage: 0 },
        { label: "Abstenção", votes: 0, percentage: 0 },
      ],
    },
    {
      id: 3,
      title: "Implementação de Coleta Seletiva",
      description:
        "Expandir o programa de coleta seletiva para todos os bairros.",
      category: "Meio Ambiente",
      status: "ativa",
      endDate: "2025-11-30",
      totalVotes: 0,
      hasVoted: false,
      options: [
        { label: "A favor", votes: 0, percentage: 0 },
        { label: "Contra", votes: 0, percentage: 0 },
        { label: "Abstenção", votes: 0, percentage: 0 },
      ],
    },
  ]);
  const [selectedVoting, setSelectedVoting] = useState<
    (typeof votings)[0] | null
  >(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [votedVotings, setVotedVotings] = useState<number[]>([]);
  const [voteIncrements, setVoteIncrements] = useState<
    Record<number, { option: string; increment: number }>
  >({});
  const [notifications, setNotifications] = useState<
    Array<{
      id: number;
      type: string;
      title: string;
      time: string;
      read: boolean;
    }>
  >([]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    toast.success("Logout realizado com sucesso!");
    navigate("/login", { replace: true });
  };

  const handleSubmitNewVoting = () => {
    if (!votingTitle || !votingDescription || !votingCategory) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const newVoting = {
      id: votings.length + 1,
      title: votingTitle,
      description: votingDescription,
      category: votingCategory,
      status: "ativa",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 7 dias a partir de hoje
      totalVotes: 0,
      hasVoted: false,
      options: [
        { label: "A favor", votes: 0, percentage: 0 },
        { label: "Contra", votes: 0, percentage: 0 },
        { label: "Abstenção", votes: 0, percentage: 0 },
      ],
    };

    setVotings([newVoting, ...votings]);

    // Criar notificação sobre a nova votação
    const newNotification = {
      id: notifications.length + 1,
      type: "vote",
      title: `Nova votação criada: ${votingTitle}`,
      time: "Agora",
      read: false,
    };
    setNotifications([newNotification, ...notifications]);

    toast.success("Votação criada com sucesso!");
    setNewVotingOpen(false);
    setVotingTitle("");
    setVotingDescription("");
    setVotingCategory("");
    setActiveSection("votacoes");
  };

  const handleVote = (voting: (typeof votings)[0]) => {
    setSelectedVoting(voting);
    setSelectedOption("");
    setVotingDialogOpen(true);
  };

  const handleSubmitVote = () => {
    if (!selectedOption || !selectedVoting) {
      toast.error("Por favor, selecione uma opção");
      return;
    }

    // Marca esta votação como votada e salva qual opção foi escolhida
    setVotedVotings([...votedVotings, selectedVoting.id]);
    setVoteIncrements({
      ...voteIncrements,
      [selectedVoting.id]: { option: selectedOption, increment: 1 },
    });

    // Atualizar a votação no array de votings em tempo real
    setVotings(
      votings.map((voting) => {
        if (voting.id === selectedVoting.id) {
          const updatedOptions = voting.options.map((opt) => {
            if (opt.label === selectedOption) {
              const newVotes = opt.votes + 1;
              const newTotal = voting.totalVotes + 1;
              return {
                ...opt,
                votes: newVotes,
                percentage: (newVotes / newTotal) * 100,
              };
            }
            // Recalcular percentagens de todas as opções
            const newTotal = voting.totalVotes + 1;
            return {
              ...opt,
              percentage: (opt.votes / newTotal) * 100,
            };
          });

          return {
            ...voting,
            totalVotes: voting.totalVotes + 1,
            hasVoted: true,
            options: updatedOptions,
          };
        }
        return voting;
      }),
    );

    // Criar notificação sobre o voto
    const voteNotification = {
      id: notifications.length + 1,
      type: "vote",
      title: `Você votou "${selectedOption}" em: ${selectedVoting.title}`,
      time: "Agora",
      read: false,
    };
    setNotifications([voteNotification, ...notifications]);

    toast.success("Voto registrado com sucesso!");
    setVotingDialogOpen(false);
    setSelectedVoting(null);
    setSelectedOption("");
  };

  const handleMarkNotificationAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      ),
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    toast.success("Todas as notificações foram limpas");
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("Todas as notificações foram marcadas como lidas");
  };

  // Dados mockados - substituir por dados reais da API
  const stats = [
    {
      title: "Votações Abertas",
      value: "3",
      icon: Vote,
      color: "bg-emerald-500",
      change: "+1 esta semana",
    },
    {
      title: "Cidadãos Ativos",
      value: "52",
      icon: Users,
      color: "bg-purple-500",
      change: "+8 este mês",
    },
    {
      title: "Propostas Enviadas",
      value: "5",
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+2 esta semana",
    },
    {
      title: "Minhas Propostas",
      value: "2",
      icon: FileText,
      color: "bg-blue-500",
      change: "1 em análise",
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
              <Popover
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
              >
                <PopoverTrigger asChild>
                  <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer">
                    <Bell className="h-6 w-6" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-gray-900">
                      Notificações
                    </h3>
                    {notifications.length > 0 && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          className="text-xs h-7"
                        >
                          Marcar todas como lidas
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 text-sm">
                          Nenhuma notificação
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() =>
                              handleMarkNotificationAsRead(notification.id)
                            }
                            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg shrink-0 ${
                                  notification.read
                                    ? "bg-gray-200"
                                    : "bg-blue-200"
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
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleClearAllNotifications}
                      >
                        Limpar todas
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
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
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium cursor-pointer w-full text-left ${
                activeSection === "dashboard"
                  ? "text-gray-900 bg-emerald-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <BarChart3
                className={`h-5 w-5 ${
                  activeSection === "dashboard" ? "text-emerald-600" : ""
                }`}
              />
              Dashboard
            </button>
            <button
              onClick={() => setActiveSection("votacoes")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer w-full text-left ${
                activeSection === "votacoes"
                  ? "text-gray-900 bg-emerald-50 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Vote
                className={`h-5 w-5 ${
                  activeSection === "votacoes" ? "text-emerald-600" : ""
                }`}
              />
              Votações
            </button>
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
          {activeSection === "dashboard" && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Bem-vindo(a) de volta!
                </h1>
                <p className="text-gray-600">
                  Confira as últimas atualizações e participe das decisões da
                  sua cidade.
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

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Votações Abertas - Takes 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Votações Abertas
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveSection("votacoes")}
                      className="cursor-pointer"
                    >
                      Ver todas
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {votings.slice(0, 3).map((voting) => (
                      <div
                        key={voting.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  voting.status === "ativa"
                                    ? "default"
                                    : "secondary"
                                }
                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              >
                                {voting.status === "ativa"
                                  ? "Ativa"
                                  : "Encerrada"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {voting.category}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">
                              {voting.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-1 mb-3">
                              {voting.description}
                            </p>

                            {/* Compact Progress Bars */}
                            <div className="space-y-2">
                              {voting.options.map((option, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-xs font-medium text-gray-700 w-20">
                                    {option.label}
                                  </span>
                                  <Progress
                                    value={option.percentage}
                                    className="h-1.5 flex-1"
                                  />
                                  <span className="text-xs text-gray-500 w-12 text-right">
                                    {option.percentage.toFixed(0)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {voting.totalVotes} votos
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(voting.endDate).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          </div>
                          {voting.hasVoted ? (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-100 text-emerald-700"
                            >
                              ✓ Votado
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleVote(voting)}
                              className="cursor-pointer"
                            >
                              Votar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar - Notificações e Ações */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Ações Rápidas</h3>
                    <div className="space-y-3">
                      <Button
                        onClick={() => setNewVotingOpen(true)}
                        className="w-full bg-white text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Votação
                      </Button>
                      <Button
                        onClick={() => setActiveSection("votacoes")}
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
                          onClick={() =>
                            handleMarkNotificationAsRead(notification.id)
                          }
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            notification.read
                              ? "bg-gray-50 hover:bg-gray-100"
                              : "bg-blue-50 hover:bg-blue-100"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                notification.read
                                  ? "bg-gray-200"
                                  : "bg-blue-200"
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
            </>
          )}

          {/* Seção de Votações */}
          {activeSection === "votacoes" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Votações
                  </h1>
                  <p className="text-gray-600">
                    Participe das decisões da sua cidade votando nas propostas
                  </p>
                </div>
                <Button
                  onClick={() => setNewVotingOpen(true)}
                  className="bg-black hover:bg-gray-900 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Votação
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Votações Ativas</p>
                        <p className="text-2xl font-bold">{votings.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Vote className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Seus Votos</p>
                        <p className="text-2xl font-bold">
                          {votedVotings.length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ThumbsUp className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total de Votos</p>
                        <p className="text-2xl font-bold">
                          {(
                            votings.reduce((acc, v) => acc + v.totalVotes, 0) +
                            votedVotings.length
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Buscar votações..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <Select
                      value={votingFilter}
                      onValueChange={setVotingFilter}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filtrar por categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas Categorias</SelectItem>
                        <SelectItem value="Infraestrutura">
                          Infraestrutura
                        </SelectItem>
                        <SelectItem value="Saúde">Saúde</SelectItem>
                        <SelectItem value="Educação">Educação</SelectItem>
                        <SelectItem value="Meio Ambiente">
                          Meio Ambiente
                        </SelectItem>
                        <SelectItem value="Transporte">Transporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Voting Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {votings
                  .filter(
                    (voting) =>
                      (voting.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                        voting.description
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())) &&
                      (votingFilter === "todas" ||
                        voting.category === votingFilter),
                  )
                  .map((voting) => {
                    const daysRemaining = Math.ceil(
                      (new Date(voting.endDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24),
                    );

                    const hasVoted = votedVotings.includes(voting.id);
                    const voteData = voteIncrements[voting.id];

                    // Atualiza os votos com o incremento do usuário
                    const updatedOptions = voting.options.map((opt) => ({
                      ...opt,
                      votes:
                        opt.label === voteData?.option
                          ? opt.votes + voteData.increment
                          : opt.votes,
                    }));

                    // Recalcula as porcentagens
                    const totalVotes = updatedOptions.reduce(
                      (sum, opt) => sum + opt.votes,
                      0,
                    );
                    const optionsWithPercentage = updatedOptions.map((opt) => ({
                      ...opt,
                      percentage:
                        totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0,
                    }));

                    return (
                      <Card
                        key={voting.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-green-500 hover:bg-green-600">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  {voting.status.charAt(0).toUpperCase() +
                                    voting.status.slice(1)}
                                </Badge>
                                <Badge variant="outline">
                                  {voting.category}
                                </Badge>
                                {hasVoted && (
                                  <Badge className="bg-purple-500 hover:bg-purple-600">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    Você votou
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-lg">
                                {voting.title}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">
                            {voting.description}
                          </p>

                          <div className="space-y-3 mb-4">
                            {optionsWithPercentage.map((option, index) => (
                              <div key={index}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">
                                    {option.label}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {option.votes} votos (
                                    {option.percentage.toFixed(1)}%)
                                  </span>
                                </div>
                                <Progress
                                  value={option.percentage}
                                  className="h-2"
                                />
                              </div>
                            ))}
                          </div>

                          <Separator className="my-4" />

                          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{totalVotes} votos</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Até{" "}
                                  {new Date(voting.endDate).toLocaleDateString(
                                    "pt-BR",
                                  )}
                                </span>
                              </div>
                            </div>
                            {daysRemaining >= 0 && (
                              <div className="flex items-center gap-1 text-orange-600">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">
                                  {daysRemaining}{" "}
                                  {daysRemaining === 1 ? "dia" : "dias"}{" "}
                                  restantes
                                </span>
                              </div>
                            )}
                          </div>

                          {!hasVoted ? (
                            <Button
                              onClick={() => handleVote(voting)}
                              className="w-full"
                            >
                              <Vote className="w-4 h-4 mr-2" />
                              Votar Agora
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              disabled
                              className="w-full"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Você já votou nesta proposta
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Dialog de Votação */}
      <Dialog open={votingDialogOpen} onOpenChange={setVotingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar seu voto</DialogTitle>
            <DialogDescription>{selectedVoting?.title}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              {selectedVoting?.description}
            </p>

            <div className="space-y-2">
              <Label>Escolha sua opção:</Label>
              <div className="space-y-2">
                {selectedVoting?.options.map(
                  (
                    option: {
                      label: string;
                      votes: number;
                      percentage: number;
                    },
                    index: number,
                  ) => (
                    <div
                      key={index}
                      onClick={() => setSelectedOption(option.label)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedOption === option.label
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.label}</span>
                        {selectedOption === option.label && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-sm text-blue-900">
                  Seu voto é anônimo e não poderá ser alterado após confirmação.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVotingDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmitVote}>
              <Vote className="w-4 h-4 mr-2" />
              Confirmar Voto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Nova Votação */}
      <Dialog open={newVotingOpen} onOpenChange={setNewVotingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Votação</DialogTitle>
            <DialogDescription>
              Crie uma nova votação para a comunidade participar e decidir sobre
              temas importantes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="voting-title">Título da Votação</Label>
              <Input
                id="voting-title"
                placeholder="Ex: Ampliação da Ciclovia..."
                value={votingTitle}
                onChange={(e) => setVotingTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voting-category">Categoria</Label>
              <Input
                id="voting-category"
                placeholder="Ex: Mobilidade, Infraestrutura, Meio Ambiente..."
                value={votingCategory}
                onChange={(e) => setVotingCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voting-description">Descrição</Label>
              <Textarea
                id="voting-description"
                placeholder="Descreva a votação em detalhes..."
                rows={6}
                value={votingDescription}
                onChange={(e) => setVotingDescription(e.target.value)}
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">
                    Dicas para uma boa votação:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Seja claro e objetivo no título</li>
                    <li>Explique bem o que está sendo votado</li>
                    <li>Descreva o impacto da decisão</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewVotingOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitNewVoting}>
              <Vote className="w-4 h-4 mr-2" />
              Criar Votação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
