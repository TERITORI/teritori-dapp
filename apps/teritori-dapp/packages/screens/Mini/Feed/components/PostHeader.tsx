import { View } from "react-native";

import { UserAvatarWithFrame } from "@/components/images/AvatarWithFrame";
import { DotSeparator } from "@/components/separators/DotSeparator";
import { DateTime } from "@/components/socialFeed/SocialCard/DateTime";
import { SpacerRow } from "@/components/spacer";
import { UserDisplayName } from "@/components/user/UserDisplayName";
import { Username } from "@/components/user/Username";
import { neutralA3 } from "@/utils/style/colors";
import { fontMedium14, fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type CardHeaderProps = {
  authorId: string;
  postedAt: number;
};

export function PostHeader({ authorId, postedAt }: CardHeaderProps) {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 36,
        }}
      >
        <UserAvatarWithFrame userId={authorId} size="S" />
        <SpacerRow size={1.5} />
        <UserDisplayName userId={authorId} style={fontSemibold16} />
        <SpacerRow size={1} />
        <Username
          userId={authorId}
          textStyle={fontMedium14}
          namedColor={neutralA3}
          anonColor={neutralA3}
        />
        <SpacerRow size={1} />
        <DotSeparator style={{ marginHorizontal: layout.spacing_x0_75 }} />
        <SpacerRow size={1} />
        <DateTime
          date={postedAt * 1000}
          textStyle={{ color: neutralA3, ...fontMedium14 }}
        />
      </View>
    </>
  );
}
