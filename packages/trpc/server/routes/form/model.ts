import { z } from "zod";
import { fieldOutputModel } from "../form-field/model";

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

export const getFormInputModel = z.object({
  formId: z.uuid().describe("UUID of the form to retrieve"),
});

export const getFormOutputModel = z.object({
  id: z.string().describe("ID of the form"),
  title: z.string().describe("Title of the form"),
  description: z.string().nullable().describe("Description of the form"),
  createdAt: z.string().nullable().describe("Timestamp of when the form was created"),
  updatedAt: z.string().nullable().describe("Last updated timestamp of the form"),
  fields: z.array(fieldOutputModel).describe("Array of fields associated with the form"),
});
