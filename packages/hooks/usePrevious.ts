import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T | null {
  // variables
  const ref = useRef<T | null>(null);

  // hooks
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // returns
  return ref.current;
}
