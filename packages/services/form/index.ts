import { db } from "@repo/database";
import { formsTable } from "@repo/database/models/form";

import { createFormInput, CreateFormInputType } from "./model";

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
}
