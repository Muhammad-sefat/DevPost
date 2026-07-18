"use client";

import { useState, useCallback } from "react";

// Common toggle hook — used by sidebar, dropdowns, modals, etc.
export function useToggle(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return { isOpen, toggle, open, close, setIsOpen };
}
