import { sign } from "jsonwebtoken";
import { randomBytes, pbkdf2Sync, createHash } from "crypto";
import { eq } from "drizzle-orm";

import { NextRequest } from "next/server";

import { ServerError } from "@/server/server.error";
import { LoginSchema, loginSchema } from "@/forms/login.form";

import data from "@/server/data";
import { success, failure } from "@/server/middlewares/response.server";
import { users, userCredentials, userSessions } from "@/schema";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const schema = await loginSchema.safeParseAsync(body);
    if (schema.error) {
      throw new ServerError(schema.error.message, 400);
    }

    const { email, password } = schema.data as LoginSchema;
    const user = await data
      .select()
      .from(users)
      .innerJoin(userCredentials, eq(userCredentials.userId, users.id))
      .where(eq(users.email, email))
      .limit(1);

    if (user.length < 0) {
      throw new ServerError("Invalid email or password", 401);
    }

    const [storedSalt, storedPassword] =
      user[0].user_credentials.password.split(":");

    const result = pbkdf2Sync(
      password,
      storedSalt,
      1000,
      64,
      "sha512",
    ).toString("hex");
    if (result !== storedPassword) {
      throw new ServerError("Invalid email or password", 401);
    }

    const token = sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "10min",
      algorithm: "HS256",
    });

    const refreshToken = randomBytes(64).toString("hex");
    const hashAlgorithm = createHash("sha512");
    hashAlgorithm.update(refreshToken);

    const refreshTokenHash = hashAlgorithm.digest("hex");
    await data.insert(userSessions).values({
      userId: user[0].users.id,
      token: refreshTokenHash,
      region: "temp",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    return success({
      accessToken: token,
      refreshToken: refreshToken,
      expiresIn: 60 * 10,
    });
  } catch (error) {
    if (error instanceof ServerError) {
      return error.toResponse();
    } else if (error instanceof Error) {
      return failure(500, error.message);
    }

    return failure(
      500,
      "An unknown server error occurred, please try again later",
    );
  }
};
