import { db, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";

import {
  createFormInput,
  CreateFormInputType,
  listFormsByUserIdInput,
  ListFormsByUserIdInputType,
} from "./model";
import { file } from "zod";

export default class FormService {
  public async createForm(payload: CreateFormInputType) {
    const { title, description, createdBy } = await createFormInput.parseAsync(payload);

    const result = await db
      .insert(formsTable)
      .values({
        title,
        description,
        createdBy,
      })
      .returning({
        id: formsTable.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("somting went wrong whoile creating the form");
    }
    return {
      id: result[0].id,
    };
  }

  public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
    const { userId } = await listFormsByUserIdInput.parseAsync(payload);

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));

    return forms;
  }

  public async getFormWithFields(formId: string) {
    const rows = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,

        field_Id: formFieldsTable.id,
        field_label: formFieldsTable.label,
        filed_formId: formFieldsTable.formId,
        form_labelKey: formFieldsTable.labelKey,
        field_description: formFieldsTable.description,
        field_placeholder: formFieldsTable.placeholder,
        field_isRequired: formFieldsTable.isRequired,
        field_index: formFieldsTable.index,
        field_type: formFieldsTable.type,
        filed_createdAt: formFieldsTable.createdAt,
        field_updatedAt: formFieldsTable.updatedAt,
      })
      .from(formsTable)
      .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
      .where(eq(formsTable.id, formId))
      .orderBy(formFieldsTable.index);

    if (!rows || rows.length === 0) {
      throw new Error(`Form with id ${formId} not found`);
    }

    const first = rows[0]!;

    const form = {
      id: first.id,
      title: first.title,
      description: first.description ?? null,
      createdAt: first.createdAt ? first.createdAt.toISOString() : null,
      updatedAt: first.updatedAt ? first.updatedAt.toISOString() : null,
      fields: [] as Array<any>,
    };

    for (const r of rows) {
      if (!r.field_Id) continue;

      form.fields.push({
        id: r.field_Id,
        label: r.field_label,
        formId: r.filed_formId,
        labelKey: r.form_labelKey,
        description: r.field_description ?? null,
        placeholder: r.field_placeholder ?? null,
        isRequired: r.field_isRequired,
        index: r.field_index!.toString(),
        type: r.field_type,
        createdAt: r.filed_createdAt ? r.filed_createdAt.toISOString() : null,
        updatedAt: r.field_updatedAt ? r.field_updatedAt.toISOString() : null,
      });
    }

    return form;
  }
}
