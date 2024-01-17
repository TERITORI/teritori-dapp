import React, { useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";

import { DAppStoreMenuItem } from "./component/DAppStoreMenuItems";
import { DAppsList } from "./component/DAppsList";
import governanceSVG from "../../../../assets/icons/governance-gray.svg";
import launchpadSVG from "../../../../assets/icons/launchpad-gray.svg";
import marketplaceSVG from "../../../../assets/icons/marketplace-gray.svg";
import penSVG from "../../../../assets/icons/pen-solid.svg";
import stakingSVG from "../../../../assets/icons/staking-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { ScreenFC } from "../../../utils/navigation";
import { blueDefault } from "../../../utils/style/colors";
import { fontSemibold15 } from "../../../utils/style/fonts";
import { layout, MOBILE_HEADER_HEIGHT } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";

export const DAppStoreScreen: ScreenFC<"MiniDAppStore"> = ({ navigation }) => {
  const [enableEditingDApps, setEnableEditingDApps] = useState(false);
  const { height: windowHeight } = useWindowDimensions();

  const toggleEnableEditingDApps = () => setEnableEditingDApps((prev) => !prev);

  return (
    <BlurScreenContainer title="dApp Store">
      <ScrollView>
        <View
          style={{
            flex: 1,
            minHeight: windowHeight - MOBILE_HEADER_HEIGHT - 70,
            justifyContent: "flex-end",
            paddingHorizontal: layout.spacing_x2,
          }}
        >
          <View style={{}}>
            <DAppStoreMenuItem
              icon={marketplaceSVG}
              title="Marketplace"
              subTitle="NFT Marketplace"
              isAdded
            />
            <DAppStoreMenuItem
              icon={launchpadSVG}
              title="Launchpad"
              subTitle="Multi Network NFT Launchpad"
              isAdded
            />
            <DAppStoreMenuItem
              icon={stakingSVG}
              title="Staking"
              subTitle="Staking"
              isAdded
            />
            <DAppStoreMenuItem
              icon={governanceSVG}
              title="Governance"
              subTitle="Governance"
              isAdded
            />

            <DAppsList
              isEditing={enableEditingDApps}
              togggleEdting={toggleEnableEditingDApps}
            />
            <Separator />
            {!enableEditingDApps && (
              <DAppStoreMenuItem
                icon={penSVG}
                title="Edit dApps list"
                onPress={() => setEnableEditingDApps(true)}
                isAdded
              />
            )}
          </View>
        </View>
      </ScrollView>
      {enableEditingDApps && (
        <CustomPressable
          onPress={toggleEnableEditingDApps}
          style={{
            width: "100%",
            backgroundColor: blueDefault,
            paddingVertical: layout.spacing_x1_5,
            borderRadius: 100,
            position: "absolute",
            bottom: 50,
          }}
        >
          <BrandText style={[fontSemibold15, { textAlign: "center" }]}>
            Save
          </BrandText>
        </CustomPressable>
      )}
    </BlurScreenContainer>
  );
};
