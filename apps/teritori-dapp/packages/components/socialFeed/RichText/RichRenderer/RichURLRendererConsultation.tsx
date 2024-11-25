import { ReactNode } from "react";
import { Linking } from "react-native";

import { getReactNodeStringProp } from "../../../../utils/react";
import { primaryColor } from "../../../../utils/style/colors";

export const RichURLRendererConsultation = (props: { children: ReactNode }) => {
  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() => {
        let linkText = getReactNodeStringProp(props.children, "text");
        if (linkText[0] === "@") {
          linkText = linkText.substring(1);
        }
        if (linkText.startsWith("www")) {
          linkText = `https://${linkText}`;
        }

        Linking.openURL(linkText);
      }}
    >
      {props.children}
    </span>
  );
};
