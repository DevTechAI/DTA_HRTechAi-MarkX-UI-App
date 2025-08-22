export type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
export type ExpenseCategory = 'travel' | 'meals' | 'accommodation' | 'supplies' | 'other';

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
  receiptUrl?: string;
  notes?: string;
}

export interface ExpenseClaim {
  id: string;
  userId: string;
  title: string;
  submissionDate: Date;
  status: ExpenseStatus;
  totalAmount: number;
  items: ExpenseItem[];
  approvedBy?: string;
  approvalDate?: Date;
  comments?: string;
}

export interface ExpenseState {
  claims: ExpenseClaim[];
  currentDraft: ExpenseClaim | null;
  isLoading: boolean;
  error: string | null;
}
