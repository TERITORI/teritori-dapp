import React from "react";

import { useMention } from "../../../../hooks/feed/useMention";
import { useAppNavigation } from "../../../../utils/navigation";
import { neutralA3, primaryColor } from "../../../../utils/style/colors";

export const RichMentionRendererConsultation = (props: {
  children: { props: { text: string } }[];
}) => {
  const navigation = useAppNavigation();
  const { userId } = useMention(props.children[0].props.text);
  // Every text with a "@" is a mention. But we consider valid mentions as a valid wallet address or a valid NS token id.
  if (!userId) {
    return <span style={{ color: neutralA3 }}>{props.children}</span>;
  }
  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() =>
        navigation.navigate("UserPublicProfile", {
          id: userId,
        })
      }
    >
      {props.children}
    </span>
  );
};
