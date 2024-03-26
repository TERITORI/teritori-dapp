import { useState } from "react";

export const useIsRunningOnWebview = () => {
  const [isRunningOnWebview, setIsRunningOnWebView] = useState(false);

  return {
    isRunningOnWebview,
    setIsRunningOnWebView: (val: boolean) => setIsRunningOnWebView(val),
  };
};
