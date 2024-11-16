import { ApiError, AuthError } from "./error";
import { useAuth } from "@/hooks/auth.hook";

export const request = async <T>({
  method,
  path,
  body,
  headers,
  noAuth,
  noRetry,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: `/${string}`;
  body?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  noAuth?: boolean;
  noRetry?: boolean;
}): Promise<T> => {
  try {
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");

    const { token, expiresAt } = useAuth.getState();
    if (token && !noAuth) {
      if (expiresAt && expiresAt <= Date.now()) {
        throw new AuthError(
          "Unable to verify authorization, please log in again.",
        );
      }

      requestHeaders.append("Authorization", `Bearer ${token}`);
    }

    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        requestHeaders.append(key, value as string);
      }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const result = await response.json();
    if (response.status !== 200) {
      if (response.status === 401 && !noAuth) {
        throw new AuthError(
          "Unable to verify authorization, please log in again.",
        );
      }
      throw new ApiError(result.error, response.status);
    }

    return result as T;
  } catch (error) {
    if (error instanceof AuthError) {
      if (!noRetry) {
        useAuth.getState().refresh();
        return request({
          method,
          path,
          body,
          headers,
          noRetry: true,
        });
      } else {
        useAuth.getState().unauthenticate();
        throw error;
      }
    } else if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    } else {
      throw new ApiError(
        `An unknown error occurred while activating resource ${path}.`,
        500,
      );
    }
  }
};
