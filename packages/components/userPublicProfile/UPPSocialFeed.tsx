import React from "react";
import { View } from "react-native";

import { layout } from "../../utils/style/layout";
import { SocialThreadCard } from "../cards/SocialThreadCard";

export const UPPSocialFeed: React.FC = () => {
  return (
    <View style={{ marginTop: layout.padding_x2_5 / 2 }}>
      <SocialThreadCard thread={{}} style={{ marginBottom: 56 }} />
      <SocialThreadCard thread={{}} style={{ marginBottom: 56 }} />
      <SocialThreadCard thread={{}} style={{ marginBottom: 56 }} />
    </View>
  );
};
