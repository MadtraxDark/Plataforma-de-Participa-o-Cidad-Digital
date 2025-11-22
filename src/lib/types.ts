// Auth
export interface LoginRequest {
  login: string;
  password: string;
}

export interface ChangePasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
}

// User
export interface User {
  id: number;
  name: string;
  cpf: string;
  email: string;
  birth_date: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  name: string;
  cpf: string;
  email: string;
  birth_date: string;
  phone?: string;
  password: string;
}

export interface UpdateUserRequest {
  name: string;
  cpf: string;
  email: string;
  birth_date: string;
  phone?: string;
}

// Proposal
export interface Proposal {
  id: number;
  title: string;
  description?: string;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  user?: User;
}

export interface CreateProposalRequest {
  title: string;
  description?: string;
  created_by: number;
}

export interface UpdateProposalRequest {
  title: string;
  description?: string;
}

// Comment
export interface Comment {
  id: number;
  proposal_id: number;
  user_id: number;
  content: string;
  created_at?: string;
  updated_at?: string;
  user?: User;
}

export interface CreateCommentRequest {
  proposal_id: number;
  user_id: number;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}
