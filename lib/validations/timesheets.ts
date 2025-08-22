import { z } from 'zod';

// Time Entry Schema
export const timeEntrySchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  projectName: z.string().min(1, "Project name is required"),
  projectType: z.enum(['internal', 'client', 'administrative'] as const, {
    required_error: "Project type is required",
  }),
  description: z.string()
    .min(3, "Description must be at least 3 characters")
    .max(200, "Description cannot exceed 200 characters"),
  date: z.date({
    required_error: "Date is required",
  }),
  hours: z
    .number({ required_error: "Hours is required" })
    .positive("Hours must be positive")
    .max(24, "Hours cannot exceed 24"),
  billable: z.boolean().default(false),
});

// Timesheet Form Schema
export const timesheetFormSchema = z.object({
  weekStarting: z.date({
    required_error: "Week starting date is required",
  }),
  entries: z
    .array(timeEntrySchema)
    .min(1, "At least one time entry is required"),
  comments: z.string().max(500, "Comments cannot exceed 500 characters").optional(),
});

export type TimeEntryFormValues = z.infer<typeof timeEntrySchema>;
export type TimesheetFormValues = z.infer<typeof timesheetFormSchema>;

// Default values for time entry
export const defaultTimeEntryValues: TimeEntryFormValues = {
  projectId: '',
  projectName: '',
  projectType: 'internal',
  description: '',
  date: new Date(),
  hours: 0,
  billable: false,
};

// Default values for timesheet form
export const defaultTimesheetFormValues: TimesheetFormValues = {
  weekStarting: new Date(),
  entries: [defaultTimeEntryValues],
  comments: '',
};
