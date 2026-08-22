import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { userService } from "./services";

export const tRPCContext = initTRPC.meta<OpenApiMeta>().context<typeof createContext>().create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;
export const authenticatedProcedure = tRPCContext.procedure.use(async (options) => {
  const { ctx } = options;

  const token = ctx.getCookie("token");
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }
  const { id } = await userService.verifyAndDecodeToken(token);
  return options.next({
    ctx: {
      ...ctx,
      user: { id },
    },
  });
});
