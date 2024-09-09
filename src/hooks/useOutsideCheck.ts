"use client";
import { useEffect } from "react";

export function useOutsideCheck(ref: any, callback: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (!ref?.current || ref.current.contains(event.target)) {
        return;
      }
      callback?.();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback]);
}
