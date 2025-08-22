import { z } from 'zod';

// Leave Request Form Schema
export const leaveFormSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  type: z.enum(['annual', 'sick', 'personal', 'bereavement', 'other'] as const, {
    required_error: "Leave type is required",
  }),
  reason: z.string()
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason cannot exceed 500 characters"),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        size: z.number(),
      })
    )
    .optional(),
})
.refine(data => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type LeaveFormValues = z.infer<typeof leaveFormSchema>;

// Default values for the leave form
export const defaultLeaveValues: LeaveFormValues = {
  startDate: new Date(),
  endDate: new Date(),
  type: 'annual',
  reason: '',
  attachments: [],
};
