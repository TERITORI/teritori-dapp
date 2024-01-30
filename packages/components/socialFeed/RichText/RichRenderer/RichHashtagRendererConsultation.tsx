import React, { ReactNode } from "react";

import { getReactNodeStringProp } from "../../../../utils/react";
import { primaryColor } from "../../../../utils/style/colors";

import { router } from "@/utils/router";

export const RichHashtagRendererConsultation = (props: {
  children: ReactNode;
}) => {
  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() =>
        router.navigate({
          pathname: "/feed/tag/[hashtag]",
          params: {
            hashtag: getReactNodeStringProp(props.children, "text").replace(
              "#",
              "",
            ),
          },
        })
      }
    >
      {props.children}
    </span>
  );
};
