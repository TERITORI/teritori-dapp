import { Linking } from "react-native";

import { primaryColor } from "../../../../utils/style/colors";

export const RichURLRendererConsultation = (props: {
  children: { props: { text: string } }[];
}) => {
  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() => {
        let linkText = props.children[0].props.text;
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
