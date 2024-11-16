import { create } from "zustand";

type ContextState = {
  user: {
    name: string;
  };
};

type ContextActions = {
  setUser: (user: ContextState["user"]) => void;
};

export const useContext = create<ContextState & ContextActions>((set) => ({
  user: undefined!,
  setUser: (user) => set({ user }),
}));
