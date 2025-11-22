# Integração da API com TanStack React Query

## Configuração Geral

A integração foi configurada com os seguintes componentes:

### 1. **Cliente HTTP** (`src/lib/api.ts`)
- Cliente Axios pré-configurado
- Interceptors para autenticação (adiciona token Bearer)
- Interceptor de erro para logout automático em erro 401

### 2. **Types** (`src/lib/types.ts`)
- Interfaces TypeScript para todos os dados da API
- Organizadas por recurso (Auth, User, Proposal, Comment)

### 3. **Hooks Customizados**

#### `useAuth.ts` - Autenticação
```typescript
// Login
const { mutate, isPending } = useLogin();
mutate({ login: 'email@example.com', password: 'password' });

// Alterar Senha
const { mutate } = useChangePassword();
mutate({ userId: 1, currentPassword: 'old', newPassword: 'new' });
```

#### `useUsers.ts` - Usuários
```typescript
// Listar todos os usuários
const { data: users, isLoading } = useUsers();

// Buscar usuário específico
const { data: user } = useUser(userId);

// Criar usuário
const { mutate } = useCreateUser();
mutate({ name: 'João', cpf: '123.456.789-00', email: 'joao@example.com', birth_date: '1990-01-01', password: 'password' });

// Atualizar usuário
const { mutate } = useUpdateUser(userId);
mutate({ name: 'João Silva', cpf: '123.456.789-00', email: 'joao@example.com', birth_date: '1990-01-01' });

// Deletar usuário
const { mutate } = useDeleteUser(userId);
mutate();
```

#### `useProposals.ts` - Propostas
```typescript
// Listar todas as propostas
const { data: proposals, isLoading } = useProposals();

// Buscar proposta específica
const { data: proposal } = useProposal(proposalId);

// Listar propostas do usuário
const { data: userProposals } = useUserProposals(userId);

// Criar proposta
const { mutate } = useCreateProposal();
mutate({ title: 'Minha Proposta', description: 'Descrição...', created_by: userId });

// Atualizar proposta
const { mutate } = useUpdateProposal(proposalId);
mutate({ title: 'Novo Título', description: 'Nova descrição' });

// Deletar proposta
const { mutate } = useDeleteProposal(proposalId);
mutate();
```

#### `useComments.ts` - Comentários
```typescript
// Buscar comentário específico
const { data: comment } = useComment(commentId);

// Listar comentários de uma proposta
const { data: comments } = useProposalComments(proposalId);

// Listar comentários de um usuário
const { data: userComments } = useUserComments(userId);

// Criar comentário
const { mutate } = useCreateComment();
mutate({ proposal_id: proposalId, user_id: userId, content: 'Meu comentário' });

// Atualizar comentário
const { mutate } = useUpdateComment(commentId);
mutate({ content: 'Novo conteúdo' });

// Deletar comentário
const { mutate } = useDeleteComment(commentId);
mutate();
```

### 4. **Provider** (`src/components/QueryProvider.tsx`)
- Configura o QueryClient com opções padrão
- Já está integrado ao `App.tsx`

## Configurações Padrão

```typescript
queries: {
  staleTime: 1000 * 60 * 5,        // 5 minutos
  gcTime: 1000 * 60 * 10,          // 10 minutos (cache)
  retry: 1,
  refetchOnWindowFocus: false,
}

mutations: {
  retry: 1,
}
```

## Autenticação

O token é armazenado em `localStorage` como `auth_token` e adicionado automaticamente aos headers de todas as requisições.

Para fazer logout:
```typescript
localStorage.removeItem('auth_token');
```

## Tratamento de Erros

Todos os hooks retornam:
- `data`: dados retornados
- `isLoading`: durante a requisição
- `isError`: se houve erro
- `error`: objeto de erro
- `mutate`: função para disparar mutação (em mutations)
- `isPending`: durante mutação

Exemplo:
```typescript
const { mutate, isPending, error } = useCreateProposal();

const handleCreate = () => {
  mutate(
    { title: 'Nova Proposta', created_by: userId },
    {
      onSuccess: () => {
        // Sucesso
      },
      onError: (error) => {
        // Erro
      }
    }
  );
};
```

## Otimizações

- Cache automático com invalidação inteligente
- Requisições em paralelo quando possível
- Retry automático em caso de erro
- Sem refetch ao focar na janela (evita requisições desnecessárias)

## URL da API

Por padrão, a API é esperada em `http://localhost:3000`. Para alterar, edite `src/lib/api.ts`:

```typescript
const API_BASE_URL = 'http://seu-servidor:3000';
```
