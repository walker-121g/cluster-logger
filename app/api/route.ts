import { success } from "@/server/middlewares/response.server";

export const GET = async () => {
  return success({
    version: process.env.API_VERSION || "v0.0.1-beta",
    status: "API status :: OK",
  });
};
