import {
    ExpenseClaim,
    ExpenseState
} from '@/types/expense';
import { create } from 'zustand';

interface ExpenseStore extends ExpenseState {
  // Actions
  setClaims: (claims: ExpenseClaim[]) => void;
  setCurrentDraft: (claim: ExpenseClaim | null) => void;
  addClaim: (claim: ExpenseClaim) => void;
  updateClaim: (id: string, updates: Partial<ExpenseClaim>) => void;
  deleteClaim: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  claims: [],
  currentDraft: null,
  isLoading: false,
  error: null,

  setClaims: (claims) => set({ claims }),
  setCurrentDraft: (claim) => set({ currentDraft: claim }),
  addClaim: (claim) => set((state) => ({
    claims: [claim, ...state.claims]
  })),
  updateClaim: (id, updates) => set((state) => ({
    claims: state.claims.map(claim => 
      claim.id === id ? { ...claim, ...updates } : claim
    )
  })),
  deleteClaim: (id) => set((state) => ({
    claims: state.claims.filter(claim => claim.id !== id)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
