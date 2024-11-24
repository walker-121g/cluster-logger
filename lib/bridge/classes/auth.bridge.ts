import { request } from "../http";

import { LoginSchema } from "@/forms/login.form";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type Context = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: "USER" | "DEVELOPER" | "ADMIN" | "SUPPORT";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: number;
    userId: number;
    name: string;
    description: string;
    image: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export class AuthBridge {
  public static async login(input: LoginSchema) {
    try {
      return await request<Tokens>({
        method: "POST",
        path: "/auth/login",
        body: input,
        noAuth: true,
        noRetry: true,
      });
    } catch (error) {
      console.log(`Error in AuthBridge.login: ${error}`);
      throw Error;
    }
  }

  public static async context() {
    try {
      return await request({
        method: "GET",
        path: "/auth/me",
      });
    } catch (error) {
      console.log(`Error in AuthBridge.context: ${error}`);
      throw Error;
    }
  }
}
