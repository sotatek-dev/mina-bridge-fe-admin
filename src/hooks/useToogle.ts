"use client";
import { useCallback, useState } from "react";

export type ToggleAction = (newState?: boolean) => void;

export default function useToggle(
  initialState = false
): [boolean, ToggleAction] {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const toggle = useCallback(
    (newState?: boolean) => {
      setIsOpen((prev) => {
        if (newState !== undefined) return newState;
        return !prev;
      });
    },
    [setIsOpen]
  );
  return [isOpen, toggle];
}
