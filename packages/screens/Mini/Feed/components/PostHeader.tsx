import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { DotSeparator } from "../../../../components/separators/DotSeparator";
import { DateTime } from "../../../../components/socialFeed/SocialCard/DateTime";
import { SpacerRow } from "../../../../components/spacer";
import { neutralA3 } from "../../../../utils/style/colors";
import { fontMedium14, fontSemibold16 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import CircularImgOrIcon from "../../AddressBook/components/CircularImgOrIcon";

type UserHeaderType = {
  img: string | null | undefined;
  name: string;
  username: string;
  postedAt: number;
};

type CardHeaderProps = {
  user: UserHeaderType;
};

export function PostHeader({ user }: CardHeaderProps) {
  const { img, name, username, postedAt } = user;

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 36,
        }}
      >
        <CircularImgOrIcon
          enableFullIcon
          style={{ alignItems: "center", justifyContent: "center" }}
          size={38}
          icon={
            img
              ? img
              : require("../../../../../assets/default-images/profile.png")
          }
        />
        <SpacerRow size={1.5} />
        <BrandText style={fontSemibold16}>{name}</BrandText>
        <SpacerRow size={1} />
        <BrandText style={[fontMedium14, { color: neutralA3 }]}>
          @ {username}
        </BrandText>
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
