import { PropsWithChildren, createContext, useContext, useState } from "react";

const initialData = {
  expanded: false,
  toggle: () => {},
};

const AccordionContext = createContext(initialData);

export default function AccordionProvider({
  children,
  initialValue,
}: PropsWithChildren<{ initialValue: boolean }>) {
  const [expanded, setExpanded] = useState(initialValue);

  function toggle() {
    setExpanded(!expanded);
  }

  return (
    <AccordionContext.Provider value={{ expanded, toggle }}>
      {children}
    </AccordionContext.Provider>
  );
}

export const useAccordion = () => {
  const { expanded, toggle } = useContext(AccordionContext);

  return { expanded, toggle };
};
