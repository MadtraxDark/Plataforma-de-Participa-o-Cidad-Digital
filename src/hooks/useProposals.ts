import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type {
  Proposal,
  CreateProposalRequest,
  UpdateProposalRequest,
} from '@/lib/types';

const PROPOSALS_QUERY_KEY = ['proposals'];

export const useProposals = () => {
  return useQuery({
    queryKey: PROPOSALS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get<Proposal[]>('/api/proposals');
      return response.data;
    },
  });
};

export const useProposal = (id: number) => {
  return useQuery({
    queryKey: [...PROPOSALS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<Proposal>(`/api/proposals/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUserProposals = (userId: number) => {
  return useQuery({
    queryKey: [...PROPOSALS_QUERY_KEY, 'user', userId],
    queryFn: async () => {
      const response = await apiClient.get<Proposal[]>(
        `/api/proposals/user/${userId}`
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useCreateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProposalRequest) => {
      const response = await apiClient.post<Proposal>('/api/proposals', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEY });
    },
  });
};

export const useUpdateProposal = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProposalRequest) => {
      const response = await apiClient.put<Proposal>(
        `/api/proposals/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PROPOSALS_QUERY_KEY, id] });
    },
  });
};

export const useDeleteProposal = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/proposals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...PROPOSALS_QUERY_KEY, id] });
    },
  });
};
