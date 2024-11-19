import { sign } from "jsonwebtoken";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";

import { NextRequest } from "next/server";

import { ServerError } from "@/server/server.error";
import { RefreshSchema, refreshSchema } from "@/forms/tokens/refresh.form";

import data from "@/server/data";
import { success, failure } from "@/server/middlewares/response.server";
import { users, userSessions } from "@/schema";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const schema = await refreshSchema.safeParseAsync(body);
    if (schema.error) {
      throw new ServerError(schema.error.message, 400);
    }

    const { token } = schema.data as RefreshSchema;
    const refreshTokenHash = createHash("sha512").update(token).digest("hex");

    const user = await data
      .select()
      .from(userSessions)
      .innerJoin(users, eq(userSessions.userId, users.id))
      .where(eq(userSessions.token, refreshTokenHash))
      .limit(1);

    if (user.length < 0) {
      throw new ServerError("Invalid refresh token", 401);
    }

    if (Date.now() > user[0].user_sessions.expiresAt.getTime()) {
      await data
        .delete(userSessions)
        .where(eq(userSessions.id, user[0].user_sessions.id));

      throw new ServerError("Refresh token has expired", 401);
    }

    const newToken = sign(
      { email: user[0].users.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "10min",
        algorithm: "HS256",
      },
    );

    return success({
      accessToken: newToken,
      refreshToken: token,
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
