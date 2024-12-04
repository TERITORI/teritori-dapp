import React from "react";

// this can't be a FC because using an intermediary component makes the Navigator crash
export const getPlatformScreens: (
  screenTitle: (title: string) => string,
) => JSX.Element = () => <></>;
