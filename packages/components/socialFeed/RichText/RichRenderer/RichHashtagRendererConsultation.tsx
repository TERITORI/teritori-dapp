import React from "react";

import { useAppNavigation } from "../../../../utils/navigation";
import { primaryColor } from "../../../../utils/style/colors";
export const RichHashtagRendererConsultation = (props: {
  children: React.ReactNode;
}) => {
  const navigation = useAppNavigation();

  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() => {
        // @ts-expect-error
        const text = props.children[0].props.text as string;
        navigation.navigate("HashtagFeed", {
          hashtag: text.replace("#", ""),
        });
      }}
    >
      {props.children}
    </span>
  );
};
