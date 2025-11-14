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
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Send,
  AlertCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [newProposalOpen, setNewProposalOpen] = useState(false);
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [proposalCategory, setProposalCategory] = useState("");

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  const handleSubmitProposal = () => {
    if (!proposalTitle || !proposalDescription || !proposalCategory) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    toast.success("Proposta enviada com sucesso! Aguarde a análise.");
    setNewProposalOpen(false);
    setProposalTitle("");
    setProposalDescription("");
    setProposalCategory("");
  };

  // Dados mockados - substituir por dados reais da API
  const stats = [
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
    {
      title: "Minhas Propostas",
      value: "3",
      icon: FileText,
      color: "bg-blue-500",
      change: "2 em análise",
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
      type: "update",
      title: "Sua proposta foi aprovada",
      time: "1 dia atrás",
      read: true,
    },
  ];

  const votings = [
    {
      id: 1,
      title: "Ampliação da Ciclovia na Avenida Principal",
      description:
        "Proposta para estender a ciclovia existente na Avenida Principal em mais 5 km.",
      category: "Mobilidade",
      status: "ativa",
      endDate: "2025-11-20",
      totalVotes: 1247,
      hasVoted: false,
      options: [
        { label: "A favor", votes: 856, percentage: 68.6 },
        { label: "Contra", votes: 291, percentage: 23.3 },
        { label: "Abstenção", votes: 100, percentage: 8.1 },
      ],
    },
    {
      id: 2,
      title: "Construção de Nova Praça no Bairro Central",
      description:
        "Votação sobre a construção de uma praça pública com área verde.",
      category: "Infraestrutura",
      status: "ativa",
      endDate: "2025-11-18",
      totalVotes: 2134,
      hasVoted: true,
      userVote: "sim",
      options: [
        { label: "A favor", votes: 1823, percentage: 85.4 },
        { label: "Contra", votes: 211, percentage: 9.9 },
        { label: "Abstenção", votes: 100, percentage: 4.7 },
      ],
    },
    {
      id: 3,
      title: "Implementação de Coleta Seletiva",
      description: "Expandir o programa de coleta seletiva para todos os bairros.",
      category: "Meio Ambiente",
      status: "ativa",
      endDate: "2025-11-22",
      totalVotes: 892,
      hasVoted: false,
      options: [
        { label: "A favor", votes: 745, percentage: 83.5 },
        { label: "Contra", votes: 89, percentage: 10.0 },
        { label: "Abstenção", votes: 58, percentage: 6.5 },
      ],
    },
  ];

  const proposals = [
    {
      id: 1,
      title: "Criação de Parque Ecológico no Bairro Jardim",
      description:
        "Proposta para transformar o terreno baldio de 5 hectares no Bairro Jardim em um parque ecológico com trilhas, área de lazer e preservação ambiental.",
      category: "Meio Ambiente",
      status: "em_analise",
      submittedDate: "2025-11-05",
      views: 234,
      likes: 89,
      comments: 23,
    },
    {
      id: 2,
      title: "Programa de Internet Gratuita em Praças Públicas",
      description:
        "Instalação de Wi-Fi gratuito de alta velocidade em todas as praças da cidade para facilitar o acesso à informação e educação digital.",
      category: "Tecnologia",
      status: "aprovada",
      submittedDate: "2025-10-28",
      views: 567,
      likes: 234,
      comments: 78,
      approvedDate: "2025-11-08",
    },
    {
      id: 3,
      title: "Extensão do Horário das Academias ao Ar Livre",
      description:
        "Manutenção e iluminação adequada das academias ao ar livre para permitir uso até às 22h.",
      category: "Esportes",
      status: "rejeitada",
      submittedDate: "2025-10-15",
      views: 145,
      likes: 34,
      comments: 12,
      rejectedReason: "Orçamento insuficiente para implementação neste ano fiscal.",
    },
    {
      id: 4,
      title: "Feira de Produtos Orgânicos Semanal",
      description:
        "Realização de feira semanal aos sábados na Praça Central com produtores locais de alimentos orgânicos.",
      category: "Agricultura",
      status: "em_votacao",
      submittedDate: "2025-10-20",
      views: 432,
      likes: 187,
      comments: 56,
      votingId: 4,
    },
    {
      id: 5,
      title: "Biblioteca Comunitária no Bairro Novo",
      description:
        "Instalação de uma biblioteca comunitária com acervo de 5.000 livros e espaço de estudos no Bairro Novo.",
      category: "Educação",
      status: "em_analise",
      submittedDate: "2025-11-10",
      views: 89,
      likes: 45,
      comments: 8,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_analise":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Em Análise
          </Badge>
        );
      case "aprovada":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Aprovada
          </Badge>
        );
      case "rejeitada":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeitada
          </Badge>
        );
      case "em_votacao":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600">
            <Vote className="w-3 h-3 mr-1" />
            Em Votação
          </Badge>
        );
      default:
        return null;
    }
  };

  const ProposalCard = ({ proposal }: { proposal: typeof proposals[0] }) => {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(proposal.status)}
                <Badge variant="outline">{proposal.category}</Badge>
              </div>
              <CardTitle className="text-lg">{proposal.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{proposal.description}</p>

          {proposal.status === "rejeitada" && proposal.rejectedReason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Motivo da rejeição:</p>
                  <p className="text-sm text-red-800 mt-1">{proposal.rejectedReason}</p>
                </div>
              </div>
            </div>
          )}

          {proposal.status === "aprovada" && proposal.approvedDate && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Proposta aprovada em {new Date(proposal.approvedDate).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-sm text-green-800 mt-1">
                    Sua proposta foi aceita e será implementada!
                  </p>
                </div>
              </div>
            </div>
          )}

          {proposal.status === "em_votacao" && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg mb-4">
              <div className="flex gap-2">
                <Vote className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Sua proposta está em votação pública!
                  </p>
                  <p className="text-sm text-purple-800 mt-1">
                    A comunidade está votando nesta proposta.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{proposal.views} visualizações</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{proposal.likes} apoios</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{proposal.comments} comentários</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                Enviada em {new Date(proposal.submittedDate).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalhes
            </Button>
            {proposal.status === "em_analise" && (
              <>
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toast.error("Proposta excluída")}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </>
            )}
            {proposal.status === "em_votacao" && (
              <Button>
                <Vote className="w-4 h-4 mr-2" />
                Votar Agora
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

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
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium cursor-pointer w-full text-left ${
                activeSection === "dashboard"
                  ? "text-gray-900 bg-emerald-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className={`h-5 w-5 ${activeSection === "dashboard" ? "text-emerald-600" : ""}`} />
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
              <Vote className={`h-5 w-5 ${activeSection === "votacoes" ? "text-emerald-600" : ""}`} />
              Votações
            </button>
            <button
              onClick={() => setActiveSection("propostas")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer w-full text-left ${
                activeSection === "propostas"
                  ? "text-gray-900 bg-emerald-50 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FileText className={`h-5 w-5 ${activeSection === "propostas" ? "text-emerald-600" : ""}`} />
              Minhas Propostas
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
                            variant={voting.status === "ativa" ? "default" : "secondary"}
                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          >
                            {voting.status === "ativa" ? "Ativa" : "Encerrada"}
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
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-700 w-20">
                                {option.label}
                              </span>
                              <Progress value={option.percentage} className="h-1.5 flex-1" />
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
                          {new Date(voting.endDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      {voting.hasVoted ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          ✓ Votado
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setActiveSection("votacoes")}
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

          {/* Propostas Recentes Section */}
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Propostas Recentes
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection("propostas")}
                className="cursor-pointer"
              >
                Ver todas
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proposals.slice(0, 3).map((proposal) => (
                <div
                  key={proposal.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="outline"
                      className={
                        proposal.status === "aprovada"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : proposal.status === "em_analise"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : proposal.status === "em_votacao"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {proposal.status === "aprovada"
                        ? "Aprovada"
                        : proposal.status === "em_analise"
                        ? "Em Análise"
                        : proposal.status === "em_votacao"
                        ? "Em Votação"
                        : "Rejeitada"}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {proposal.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {proposal.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {proposal.category}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {proposal.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {proposal.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {proposal.comments}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </>
          )}

          {/* Seção de Votações */}
          {activeSection === "votacoes" && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Votações</h1>
                <p className="text-gray-600">
                  Participe das decisões da sua cidade votando nas propostas
                </p>
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
                          {votings.filter((v) => v.hasVoted).length}
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
                          {votings.reduce((acc, v) => acc + v.totalVotes, 0).toLocaleString()}
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
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Voting Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {votings.map((voting) => {
                  const daysRemaining = Math.ceil(
                    (new Date(voting.endDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <Card key={voting.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-green-500 hover:bg-green-600">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {voting.status.charAt(0).toUpperCase() + voting.status.slice(1)}
                              </Badge>
                              <Badge variant="outline">{voting.category}</Badge>
                              {voting.hasVoted && (
                                <Badge className="bg-purple-500 hover:bg-purple-600">
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  Você votou
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg">{voting.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          {voting.description}
                        </p>

                        <div className="space-y-3 mb-4">
                          {voting.options.map((option, index) => (
                            <div key={index}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">
                                  {option.label}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {option.votes} votos ({option.percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <Progress value={option.percentage} className="h-2" />
                            </div>
                          ))}
                        </div>

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{voting.totalVotes} votos</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Até {new Date(voting.endDate).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
                          {daysRemaining >= 0 && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">
                                {daysRemaining} {daysRemaining === 1 ? "dia" : "dias"}{" "}
                                restantes
                              </span>
                            </div>
                          )}
                        </div>

                        {!voting.hasVoted ? (
                          <Button
                            onClick={() =>
                              toast.success("Voto registrado com sucesso!")
                            }
                            className="w-full"
                          >
                            <Vote className="w-4 h-4 mr-2" />
                            Votar Agora
                          </Button>
                        ) : (
                          <Button variant="outline" disabled className="w-full">
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

          {/* Seção de Minhas Propostas */}
          {activeSection === "propostas" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Minhas Propostas
                  </h1>
                  <p className="text-gray-600">
                    Gerencie suas propostas enviadas e acompanhe o status
                  </p>
                </div>
                <Button onClick={() => setNewProposalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Proposta
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total de Propostas</p>
                        <p className="text-2xl font-bold">{proposals.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Em Análise</p>
                        <p className="text-2xl font-bold">
                          {proposals.filter((p) => p.status === "em_analise").length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Aprovadas</p>
                        <p className="text-2xl font-bold">
                          {proposals.filter((p) => p.status === "aprovada").length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Em Votação</p>
                        <p className="text-2xl font-bold">
                          {proposals.filter((p) => p.status === "em_votacao").length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Vote className="w-6 h-6 text-purple-600" />
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
                        <Input placeholder="Buscar propostas..." className="pl-10" />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrar por Status
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="todas" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="todas">
                    Todas ({proposals.length})
                  </TabsTrigger>
                  <TabsTrigger value="em_analise">
                    Em Análise ({proposals.filter((p) => p.status === "em_analise").length})
                  </TabsTrigger>
                  <TabsTrigger value="aprovada">
                    Aprovadas ({proposals.filter((p) => p.status === "aprovada").length})
                  </TabsTrigger>
                  <TabsTrigger value="em_votacao">
                    Em Votação ({proposals.filter((p) => p.status === "em_votacao").length})
                  </TabsTrigger>
                  <TabsTrigger value="rejeitada">
                    Rejeitadas ({proposals.filter((p) => p.status === "rejeitada").length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="todas" className="space-y-4">
                  {proposals.map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} />
                  ))}
                </TabsContent>

                <TabsContent value="em_analise" className="space-y-4">
                  {proposals
                    .filter((p) => p.status === "em_analise")
                    .map((proposal) => (
                      <ProposalCard key={proposal.id} proposal={proposal} />
                    ))}
                </TabsContent>

                <TabsContent value="aprovada" className="space-y-4">
                  {proposals
                    .filter((p) => p.status === "aprovada")
                    .map((proposal) => (
                      <ProposalCard key={proposal.id} proposal={proposal} />
                    ))}
                </TabsContent>

                <TabsContent value="em_votacao" className="space-y-4">
                  {proposals
                    .filter((p) => p.status === "em_votacao")
                    .map((proposal) => (
                      <ProposalCard key={proposal.id} proposal={proposal} />
                    ))}
                </TabsContent>

                <TabsContent value="rejeitada" className="space-y-4">
                  {proposals
                    .filter((p) => p.status === "rejeitada")
                    .map((proposal) => (
                      <ProposalCard key={proposal.id} proposal={proposal} />
                    ))}
                </TabsContent>
              </Tabs>
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

      {/* Dialog Nova Proposta */}
      <Dialog open={newProposalOpen} onOpenChange={setNewProposalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Proposta</DialogTitle>
            <DialogDescription>
              Envie sua ideia para melhorar nossa cidade. Todas as propostas serão
              analisadas pela equipe de gestão.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Proposta</Label>
              <Input
                id="title"
                placeholder="Ex: Criação de novo parque no bairro..."
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                placeholder="Ex: Meio Ambiente, Educação, Saúde..."
                value={proposalCategory}
                onChange={(e) => setProposalCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição Detalhada</Label>
              <Textarea
                id="description"
                placeholder="Descreva sua proposta em detalhes, incluindo benefícios e impacto esperado..."
                rows={6}
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Dicas para uma boa proposta:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Seja claro e objetivo no título</li>
                    <li>Explique o problema que sua proposta resolve</li>
                    <li>Descreva os benefícios para a comunidade</li>
                    <li>Inclua informações sobre viabilidade, se possível</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProposalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitProposal}>
              <Send className="w-4 h-4 mr-2" />
              Enviar Proposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
