import { z } from "zod";

export const createFormInputModel = z.object({
  title: z.string().min(1).max(255).describe("Title is required"),
  description: z.string().max(1000).optional().describe("Description of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("ID of the created form"),
});

export const listFormInputModel = z.undefined().describe("No input required for listing forms");

export const listFormOutputModel = z.array(
  z.object({
    id: z.string().describe("ID of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().nullable().optional().describe("Description of the form"),
    createdAt: z.date().nullable().describe("Timestamp of when the form was created"),
    updatedAt: z.date().nullable().describe("Last updated timestamp of the form"),
  }),
);
