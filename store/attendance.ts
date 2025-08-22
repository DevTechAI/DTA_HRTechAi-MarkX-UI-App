import { AttendanceSession, AttendanceState } from '@/types/attendance';
import { create } from 'zustand';

interface AttendanceStore extends AttendanceState {
  // Actions
  setCurrentSession: (session: AttendanceSession | null) => void;
  addToHistory: (session: AttendanceSession) => void;
  setHistory: (history: AttendanceSession[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  currentSession: null,
  history: [],
  isLoading: false,
  error: null,

  setCurrentSession: (session) => set({ currentSession: session }),
  addToHistory: (session) => set((state) => ({ 
    history: [session, ...state.history] 
  })),
  setHistory: (history) => set({ history }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
