import { useRef, useCallback, RefObject } from "react";

export const useScrollToBottom = <T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T | null>,
  () => void
] => {
  const containerRef = useRef<T>(null);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  return [containerRef, scrollToBottom];
};
