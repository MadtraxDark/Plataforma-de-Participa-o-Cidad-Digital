import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "@/lib/types";

const COMMENTS_QUERY_KEY = ["comments"];

export const useComment = (id: number) => {
  return useQuery({
    queryKey: [...COMMENTS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<Comment>(`/api/comments/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useProposalComments = (proposalId: number) => {
  return useQuery({
    queryKey: [...COMMENTS_QUERY_KEY, "proposal", proposalId],
    queryFn: async () => {
      const response = await apiClient.get<Comment[]>(
        `/api/comments/proposal/${proposalId}`,
      );
      return response.data;
    },
    enabled: !!proposalId,
  });
};

export const useUserComments = (userId: number) => {
  return useQuery({
    queryKey: [...COMMENTS_QUERY_KEY, "user", userId],
    queryFn: async () => {
      const response = await apiClient.get<Comment[]>(
        `/api/comments/user/${userId}`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      const response = await apiClient.post<Comment>("/api/comments", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [...COMMENTS_QUERY_KEY, "proposal", data.proposal_id],
      });
    },
  });
};

export const useUpdateComment = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCommentRequest) => {
      const response = await apiClient.put<Comment>(
        `/api/comments/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [...COMMENTS_QUERY_KEY, "proposal", data.proposal_id],
      });
      queryClient.invalidateQueries({ queryKey: [...COMMENTS_QUERY_KEY, id] });
    },
  });
};

export const useDeleteComment = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...COMMENTS_QUERY_KEY, id] });
    },
  });
};
