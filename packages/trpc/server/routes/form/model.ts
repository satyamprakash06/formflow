import { z } from "zod";

export const createFormInputModel = z.object({
  title: z.string().min(1).max(255).describe("Title is required"),
  description: z.string().max(1000).optional().describe("Description of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("ID of the created form"),
});
