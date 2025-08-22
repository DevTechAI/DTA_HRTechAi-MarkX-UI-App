import { z } from 'zod';

// Attendance Form Schemas
export const attendanceFormSchema = z.object({
  mode: z.enum(['Online', 'Offline'] as const),
  location: z
    .enum(['Office 1', 'Office 2', 'Office 3', 'Remote'] as const)
    .optional()
    .nullable(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

// Default values for the attendance form
export const defaultAttendanceValues: AttendanceFormValues = {
  mode: 'Online',
  location: null,
  notes: '',
};
