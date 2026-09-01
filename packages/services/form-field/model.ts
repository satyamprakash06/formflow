import { z } from "zod";

const fieldTypeEnum = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

export const createFieldInput = z.object({
  label: z.string().min(1).max(255).describe("Label of the field"),
  type: fieldTypeEnum.describe("Type of the field"),
  formId: z.uuid().describe("UUID of the form to which the field belongs"),
  description: z.string().max(1000).optional().describe("Description of the field"),
  placeholder: z.string().max(255).optional().describe("Placeholder text for the field"),
  isRequired: z.boolean().optional().default(false).describe("Indicates if the field is required"),
});

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const getFiledsInput = z.object({
  formId: z.uuid().describe("UUID of the form to which the fields belong"),
});
export type GetFieldsInputType = z.infer<typeof getFiledsInput>;
