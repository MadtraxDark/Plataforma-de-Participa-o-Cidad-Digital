import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Vote,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Users,
  Calendar,
  BarChart3,
  ThumbsUp,
  Menu,
  X,
  LogOut,
  Settings,
  MessageSquare,
  FileText,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Voting {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "ativa" | "encerrada" | "agendada";
  startDate: string;
  endDate: string;
  totalVotes: number;
  hasVoted: boolean;
  userVote?: "sim" | "nao" | "abstencao";
  options: {
    label: string;
    votes: number;
    percentage: number;
  }[];
}

export default function Votings() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedVoting, setSelectedVoting] = useState<Voting | null>(null);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [selectedVote, setSelectedVote] = useState<string>("");

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  // Dados mockados - substituir por dados reais da API
  const votings: Voting[] = [
    {
      id: 1,
      title: "Ampliação da Ciclovia na Avenida Principal",
      description:
        "Proposta para estender a ciclovia existente na Avenida Principal em mais 5 km, conectando o centro ao bairro residencial.",
      category: "Mobilidade",
      status: "ativa",
      startDate: "2025-11-10",
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
        "Votação sobre a construção de uma praça pública com área verde, playground e espaço para eventos comunitários.",
      category: "Infraestrutura",
      status: "ativa",
      startDate: "2025-11-08",
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
      title: "Implementação de Coleta Seletiva em Todos os Bairros",
      description:
        "Proposta para expandir o programa de coleta seletiva para todos os bairros da cidade, com distribuição de contêineres específicos.",
      category: "Meio Ambiente",
      status: "ativa",
      startDate: "2025-11-12",
      endDate: "2025-11-22",
      totalVotes: 892,
      hasVoted: false,
      options: [
        { label: "A favor", votes: 745, percentage: 83.5 },
        { label: "Contra", votes: 89, percentage: 10.0 },
        { label: "Abstenção", votes: 58, percentage: 6.5 },
      ],
    },
    {
      id: 4,
      title: "Horário Estendido das Bibliotecas Públicas",
      description:
        "Votação sobre a extensão do horário de funcionamento das bibliotecas públicas até às 22h nos dias de semana.",
      category: "Educação",
      status: "encerrada",
      startDate: "2025-10-15",
      endDate: "2025-10-30",
      totalVotes: 1567,
      hasVoted: true,
      userVote: "sim",
      options: [
        { label: "A favor", votes: 1134, percentage: 72.4 },
        { label: "Contra", votes: 312, percentage: 19.9 },
        { label: "Abstenção", votes: 121, percentage: 7.7 },
      ],
    },
    {
      id: 5,
      title: "Instalação de Painéis Solares em Prédios Públicos",
      description:
        "Proposta para instalação de painéis solares em todos os prédios públicos municipais para redução de custos e impacto ambiental.",
      category: "Sustentabilidade",
      status: "agendada",
      startDate: "2025-11-25",
      endDate: "2025-12-05",
      totalVotes: 0,
      hasVoted: false,
      options: [
        { label: "A favor", votes: 0, percentage: 0 },
        { label: "Contra", votes: 0, percentage: 0 },
        { label: "Abstenção", votes: 0, percentage: 0 },
      ],
    },
    {
      id: 6,
      title: "Programa de Descontos para Transporte Público Estudantil",
      description:
        "Votação sobre a implementação de desconto de 50% nas tarifas de transporte público para estudantes.",
      category: "Mobilidade",
      status: "encerrada",
      startDate: "2025-10-01",
      endDate: "2025-10-15",
      totalVotes: 3421,
      hasVoted: true,
      userVote: "sim",
      options: [
        { label: "A favor", votes: 2987, percentage: 87.3 },
        { label: "Contra", votes: 301, percentage: 8.8 },
        { label: "Abstenção", votes: 133, percentage: 3.9 },
      ],
    },
  ];

  const categories = [
    "todas",
    "Mobilidade",
    "Infraestrutura",
    "Meio Ambiente",
    "Educação",
    "Sustentabilidade",
    "Saúde",
  ];

  const filteredVotings = votings.filter((voting) => {
    const matchesSearch =
      voting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voting.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "todas" || voting.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeVotings = filteredVotings.filter((v) => v.status === "ativa");
  const closedVotings = filteredVotings.filter((v) => v.status === "encerrada");
  const scheduledVotings = filteredVotings.filter((v) => v.status === "agendada");

  const handleVote = (voting: Voting) => {
    setSelectedVoting(voting);
    setSelectedVote("");
    setVoteDialogOpen(true);
  };

  const confirmVote = () => {
    if (!selectedVote) {
      toast.error("Por favor, selecione uma opção de voto");
      return;
    }

    toast.success(`Voto registrado com sucesso!`);
    setVoteDialogOpen(false);
    setSelectedVoting(null);
    setSelectedVote("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativa":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Ativa
          </Badge>
        );
      case "encerrada":
        return (
          <Badge variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            Encerrada
          </Badge>
        );
      case "agendada":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Clock className="w-3 h-3 mr-1" />
            Agendada
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const VotingCard = ({ voting }: { voting: Voting }) => {
    const daysRemaining = getDaysRemaining(voting.endDate);
    const leadingOption = voting.options.reduce((prev, current) =>
      prev.percentage > current.percentage ? prev : current
    );

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(voting.status)}
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
          <p className="text-sm text-muted-foreground mb-4">
            {voting.description}
          </p>

          <div className="space-y-3 mb-4">
            {voting.options.map((option, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {option.votes} votos ({option.percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={option.percentage} className="h-2" />
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{voting.totalVotes} votos</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(voting.startDate)} - {formatDate(voting.endDate)}
                </span>
              </div>
            </div>
            {voting.status === "ativa" && daysRemaining >= 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">
                  {daysRemaining} {daysRemaining === 1 ? "dia" : "dias"} restantes
                </span>
              </div>
            )}
          </div>

          {voting.status === "ativa" && !voting.hasVoted && (
            <Button onClick={() => handleVote(voting)} className="w-full">
              <Vote className="w-4 h-4 mr-2" />
              Votar Agora
            </Button>
          )}

          {voting.status === "ativa" && voting.hasVoted && (
            <Button variant="outline" disabled className="w-full">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Você já votou nesta proposta
            </Button>
          )}

          {voting.status === "encerrada" && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Votação encerrada • Opção vencedora: <strong>{leadingOption.label}</strong>
              </span>
            </div>
          )}

          {voting.status === "agendada" && (
            <Button variant="outline" disabled className="w-full">
              <Clock className="w-4 h-4 mr-2" />
              Inicia em {formatDate(voting.startDate)}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-bold">Participa+</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/consultations")}
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              Consultas
            </Button>
            <Button variant="default" className="w-full justify-start">
              <Vote className="w-5 h-5 mr-3" />
              Votações
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="w-5 h-5 mr-3" />
              Propostas
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="w-5 h-5 mr-3" />
              Resultados
            </Button>
          </nav>

          <div className="p-4 border-t space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-5 h-5 mr-3" />
              Configurações
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Votações</h2>
                <p className="text-sm text-gray-600">
                  Participe das decisões da sua cidade
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Votações Ativas</p>
                    <p className="text-2xl font-bold">{activeVotings.length}</p>
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
                    <p className="text-sm text-muted-foreground">Seus Votos</p>
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
                    <p className="text-sm text-muted-foreground">Total de Votos</p>
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

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Agendadas</p>
                    <p className="text-2xl font-bold">{scheduledVotings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar votações..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="ativas" className="space-y-6">
            <TabsList>
              <TabsTrigger value="ativas">
                Ativas ({activeVotings.length})
              </TabsTrigger>
              <TabsTrigger value="encerradas">
                Encerradas ({closedVotings.length})
              </TabsTrigger>
              <TabsTrigger value="agendadas">
                Agendadas ({scheduledVotings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ativas" className="space-y-4">
              {activeVotings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Vote className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Nenhuma votação ativa encontrada
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {activeVotings.map((voting) => (
                    <VotingCard key={voting.id} voting={voting} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="encerradas" className="space-y-4">
              {closedVotings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <XCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Nenhuma votação encerrada encontrada
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {closedVotings.map((voting) => (
                    <VotingCard key={voting.id} voting={voting} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="agendadas" className="space-y-4">
              {scheduledVotings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Nenhuma votação agendada encontrada
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {scheduledVotings.map((voting) => (
                    <VotingCard key={voting.id} voting={voting} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Vote Dialog */}
      <Dialog open={voteDialogOpen} onOpenChange={setVoteDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Voto</DialogTitle>
            <DialogDescription>
              Escolha sua opção de voto para esta proposta. Seu voto é anônimo e não
              poderá ser alterado.
            </DialogDescription>
          </DialogHeader>

          {selectedVoting && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">{selectedVoting.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedVoting.description}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Selecione sua opção:</label>
                <div className="space-y-2">
                  {selectedVoting.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedVote === option.label ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedVote(option.label)}
                    >
                      {selectedVote === option.label && (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Importante:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>Seu voto é anônimo e confidencial</li>
                      <li>Você não poderá alterar seu voto após confirmar</li>
                      <li>O resultado será divulgado ao final da votação</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVoteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmVote} disabled={!selectedVote}>
              <Vote className="w-4 h-4 mr-2" />
              Confirmar Voto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
