import React from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import { getUserId } from "@/networks";
import { Project } from "@/screens/Projects/types";
import { neutral22, neutralA3 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type RelatedUsersProps = {
  networkId: string;
  project: Project;
};

type RelatedUserProps = {
  networkId: string;
  label: string;
  address?: string;
};

const RelatedUser: React.FC<RelatedUserProps> = ({
  networkId,
  label,
  address = "",
}) => {
  return (
    <View style={{ alignItems: "center" }}>
      <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
        {label}
      </BrandText>

      <UsernameWithAvatar userId={getUserId(networkId, address)} />
    </View>
  );
};

export const RelatedUsers: React.FC<RelatedUsersProps> = ({
  networkId,
  project,
}) => {
  return (
    <TertiaryBox
      style={{
        backgroundColor: neutral22,
        borderWidth: 0,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: layout.spacing_x2,
      }}
    >
      <FlexRow style={{ flexWrap: "wrap", justifyContent: "space-between" }}>
        <RelatedUser
          networkId={networkId}
          label="Funder"
          address={project?.funder}
        />
        <RelatedUser
          networkId={networkId}
          label="Contractor"
          address={project?.contractor}
        />
        <RelatedUser
          networkId={networkId}
          label="Conflict resolver"
          address={project?.conflictHandler}
        />
      </FlexRow>
    </TertiaryBox>
  );
};
