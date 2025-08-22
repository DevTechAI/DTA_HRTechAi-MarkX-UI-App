export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type LeaveType = 'annual' | 'sick' | 'personal' | 'bereavement' | 'other';

export interface LeaveRequest {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvalDate?: Date;
  comments?: string;
}

export interface LeaveState {
  requests: LeaveRequest[];
  isLoading: boolean;
  error: string | null;
}
