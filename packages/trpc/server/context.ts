import type { CookieOptions } from "express";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import {
  setCookie as setCookieUtils,
  getCookie as getCookieUtils,
  clearCookie as clearCookieUtils,
} from "./utils/cookie";

export interface TRPCCtxUser {
  id: string;
}

export interface TRPCContext {
  setCookie: (name: string, value: string, opts: CookieOptions) => void;
  getCookie: (name: string) => string | undefined;
  clearCookie: (name: string) => void;

  user?: TRPCCtxUser;
}

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const ctx: TRPCContext = {
    setCookie(name: string, value: string, opts: CookieOptions) {
      return setCookieUtils(res, name, value, opts);
    },
    getCookie(name: string) {
      return getCookieUtils(req, name);
    },
    clearCookie(name: string) {
      return clearCookieUtils(res, name);
    },

    user: undefined,
  };
  return ctx;
}
export type Context = Awaited<ReturnType<typeof createContext>>;
