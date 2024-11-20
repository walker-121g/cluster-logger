import { eq } from "drizzle-orm";

import { ServerError } from "@/server/server.error";

import data from "@/server/data";
import { userProfiles } from "@/schema";
import { getContext } from "@/server/middlewares/auth.server";
import { success, failure } from "@/server/middlewares/response.server";

export const GET = async () => {
  try {
    const context = await getContext();
    if (!context) {
      throw new ServerError("Unauthorized", 401);
    }

    const profile = await data
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, context.id))
      .limit(1);

    return success({
      ...context,
      profile: profile.length > 0 ? profile[0] : null,
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
