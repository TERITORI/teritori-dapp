import React, { FC } from "react";
import { useWindowDimensions, View } from "react-native";

import { DateTime } from "./DateTime";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout, RESPONSIVE_BREAKPOINT_S } from "../../../utils/style/layout";
import { OmniLink } from "../../OmniLink";
import { AnimationFadeIn } from "../../animations/AnimationFadeIn";
import { UserAvatarWithFrame } from "../../images/AvatarWithFrame";
import { DotSeparator } from "../../separators/DotSeparator";
import { SpacerRow } from "../../spacer";

import { UserDisplayName } from "@/components/user/UserDisplayName";
import { Username } from "@/components/user/Username";

// ====== Handle author image and username, date
export const SocialCardHeader: FC<{
  authorId: string;
  createdAt?: number;
  isWrapped?: boolean;
}> = ({ authorId, createdAt, isWrapped }) => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <OmniLink
          to={{ screen: "UserPublicProfile", params: { id: authorId } }}
        >
          <UserAvatarWithFrame
            style={{
              marginRight:
                width < RESPONSIVE_BREAKPOINT_S
                  ? layout.spacing_x1
                  : layout.spacing_x1_5,
            }}
            userId={authorId}
            size={width < RESPONSIVE_BREAKPOINT_S ? "XS" : "S"}
          />
        </OmniLink>
        <View
          style={{
            flexDirection:
              width < RESPONSIVE_BREAKPOINT_S && isWrapped ? "column" : "row",
            flex: 1,
          }}
        >
          <OmniLink
            to={{ screen: "UserPublicProfile", params: { id: authorId } }}
          >
            <AnimationFadeIn>
              <UserDisplayName userId={authorId} />
            </AnimationFadeIn>
          </OmniLink>

          {(width >= RESPONSIVE_BREAKPOINT_S || !isWrapped) && (
            <SpacerRow size={1.5} />
          )}

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {width >= RESPONSIVE_BREAKPOINT_S && (
              <>
                <Username
                  userId={authorId}
                  namedColor={neutral77}
                  anonColor={neutral77}
                  textStyle={[
                    fontSemibold14,
                    {
                      color: neutral77,
                    },
                  ]}
                />
                <DotSeparator
                  style={{ marginHorizontal: layout.spacing_x0_75 }}
                />
              </>
            )}
            {/*---- Date */}
            {!!createdAt && (
              <DateTime
                date={createdAt * 1000}
                textStyle={{ color: neutral77 }}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
