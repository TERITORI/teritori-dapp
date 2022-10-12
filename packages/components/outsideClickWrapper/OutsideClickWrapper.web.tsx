import React, { useRef, useEffect } from "react";

interface OutsideClickWrapperProps {
  children: React.ReactNode;
  onOutsideClick: () => void;
  style: any;
}

export const OutsideClickWrapper: React.FC<OutsideClickWrapperProps> = ({
  children,
  onOutsideClick,
  style,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e: any) {
      if (menuRef && menuRef.current) {
        const ref: any = menuRef.current;
        if (!ref.contains(e.target)) {
          onOutsideClick();
        }
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div style={style} ref={menuRef}>
      {children}
    </div>
  );
};
