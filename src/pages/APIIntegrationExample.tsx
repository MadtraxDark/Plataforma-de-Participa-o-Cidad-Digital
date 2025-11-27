import { useProposals, useCreateProposal } from "@/hooks/useProposals";
import { useProposalComments, useCreateComment } from "@/hooks/useComments";
import { Button } from "@/components/ui/button";

/**
 * Exemplo de uso dos hooks da API
 * Este arquivo demonstra como utilizar React Query com a API
 */

export default function APIIntegrationExample() {
  // Exemplo 1: Listar propostas
  const {
    data: proposals,
    isLoading: proposalsLoading,
    error: proposalsError,
  } = useProposals();

  // Exemplo 2: Criar proposta
  const { mutate: createProposal, isPending: isCreating } = useCreateProposal();

  // Exemplo 3: Listar comentários de uma proposta (se houver proposalId)
  const selectedProposalId = proposals?.[0]?.id;
  const { data: comments, isLoading: commentsLoading } = useProposalComments(
    selectedProposalId || 0,
  );

  // Exemplo 4: Criar comentário
  const { mutate: createComment, isPending: isCommentCreating } =
    useCreateComment();

  // Handlers
  const handleCreateProposal = () => {
    createProposal(
      {
        title: "Exemplo de Proposta",
        description: "Descrição da proposta",
        created_by: 1, // Substitua com o ID do usuário logado
      },
      {
        onSuccess: () => {
          console.log("Proposta criada com sucesso!");
        },
        onError: (error) => {
          console.error("Erro ao criar proposta:", error);
        },
      },
    );
  };

  const handleCreateComment = () => {
    if (!selectedProposalId) return;

    createComment(
      {
        proposal_id: selectedProposalId,
        user_id: 1, // Substitua com o ID do usuário logado
        content: "Excelente proposta!",
      },
      {
        onSuccess: () => {
          console.log("Comentário criado com sucesso!");
        },
        onError: (error) => {
          console.error("Erro ao criar comentário:", error);
        },
      },
    );
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Integração da API com React Query</h1>

      {/* Seção de Propostas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Propostas</h2>

        {proposalsLoading && (
          <p className="text-gray-500">Carregando propostas...</p>
        )}
        {proposalsError && (
          <p className="text-red-500">Erro ao carregar propostas</p>
        )}

        {proposals && proposals.length > 0 ? (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold">{proposal.title}</h3>
                <p className="text-gray-600">{proposal.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma proposta encontrada</p>
        )}

        <Button onClick={handleCreateProposal} disabled={isCreating}>
          {isCreating ? "Criando..." : "Criar Proposta"}
        </Button>
      </section>

      {/* Seção de Comentários */}
      {selectedProposalId && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Comentários</h2>

          {commentsLoading && (
            <p className="text-gray-500">Carregando comentários...</p>
          )}

          {comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <p className="font-semibold">
                    {comment.user?.name || "Usuário"}
                  </p>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum comentário encontrado</p>
          )}

          <Button onClick={handleCreateComment} disabled={isCommentCreating}>
            {isCommentCreating ? "Criando..." : "Criar Comentário"}
          </Button>
        </section>
      )}

      {/* Seção de Exemplos de Código */}
      <section className="bg-gray-100 rounded-lg p-4 space-y-4">
        <h2 className="text-2xl font-semibold">Exemplos de Uso</h2>

        <div>
          <h3 className="font-semibold text-lg mb-2">1. Listar Propostas:</h3>
          <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-sm">
            {`const { data: proposals, isLoading } = useProposals();

// proposals é um array de Proposal
// isLoading é true enquanto carrega`}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">2. Criar Proposta:</h3>
          <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-sm">
            {`const { mutate, isPending } = useCreateProposal();

mutate({
  title: 'Minha Proposta',
  description: 'Descrição',
  created_by: userId
}, {
  onSuccess: () => console.log('Sucesso!'),
  onError: (error) => console.error(error)
});`}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            3. Listar Comentários de uma Proposta:
          </h3>
          <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-sm">
            {`const { data: comments, isLoading } = useProposalComments(proposalId);

// Retorna array de Comment`}
          </pre>
        </div>
      </section>
    </div>
  );
}
