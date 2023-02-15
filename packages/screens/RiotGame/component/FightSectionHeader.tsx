import React from "react";
import { StyleSheet, View } from "react-native";

import addCircleSVG from "../../../../assets/icons/add-circle.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/containers/FlexRow";
import { useAppNavigation } from "../../../utils/navigation";
import { yellowDefault, neutral17 } from "../../../utils/style/colors";
import { fontMedium48, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { SimpleButton } from "./SimpleButton";

type FightSectionHeaderProps = {
  title: string;
  total: number;
  hasStakeButton?: boolean;
};

export const FightSectionHeader: React.FC<FightSectionHeaderProps> = ({
  title,
  total,
  hasStakeButton,
}) => {
  const navigation = useAppNavigation();

  const gotoEnroll = () => {
    navigation.replace("RiotGameEnroll");
  };

  return (
    <FlexRow style={styles.section} breakpoint={992}>
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: "row" }}>
        <BrandText style={styles.pageTitle}>{title}</BrandText>
        <View style={styles.totalContainer}>
          <BrandText style={[fontSemibold28, { color: yellowDefault }]}>
            {total}
          </BrandText>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {hasStakeButton && (
          <SimpleButton
            containerStyle={styles.btnStake}
            size="XL"
            text="Stake another squad"
            iconSVG={addCircleSVG}
            onPress={gotoEnroll}
          />
        )}
      </View>
    </FlexRow>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
  section: {
    paddingHorizontal: layout.padding_x4 * 2,
  },
  col: {
    marginTop: layout.padding_x4,
  },
  totalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: neutral17,
    width: layout.padding_x4 * 2,
    height: layout.padding_x4 * 2,
    borderRadius: layout.padding_x4,
    marginLeft: layout.padding_x2,
  },
  btnStake: {
    alignSelf: "flex-end",
  },
});
