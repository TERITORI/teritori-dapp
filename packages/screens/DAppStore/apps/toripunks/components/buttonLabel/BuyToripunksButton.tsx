import { Linking } from "react-native";

import { ButtonLabel } from "./ButtonLabel";

export const BuyToripunksButton: React.FC = () => (
  <ButtonLabel
    text="BUY TORIPUNKS"
    size="S"
    actionable
    onPress={() => {
      Linking.openURL(
        "https://app.teritori.com/collection/tori-tori1plr28ztj64a47a32lw7tdae8vluzm2lm7nqk364r4ws50rgwyzgsapzezt"
      );
    }}
  />
);
