import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formFieldService } from "../../services";

import {
  createFieldInputModel,
  createFieldOutputModel,
  getFieldInputModel,
  getFieldOutputModel,
} from "./model";

const TAGS = ["FormField"];
const getPath = generatePath("/form-field");

export const formFieldRouter = router({
  createField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFieldInputModel)
    .output(createFieldOutputModel)
    .mutation(async ({ input }) => {
      const { label, type, formId, description, placeholder, isRequired } = input;

      const result = await formFieldService.createField({
        label,
        type,
        formId,
        description,
        placeholder,
        isRequired,
      });
      return result;
    }),

  getFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFields"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getFieldInputModel)
    .output(getFieldOutputModel)
    .query(async ({ input }) => {
      const { formId } = input;
      const result = await formFieldService.getFields(formId);
      return result;
    }),
});
