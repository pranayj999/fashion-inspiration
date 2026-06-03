"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";

type ResetFn = () => void;

type LibraryNavContextValue = {
  registerReset: (fn: ResetFn) => void;
  goToLibrary: () => void;
};

const LibraryNavContext = createContext<LibraryNavContextValue | null>(null);

export function LibraryNavProvider({ children }: { children: ReactNode }) {
  const resetRef = useRef<ResetFn | null>(null);

  const registerReset = useCallback((fn: ResetFn) => {
    resetRef.current = fn;
  }, []);

  const goToLibrary = useCallback(() => {
    resetRef.current?.();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <LibraryNavContext.Provider value={{ registerReset, goToLibrary }}>
      {children}
    </LibraryNavContext.Provider>
  );
}

export function useLibraryNav() {
  const ctx = useContext(LibraryNavContext);
  if (!ctx) {
    throw new Error("useLibraryNav must be used within LibraryNavProvider");
  }
  return ctx;
}
