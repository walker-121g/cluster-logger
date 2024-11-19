import { createHash } from "crypto";
import { eq } from "drizzle-orm";

import { NextRequest } from "next/server";

import { ServerError } from "@/server/server.error";
import { RefreshSchema, refreshSchema } from "@/forms/tokens/refresh.form";

import data from "@/server/data";
import { success, failure } from "@/server/middlewares/response.server";
import { userSessions } from "@/schema";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const schema = await refreshSchema.safeParseAsync(body);
    if (schema.error) {
      throw new ServerError(schema.error.message, 400);
    }

    const { token } = schema.data as RefreshSchema;
    const refreshTokenHash = createHash("sha512").update(token).digest("hex");

    await data
      .delete(userSessions)
      .where(eq(userSessions.token, refreshTokenHash));

    return success({
      success: true,
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
