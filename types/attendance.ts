export type AttendanceMode = 'Online' | 'Offline';

export type AttendanceLocation = 'Office 1' | 'Office 2' | 'Office 3' | 'Remote';

export interface AttendanceSession {
  id: string;
  userId: string;
  start: Date;
  end?: Date;
  mode: AttendanceMode;
  location?: AttendanceLocation;
  notes?: string;
}

export interface AttendanceState {
  currentSession: AttendanceSession | null;
  history: AttendanceSession[];
  isLoading: boolean;
  error: string | null;
}
