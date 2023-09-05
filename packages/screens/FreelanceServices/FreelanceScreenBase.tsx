import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";

export const FreelanceScreenBase: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ScreenContainer fullWidth noMargin footerChildren={<></>}>
      {children}
    </ScreenContainer>
  );
};
