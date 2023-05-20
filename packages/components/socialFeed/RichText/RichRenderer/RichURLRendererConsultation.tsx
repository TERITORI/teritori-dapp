import { Linking } from "react-native";

import { primaryColor } from "../../../../utils/style/colors";

export const RichURLRendererConsultation = (props: {
  children: React.ReactNode;
}) => {
  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() => {
        // @ts-expect-error
        let linkText = props.children[0].props.text as string;
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
