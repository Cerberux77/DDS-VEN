"use client";
import { useEffect } from "react";

/** Deterrence only; authorization remains server-side. */
export function PreviewGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const blockContext = (e: MouseEvent) => e.preventDefault();
    const blockCopy = (e: ClipboardEvent) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["p", "s", "u", "c"].includes(key)) e.preventDefault();
      if (e.key === "PrintScreen") e.preventDefault();
    };
    document.addEventListener("contextmenu", blockContext);
    document.addEventListener("copy", blockCopy);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);
  return <>{children}</>;
}
