import { create } from 'zustand';

export type TimesheetStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type ProjectType = 'internal' | 'client' | 'administrative';

export interface TimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  projectType: ProjectType;
  description: string;
  date: Date;
  hours: number;
  billable: boolean;
}

export interface Timesheet {
  id: string;
  userId: string;
  weekStarting: Date;
  weekEnding: Date;
  entries: TimeEntry[];
  totalHours: number;
  billableHours: number;
  status: TimesheetStatus;
  submittedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  comments?: string;
}

interface TimesheetState {
  timesheets: Timesheet[];
  currentTimesheet: Timesheet | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTimesheets: (timesheets: Timesheet[]) => void;
  setCurrentTimesheet: (timesheet: Timesheet | null) => void;
  addTimesheet: (timesheet: Timesheet) => void;
  updateTimesheet: (id: string, updates: Partial<Timesheet>) => void;
  deleteTimesheet: (id: string) => void;
  addTimeEntry: (timesheetId: string, entry: TimeEntry) => void;
  updateTimeEntry: (timesheetId: string, entryId: string, updates: Partial<TimeEntry>) => void;
  deleteTimeEntry: (timesheetId: string, entryId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTimesheetStore = create<TimesheetState>((set) => ({
  timesheets: [],
  currentTimesheet: null,
  isLoading: false,
  error: null,

  setTimesheets: (timesheets) => set({ timesheets }),
  setCurrentTimesheet: (timesheet) => set({ currentTimesheet: timesheet }),
  addTimesheet: (timesheet) => set((state) => ({
    timesheets: [timesheet, ...state.timesheets]
  })),
  updateTimesheet: (id, updates) => set((state) => ({
    timesheets: state.timesheets.map(timesheet => 
      timesheet.id === id ? { ...timesheet, ...updates } : timesheet
    )
  })),
  deleteTimesheet: (id) => set((state) => ({
    timesheets: state.timesheets.filter(timesheet => timesheet.id !== id)
  })),
  addTimeEntry: (timesheetId, entry) => set((state) => ({
    timesheets: state.timesheets.map(timesheet => 
      timesheet.id === timesheetId 
        ? { 
            ...timesheet, 
            entries: [...timesheet.entries, entry],
            totalHours: timesheet.totalHours + entry.hours,
            billableHours: timesheet.billableHours + (entry.billable ? entry.hours : 0)
          } 
        : timesheet
    )
  })),
  updateTimeEntry: (timesheetId, entryId, updates) => set((state) => {
    const timesheet = state.timesheets.find(t => t.id === timesheetId);
    if (!timesheet) return state;
    
    const oldEntry = timesheet.entries.find(e => e.id === entryId);
    if (!oldEntry) return state;
    
    const hoursDiff = (updates.hours !== undefined) ? updates.hours - oldEntry.hours : 0;
    const billableDiff = (updates.billable !== undefined && updates.billable !== oldEntry.billable) 
      ? (updates.billable ? oldEntry.hours : -oldEntry.hours) 
      : 0;

    const updatedTimesheet = {
      ...timesheet,
      entries: timesheet.entries.map(entry => 
        entry.id === entryId ? { ...entry, ...updates } : entry
      ),
      totalHours: timesheet.totalHours + hoursDiff,
      billableHours: timesheet.billableHours + billableDiff + (updates.billable ? hoursDiff : 0)
    };

    return {
      timesheets: state.timesheets.map(t => 
        t.id === timesheetId ? updatedTimesheet : t
      )
    };
  }),
  deleteTimeEntry: (timesheetId, entryId) => set((state) => {
    const timesheet = state.timesheets.find(t => t.id === timesheetId);
    if (!timesheet) return state;
    
    const entryToDelete = timesheet.entries.find(e => e.id === entryId);
    if (!entryToDelete) return state;
    
    return {
      timesheets: state.timesheets.map(t => 
        t.id === timesheetId 
          ? {
              ...t,
              entries: t.entries.filter(e => e.id !== entryId),
              totalHours: t.totalHours - entryToDelete.hours,
              billableHours: t.billableHours - (entryToDelete.billable ? entryToDelete.hours : 0)
            }
          : t
      )
    };
  }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
