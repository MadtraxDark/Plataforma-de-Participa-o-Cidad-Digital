import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type { LoginRequest, ChangePasswordRequest, AuthResponse } from '@/lib/types';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/login',
        credentials
      );
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response.data;
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await apiClient.put<AuthResponse>(
        '/api/auth/change-password',
        data
      );
      return response.data;
    },
  });
};
