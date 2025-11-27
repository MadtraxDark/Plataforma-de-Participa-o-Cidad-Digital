import { useQuery } from "@tanstack/react-query";
import {
  mockVotings,
  mockProposals,
  mockNotifications,
  mockDashboardStats,
  mockUser,
} from "@/lib/mockData";

// Simula delays de API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useVotings = () => {
  return useQuery({
    queryKey: ["votings"],
    queryFn: async () => {
      await delay(500);
      return mockVotings;
    },
  });
};

export const useProposals = () => {
  return useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      await delay(500);
      return mockProposals;
    },
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      await delay(300);
      return mockNotifications;
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      await delay(400);
      return mockDashboardStats;
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      await delay(300);
      return mockUser;
    },
  });
};
