import { z } from "zod"

// Expense validation schema
export const expenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().datetime().or(z.date()),
  description: z.string().optional(),
  receiptPath: z.string().optional(),
})

export type ExpenseInput = z.infer<typeof expenseSchema>
