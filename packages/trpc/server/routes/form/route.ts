import { authenticatedProcedure, publicProcedure, router } from "../../trpc";

import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";

import {
  createFormInputModel,
  createFormOutputModel,
  listFormInputModel,
  listFormOutputModel,
  getFormInputModel,
  getFormOutputModel,
} from "./model";

const TAGS = ["form"];
const getPath = generatePath("./form");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;
      const { id } = await formService.createForm({
        title,
        description,
        createdBy: ctx.user.id,
      });
      return { id };
    }),

  listForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listForms"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listFormInputModel)
    .output(listFormOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormsByUserId({
        userId: ctx.user.id,
      });
      return forms;
    }),

  getFormWithFields: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormWithFields"),
        tags: TAGS,
      },
    })
    .input(getFormInputModel)
    .output(getFormOutputModel)
    .query(async ({ input }) => {
      const { formId } = input;
      const form = await formService.getFormWithFields(formId);
      return form;
    }),
});
