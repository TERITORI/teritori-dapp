import React from "react";

import { BrandText } from "../../../components/BrandText";
import { secondaryColor } from "../../../utils/style/colors";
import { fontSemibold20 } from "../../../utils/style/fonts";

interface MessageHeaderProps {}

export const MessageHeader: React.FC<MessageHeaderProps> = () => {
  return (
    <BrandText style={[fontSemibold20, { color: secondaryColor }]}>
      Messenger home
    </BrandText>
  );
};
