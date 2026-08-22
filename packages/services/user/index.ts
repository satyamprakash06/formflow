import { db, eq } from "@repo/database";
import { userTable } from "@repo/database/models/user";
import bcrypt from "bcryptjs";
import * as JWT from "jsonwebtoken";

import { env } from "../env";

import {
  createUserWithEmailAndPassword,
  type CreateUserWithEmailAndPasswordType,
  generateUserTokenPayload,
  type GenerateUserTokenPayloadType,
  signInUserWithEmailAndPassword,
  type SignInUserWithEmailAndPasswordType,
} from "./model";

export default class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(userTable).where(eq(userTable.email, email));

    if (!result || result.length === 0) return null;

    return result[0];
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);

    const token = JWT.sign({ id }, env.JWT_SECRET);

    return { token };
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordType) {
    // data receve and validate
    // check in db if this already visits
    // hash the password
    // create a new user
    // jwt token, we will set it in cookie
    // return

    const { fullName, email, password } = await createUserWithEmailAndPassword.parseAsync(payload);
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User with this Email alredy Exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db
      .insert(userTable)
      .values({ fullName, email, passwordHash })
      .returning({ id: userTable.id });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("something went wrong while creating new user");
    }

    //   token generation
    const { token } = await this.generateUserToken({ id: result[0].id });

    return {
      id: result[0]?.id,
      token,
    };
  }

  public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordType) {
    const { email, password } = await signInUserWithEmailAndPassword.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);
    if (!existingUser) {
      throw new Error("User with this Email does not exist");
    }
    if (!existingUser.passwordHash) {
      throw new Error("Invalid authentication method, please use another method to sign in");
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate a token for the signed-in user
    const { token } = await this.generateUserToken({ id: existingUser.id });

    return {
      id: existingUser.id,
      token,
    };
  }
}
