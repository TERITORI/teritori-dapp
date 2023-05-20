import React from "react";

import { useMention } from "../../../../hooks/feed/useMention";
import { useAppNavigation } from "../../../../utils/navigation";
import { neutralA3, primaryColor } from "../../../../utils/style/colors";

export const RichMentionRendererConsultation = (props: {
  children: React.ReactNode;
}) => {
  const navigation = useAppNavigation();
  // @ts-expect-error
  const text = props.children[0].props.text as string;
  const { userId } = useMention(text);
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
