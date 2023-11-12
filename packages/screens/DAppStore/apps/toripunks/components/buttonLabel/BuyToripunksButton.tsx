import { Linking } from "react-native";

import { ButtonLabel } from "./ButtonLabel";

export const BuyToripunksButton: React.FC<{ size: "S" | "Mobile" }> = ({
  size,
}) => (
  <ButtonLabel
    text="BUY TORIPUNKS"
    size={size}
    actionable
    onPress={() => {
      Linking.openURL(
        "/collection/tori-tori1plr28ztj64a47a32lw7tdae8vluzm2lm7nqk364r4ws50rgwyzgsapzezt",
      );
    }}
  />
);
