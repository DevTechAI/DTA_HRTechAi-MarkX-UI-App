import { z } from 'zod';

// Expense Item Schema
export const expenseItemSchema = z.object({
  description: z.string()
    .min(3, "Description must be at least 3 characters")
    .max(100, "Description cannot exceed 100 characters"),
  amount: z
    .number({ required_error: "Amount is required" })
    .positive("Amount must be positive"),
  date: z.date({
    required_error: "Date is required",
  }),
  category: z.enum(['travel', 'meals', 'accommodation', 'supplies', 'other'] as const, {
    required_error: "Category is required",
  }),
  receipt: z.any().optional(),
  notes: z.string().max(200, "Notes cannot exceed 200 characters").optional(),
});

// Expense Claim Form Schema
export const expenseFormSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  items: z
    .array(expenseItemSchema)
    .min(1, "At least one expense item is required"),
  comments: z.string().max(500, "Comments cannot exceed 500 characters").optional(),
});

export type ExpenseItemFormValues = z.infer<typeof expenseItemSchema>;
export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// Default values for expense item
export const defaultExpenseItemValues: ExpenseItemFormValues = {
  description: '',
  amount: 0,
  date: new Date(),
  category: 'other',
  receipt: null,
  notes: '',
};

// Default values for expense form
export const defaultExpenseFormValues: ExpenseFormValues = {
  title: '',
  items: [defaultExpenseItemValues],
  comments: '',
};
