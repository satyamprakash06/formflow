import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().min(1).max(255).describe("Title is required"),
  description: z.string().max(1000).optional().describe("Description of the form"),
  createdBy: z.uuid().describe("User ID of the creator"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const listFormsByUserIdInput = z.object({
  userId: z.uuid().describe("User ID to list forms for"),
});

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>;
