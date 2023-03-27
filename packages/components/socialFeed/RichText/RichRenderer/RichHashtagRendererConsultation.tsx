import React from "react";

import { useAppNavigation } from "../../../../utils/navigation";
import { primaryColor } from "../../../../utils/style/colors";
export const RichHashtagRendererConsultation = (props: {
  children: { props: { text: string } }[];
}) => {
  const navigation = useAppNavigation();

  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() =>
        navigation.navigate("HashtagFeed", {
          hashtag: props.children[0].props.text.replace("#", ""),
        })
      }
    >
      {props.children}
    </span>
  );
};
