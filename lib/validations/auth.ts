import { z } from 'zod';

// Login Form Schema
export const loginFormSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

// Registration Form Schema
export const registrationFormSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: z
    .string(),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name cannot exceed 50 characters"),
  department: z
    .string()
    .min(1, "Department is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Profile Update Form Schema
export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name cannot exceed 50 characters"),
  photoURL: z
    .string()
    .url("Please enter a valid URL")
    .nullable()
    .optional(),
  department: z
    .string()
    .min(1, "Department is required"),
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;

// Default values for the login form
export const defaultLoginValues: LoginFormValues = {
  email: '',
  password: '',
};

// Default values for the registration form
export const defaultRegistrationValues: RegistrationFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  department: '',
};

// Default values for the profile update form
export const defaultProfileUpdateValues: ProfileUpdateValues = {
  displayName: '',
  photoURL: null,
  department: '',
  bio: '',
};
