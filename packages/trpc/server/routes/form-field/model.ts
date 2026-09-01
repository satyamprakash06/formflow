import { z } from "zod";

export const fieldTypeEnum = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

export const createFieldInputModel = z.object({
  label: z.string().min(1).describe("The label of the form field"),
  type: fieldTypeEnum.describe("The type of the form field"),
  formId: z.uuid().describe("The ID of the form this field belongs to"),
  description: z
    .string()
    .max(1000)
    .optional()
    .describe("An optional description for the form field"),
  placeholder: z.string().optional().describe("An optional placeholder for the form field"),
  isRequired: z
    .boolean()
    .optional()
    .default(false)
    .describe("Whether the form field is required or not"),
});

export const createFieldOutputModel = z.object({
  id: z.uuid().describe("The ID of the created form field"),
  labelKey: z.string().describe("The label key of the form field"),
  index: z.string().describe("The index of the form field"),
});

export const getFieldInputModel = z.object({
  formId: z.uuid().describe("The ID of the form field to retrieve"),
});

export const FieldOutputModel = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().nullable(),
  placeholder: z.string().nullable(),
  isRequired: z.boolean(),
  labelKey: z.string(),
  type: fieldTypeEnum,
  formId: z.string().nullable(),
  index: z.string(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const getFieldOutputModel = z.array(FieldOutputModel);

export type CreateFieldInputModel = z.infer<typeof createFieldInputModel>;
export type CreateFieldOutputModel = z.infer<typeof createFieldOutputModel>;
export type GetFieldInputModel = z.infer<typeof getFieldInputModel>;
export type GetFieldOutputModel = z.infer<typeof getFieldOutputModel>;
