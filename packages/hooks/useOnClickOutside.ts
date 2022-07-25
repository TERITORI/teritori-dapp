import { Dispatch, RefObject, useEffect } from "react";

// Do an action after a click outside the element (By ref)
const useOnClickOutside = (
  ref: RefObject<HTMLElement>,
  action: Dispatch<any>
): void => {
  useEffect(() => {
    const handler = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      action(event);
    };
    // Handling an eventListener
    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [ref, action]);
};

export default useOnClickOutside;
