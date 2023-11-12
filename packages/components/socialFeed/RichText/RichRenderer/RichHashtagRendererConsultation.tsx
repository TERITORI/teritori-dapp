import React, { ReactNode } from "react";

import { useAppNavigation } from "../../../../utils/navigation";
import { getReactNodeStringProp } from "../../../../utils/react";
import { primaryColor } from "../../../../utils/style/colors";

export const RichHashtagRendererConsultation = (props: {
  children: ReactNode;
}) => {
  const navigation = useAppNavigation();

  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() =>
        navigation.navigate("HashtagFeed", {
          hashtag: getReactNodeStringProp(props.children, "text").replace(
            "#",
            "",
          ),
        })
      }
    >
      {props.children}
    </span>
  );
};
