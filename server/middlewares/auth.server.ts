import { headers } from "next/headers";
import { verify } from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { users } from "@/schema";
import data from "../data";

export const getContext = async () => {
  const incomingHeaders = headers();
  const authorization = incomingHeaders.get("authorization");

  if (!authorization) {
    return null;
  }

  const token = authorization.replace("Bearer ", "");
  const decoded = verify(token, process.env.JWT_SECRET!, {
    algorithms: ["HS256"],
  }) as {
    email: string;
  };

  const result = await data
    .select()
    .from(users)
    .where(eq(users.email, decoded.email))
    .limit(1);

  return result.length > 0 ? result[0] : null;
};
