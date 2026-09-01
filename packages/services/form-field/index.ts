import { db, eq, max } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import {
  GetFieldsInputType,
  CreateFieldInputType,
  createFieldInput,
  getFiledsInput,
} from "./model";

function toLabelKey(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export default class FormFieldService {
  private async getNextIndex(formId: string): Promise<string> {
    const result = await db
      .select({ maxIndex: max(formFieldsTable.index) })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));

    const current = result[0]?.maxIndex;
    const next = current ? Number(current) + 1 : 1;
    return next.toString();
  }

  public async createField(payload: CreateFieldInputType) {
    const { label, type, formId, description, placeholder, isRequired } =
      await createFieldInput.parseAsync(payload);

    const labelKey = toLabelKey(label);
    const index = await this.getNextIndex(formId);

    const result = await db
      .insert(formFieldsTable)
      .values({
        label,
        labelKey,
        type,
        index,
        formId,
        description,
        placeholder,
        isRequired,
      })
      .returning({
        id: formFieldsTable.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("something went wrong while creating the form field");
    }
    return { id: result[0].id, labelKey, index };
  }

  public async getFields(formId: string) {
    const result = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(formFieldsTable.index);

    return result.map((r) => ({
      id: r.id,
      label: r.label,
      labelKey: r.labelKey,
      type: r.type,
      index: r.index,
      formId: r.formId,
      description: r.description ?? null,
      placeholder: r.placeholder ?? null,
      isRequired: r.isRequired,

      createdAt: r.createdAt ? r.createdAt.toISOString() : null,
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
    }));
  }
}
