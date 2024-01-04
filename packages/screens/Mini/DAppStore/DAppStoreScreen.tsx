import React, { useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, View } from "react-native";

import { DAppStoreMenuItem } from "./component/DAppStoreMenuItems";
import { DAppsList } from "./component/DAppsList";
import closeSVG from "../../../../assets/icons/close.svg";
import governanceSVG from "../../../../assets/icons/governance-gray.svg";
import launchpadSVG from "../../../../assets/icons/launchpad-gray.svg";
import marketplaceSVG from "../../../../assets/icons/marketplace-gray.svg";
import penSVG from "../../../../assets/icons/pen-solid.svg";
import stakingSVG from "../../../../assets/icons/staking-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { ScreenFC } from "../../../utils/navigation";
import { blueDefault } from "../../../utils/style/colors";
import { fontSemibold15, fontSemibold18 } from "../../../utils/style/fonts";
import { MOBILE_HEADER_HEIGHT, layout } from "../../../utils/style/layout";

export const DAppStoreScreen: ScreenFC<"MiniDAppStore"> = ({ navigation }) => {
  const onClose = () => navigation.goBack();
  const [enableEditingDApps, setEnableEditingDApps] = useState(false);

  const toggleEnableEditingDApps = () => setEnableEditingDApps((prev) => !prev);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0,0.9)",
        position: "relative",
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandText style={[fontSemibold18]}>dApp Store</BrandText>

          <CustomPressable onPress={onClose} style={{}}>
            <SVG source={closeSVG} height={28} width={28} />
          </CustomPressable>
        </View>

        <ScrollView style={{}}>
          <View
            style={{
              flex: 1,
              minHeight:
                Dimensions.get("window").height - MOBILE_HEADER_HEIGHT - 70,
              justifyContent: "flex-end",
            }}
          >
            <View style={{ backgroundColor: "#000" }}>
              <DAppStoreMenuItem
                icon={marketplaceSVG}
                title="Marketplace"
                subTitle="NFT Marketplace"
              />
              <DAppStoreMenuItem
                icon={launchpadSVG}
                title="Launchpad"
                subTitle="Multi Network NFT Launchpad"
              />
              <DAppStoreMenuItem
                icon={stakingSVG}
                title="Staking"
                subTitle="Staking"
              />
              <DAppStoreMenuItem
                icon={governanceSVG}
                title="Governance"
                subTitle="Governance"
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
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      {enableEditingDApps && (
        <CustomPressable
          onPress={toggleEnableEditingDApps}
          style={{
            width: "100%",
            backgroundColor: blueDefault,
            paddingVertical: layout.spacing_x1_5,
            borderRadius: 100,
            position: "absolute",
            bottom: 80,
          }}
        >
          <BrandText style={[fontSemibold15, { textAlign: "center" }]}>
            Save
          </BrandText>
        </CustomPressable>
      )}
    </SafeAreaView>
  );
};
