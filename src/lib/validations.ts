import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const scoreSchema = z.object({
  score: z.number().int().min(1, "Score must be at least 1").max(45, "Score cannot exceed 45"),
  score_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const charitySelectionSchema = z.object({
  charity_id: z.string().uuid("Invalid charity ID"),
  percentage: z.number().int().min(10, "Minimum contribution is 10%").max(100, "Maximum contribution is 100%"),
});

export const drawCreationSchema = z.object({
  total_pool: z.number().positive("Pool must be a positive number"),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").optional(),
  avatar_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});
