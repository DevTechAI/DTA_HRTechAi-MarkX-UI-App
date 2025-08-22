import { LeaveRequest, LeaveState } from '@/types/leave';
import { create } from 'zustand';

interface LeaveStore extends LeaveState {
  // Actions
  setRequests: (requests: LeaveRequest[]) => void;
  addRequest: (request: LeaveRequest) => void;
  updateRequest: (id: string, updates: Partial<LeaveRequest>) => void;
  deleteRequest: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLeaveStore = create<LeaveStore>((set) => ({
  requests: [],
  isLoading: false,
  error: null,

  setRequests: (requests) => set({ requests }),
  addRequest: (request) => set((state) => ({
    requests: [request, ...state.requests]
  })),
  updateRequest: (id, updates) => set((state) => ({
    requests: state.requests.map(request => 
      request.id === id ? { ...request, ...updates } : request
    )
  })),
  deleteRequest: (id) => set((state) => ({
    requests: state.requests.filter(request => request.id !== id)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
