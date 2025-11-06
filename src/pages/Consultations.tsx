import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Consultation {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "Ativa" | "Encerrada" | "Em breve";
  startDate: string;
  endDate: string;
  participants: number;
  comments: number;
  likes: number;
  views: number;
  image?: string;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
}

export default function Consultations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [newComment, setNewComment] = useState("");

  // Dados mockados
  const categories = [
    "Todas",
    "Transporte",
    "Urbanismo",
    "Meio Ambiente",
    "Saúde",
    "Educação",
    "Segurança",
    "Cultura",
  ];

  const consultations: Consultation[] = [
    {
      id: 1,
      title: "Melhorias no Transporte Público Municipal",
      description:
        "Queremos ouvir sua opinião sobre as melhorias necessárias no sistema de transporte público de Teresópolis. Compartilhe suas sugestões sobre rotas, horários, acessibilidade e conforto dos ônibus municipais.",
      category: "Transporte",
      status: "Ativa",
      startDate: "01/11/2025",
      endDate: "15/11/2025",
      participants: 342,
      comments: 87,
      likes: 256,
      views: 1203,
    },
    {
      id: 2,
      title: "Revitalização da Praça Central",
      description:
        "Projeto de revitalização da Praça Central da cidade. Dê sua opinião sobre áreas de lazer, paisagismo, iluminação e segurança. Sua participação é fundamental para criarmos um espaço que atenda as necessidades da comunidade.",
      category: "Urbanismo",
      status: "Ativa",
      startDate: "05/11/2025",
      endDate: "20/11/2025",
      participants: 289,
      comments: 124,
      likes: 412,
      views: 987,
    },
    {
      id: 3,
      title: "Programa de Reciclagem Municipal",
      description:
        "Implementação de um programa de coleta seletiva e reciclagem em todo o município. Contribua com ideias sobre pontos de coleta, educação ambiental e incentivos para a população.",
      category: "Meio Ambiente",
      status: "Ativa",
      startDate: "03/11/2025",
      endDate: "25/11/2025",
      participants: 456,
      comments: 198,
      likes: 523,
      views: 1456,
    },
    {
      id: 4,
      title: "Ampliação do Horário das UBS",
      description:
        "Proposta de ampliação do horário de atendimento das Unidades Básicas de Saúde. Participe e ajude a definir os melhores horários para atender a população.",
      category: "Saúde",
      status: "Ativa",
      startDate: "07/11/2025",
      endDate: "18/11/2025",
      participants: 178,
      comments: 45,
      likes: 189,
      views: 654,
    },
    {
      id: 5,
      title: "Merenda Escolar Orgânica",
      description:
        "Discussão sobre a implementação de alimentação orgânica nas escolas municipais. Compartilhe sua opinião sobre nutrição, fornecedores locais e sustentabilidade.",
      category: "Educação",
      status: "Em breve",
      startDate: "20/11/2025",
      endDate: "05/12/2025",
      participants: 0,
      comments: 0,
      likes: 45,
      views: 234,
    },
    {
      id: 6,
      title: "Iluminação Pública LED",
      description:
        "Projeto de modernização da iluminação pública com tecnologia LED. Sua opinião sobre priorização de vias e economia de energia é importante.",
      category: "Urbanismo",
      status: "Encerrada",
      startDate: "15/10/2025",
      endDate: "31/10/2025",
      participants: 512,
      comments: 234,
      likes: 678,
      views: 2103,
    },
  ];

  const mockComments: Comment[] = [
    {
      id: 1,
      author: "Maria Silva",
      avatar: "MS",
      content:
        "Excelente iniciativa! Sugiro que as rotas sejam ampliadas para atender os bairros mais afastados, principalmente nos horários de pico.",
      date: "há 2 horas",
      likes: 24,
    },
    {
      id: 2,
      author: "João Santos",
      avatar: "JS",
      content:
        "Precisamos de mais ônibus nos finais de semana. A frota atual é insuficiente para atender a demanda do comércio.",
      date: "há 5 horas",
      likes: 18,
    },
    {
      id: 3,
      author: "Ana Costa",
      avatar: "AC",
      content:
        "Apoio totalmente! Também seria importante investir em acessibilidade para pessoas com deficiência.",
      date: "há 1 dia",
      likes: 42,
    },
  ];

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todas" ||
      consultation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      toast.success("Comentário enviado com sucesso!");
      setNewComment("");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Ativa":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Encerrada":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Em breve":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (selectedConsultation) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => setSelectedConsultation(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar para consultas
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Consultation Details */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClass(
                        selectedConsultation.status
                      )}
                    >
                      {selectedConsultation.status}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Até {selectedConsultation.endDate}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedConsultation.title}
                  </h1>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {selectedConsultation.participants} participantes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {selectedConsultation.comments} comentários
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {selectedConsultation.views} visualizações
                    </span>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {selectedConsultation.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button
                      className="cursor-pointer"
                      onClick={() =>
                        toast.success("Você curtiu esta consulta!")
                      }
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Curtir ({selectedConsultation.likes})
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Comentários ({mockComments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {" "}
                  {/* Comment Form */}
                  <form onSubmit={handleSubmitComment} className="mb-8">
                    <Label htmlFor="comment" className="text-gray-700 mb-2">
                      Adicione sua opinião
                    </Label>
                    <div className="flex gap-3 mt-2">
                      <Textarea
                        id="comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Compartilhe suas ideias e sugestões..."
                        className="flex-1 min-h-[60px]"
                      />
                      <Button type="submit" className="cursor-pointer self-end">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                  {/* Comments List */}
                  <div className="space-y-6">
                    {mockComments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold shrink-0">
                          {comment.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">
                                {comment.author}
                              </span>
                              <span className="text-sm text-gray-500">
                                {comment.date}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                          <button
                            onClick={() =>
                              toast("Você curtiu este comentário!")
                            }
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mt-2 cursor-pointer"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            {comment.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">
                  Informações da Consulta
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Categoria</p>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {selectedConsultation.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Período</p>
                    <p className="text-gray-900">
                      {selectedConsultation.startDate} até{" "}
                      {selectedConsultation.endDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <p className="text-gray-900">
                      {selectedConsultation.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                <h3 className="font-bold mb-2">Convide outras pessoas!</h3>
                <p className="text-sm text-emerald-50 mb-4">
                  Compartilhe esta consulta e amplie a participação cidadã.
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer"
                  onClick={() =>
                    toast("Link copiado para a área de transferência!")
                  }
                >
                  Compartilhar
                </Button>
              </div>

              {/* Related Consultations */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">
                  Consultas Relacionadas
                </h3>
                <div className="space-y-3">
                  {consultations
                    .filter((c) => c.id !== selectedConsultation.id)
                    .slice(0, 3)
                    .map((consultation) => (
                      <button
                        key={consultation.id}
                        onClick={() => setSelectedConsultation(consultation)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {consultation.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {consultation.participants} participantes
                        </p>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
                Voltar ao Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Consultas Públicas
              </h1>
              <p className="text-gray-600 mt-2">
                Participe das discussões e ajude a construir uma cidade melhor
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar consultas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCategory === category
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {consultations.filter((c) => c.status === "Ativa").length}
                </p>
                <p className="text-sm text-gray-600">Consultas Ativas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {consultations.reduce((acc, c) => acc + c.participants, 0)}
                </p>
                <p className="text-sm text-gray-600">Total de Participantes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {consultations.reduce((acc, c) => acc + c.comments, 0)}
                </p>
                <p className="text-sm text-gray-600">Comentários Totais</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedConsultation(consultation)}
            >
              <div className="flex items-start justify-between mb-4">
                <Badge
                  variant="outline"
                  className={getStatusBadgeClass(consultation.status)}
                >
                  {consultation.status}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-600 border-blue-200"
                >
                  {consultation.category}
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {consultation.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {consultation.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {consultation.participants}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {consultation.comments}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {consultation.likes}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Até {consultation.endDate}</span>
                </div>
                <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm cursor-pointer">
                  Participar
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredConsultations.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma consulta encontrada
            </h3>
            <p className="text-gray-600">Tente ajustar seus filtros ou busca</p>
          </div>
        )}
      </div>
    </div>
  );
}
