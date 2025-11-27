import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/lib/types";

const USERS_QUERY_KEY = ["users"];

export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get<User[]>("/api/users");
      return response.data;
    },
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<User>(`/api/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await apiClient.post<User>("/api/users", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

export const useUpdateUser = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserRequest) => {
      const response = await apiClient.put<User>(`/api/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...USERS_QUERY_KEY, id] });
    },
  });
};

export const useDeleteUser = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...USERS_QUERY_KEY, id] });
    },
  });
};
