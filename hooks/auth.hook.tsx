import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  token?: string;
  refreshToken?: string;
  expiresAt?: number;
};

type AuthActions = {
  authenticate: (
    token: string,
    refreshToken: string,
    expiresAt: number,
  ) => void;
  unauthenticate: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const useAuth = create(
  persist<AuthState & AuthActions>(
    (set, get) => ({
      token: undefined,
      refreshToken: undefined,
      expiresAt: undefined,
      authenticate: (token, refreshToken, expiresAt) =>
        set({ token, refreshToken, expiresAt }),
      unauthenticate: async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/tokens/revoke`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: get().refreshToken,
          }),
        });

        set({
          token: undefined,
          refreshToken: undefined,
          expiresAt: undefined,
        });
      },
      refresh: async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/tokens/refresh`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refreshToken: get().refreshToken,
              }),
            },
          );

          if (!response.ok) {
            throw new Error(`${response.statusText}`);
          }

          const data: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
          } = await response.json();
          set({
            token: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresIn * 1000 + Date.now(),
          });
        } catch (error) {
          console.log(`Failed to refresh token: ${error}`);
          set({
            token: undefined,
            refreshToken: undefined,
            expiresAt: undefined,
          });
        }
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
