// Mock data for the application
export const mockUser = {
  id: "1",
  name: "João Silva",
  email: "joao@example.com",
  cpf: "12345678901",
  phone: "11999999999",
  birthDate: "1990-01-15",
};

export const mockVotings = [
  {
    id: "1",
    title: "Construção de uma nova biblioteca pública",
    description:
      "Votação sobre a construção de uma nova biblioteca no bairro central da cidade.",
    startDate: "2024-11-20",
    endDate: "2024-12-10",
    status: "active",
    hasVoted: false,
    options: [
      { id: "1", text: "Favorável", votes: 18 },
      { id: "2", text: "Desfavorável", votes: 5 },
      { id: "3", text: "Abstém-se", votes: 2 },
    ],
    totalVoters: 50,
    participationPercentage: 50,
  },
  {
    id: "2",
    title: "Implantação de ciclovias na região",
    description:
      "Discussão sobre a implantação de ciclovias conectando os bairros principais.",
    startDate: "2024-11-15",
    endDate: "2024-12-05",
    status: "active",
    hasVoted: true,
    options: [
      { id: "1", text: "Favorável", votes: 22 },
      { id: "2", text: "Desfavorável", votes: 8 },
      { id: "3", text: "Abstém-se", votes: 5 },
    ],
    totalVoters: 50,
    participationPercentage: 70,
  },
  {
    id: "3",
    title: "Reforma da praça central",
    description:
      "Votação sobre a reforma e modernização da praça central da cidade.",
    startDate: "2024-11-01",
    endDate: "2024-11-25",
    status: "active",
    hasVoted: false,
    options: [
      { id: "1", text: "Favorável", votes: 16 },
      { id: "2", text: "Desfavorável", votes: 6 },
      { id: "3", text: "Abstém-se", votes: 3 },
    ],
    totalVoters: 50,
    participationPercentage: 50,
  },
];

export const mockProposals = [
  {
    id: "1",
    title: "Implementação de sistema de compostagem comunitária",
    description:
      "Proposta para criar pontos de coleta de resíduos orgânicos e compostagem em áreas comunitárias.",
    status: "em_votacao",
    author: "João Silva",
    createdAt: "2024-11-10",
    category: "Meio Ambiente",
    supportCount: 8,
    commentCount: 3,
    image:
      "https://images.unsplash.com/photo-1559027615-cd0628902d4a?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Programa de capacitação profissional gratuita",
    description:
      "Iniciativa para oferecer cursos de capacitação profissional gratuitamente aos cidadãos.",
    status: "em_analise",
    author: "Maria Santos",
    createdAt: "2024-11-12",
    category: "Educação",
    supportCount: 6,
    commentCount: 2,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    title: "Revitalização de áreas públicas de lazer",
    description:
      "Projeto para revitalizar e melhorar as áreas públicas de lazer na região.",
    status: "aprovada",
    author: "Carlos Oliveira",
    createdAt: "2024-10-28",
    category: "Infraestrutura",
    supportCount: 14,
    commentCount: 5,
    image:
      "https://images.unsplash.com/photo-1511489767569-7e2b2d424815?w=400&h=300&fit=crop",
  },
];

export const mockNotifications = [
  {
    id: "1",
    title: "Votação iniciada",
    message: "Uma nova votação foi aberta: Construção de biblioteca pública",
    type: "info",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Proposta aprovada",
    message: "Sua proposta 'Ciclovias' foi aprovada e irá para votação",
    type: "success",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Comentário em sua proposta",
    message: "João Silva comentou na sua proposta de compostagem",
    type: "info",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export const mockDashboardStats = {
  activeVotings: mockVotings.filter((v) => v.status === "active").length,
  myVotes: mockVotings.filter((v) => v.hasVoted).length,
  totalVotes: mockVotings.reduce(
    (sum, v) => sum + v.options.reduce((opt, o) => opt + o.votes, 0),
    0,
  ),
  myProposals: mockProposals.length,
};
