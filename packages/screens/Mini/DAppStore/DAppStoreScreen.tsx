import React, { useState } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";

import { DAppStoreMenuItem } from "./component/DAppStoreMenuItems";
import { DAppsList } from "./component/DAppsList";
import penSVG from "../../../../assets/icons/pen-solid.svg";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Separator } from "@/components/separators/Separator";
import { ScreenFC } from "@/utils/navigation";
import { blueDefault } from "@/utils/style/colors";
import { fontSemibold15 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const DAppStoreScreen: ScreenFC<"MiniDAppStore"> = ({ navigation }) => {
  const [enableEditingDApps, setEnableEditingDApps] = useState(false);
  const { height: windowHeight } = useWindowDimensions();
  const toggleEnableEditingDApps = () => setEnableEditingDApps((prev) => !prev);

  return (
    <BlurScreenContainer title="dApp Store">
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <View
            style={{
              paddingHorizontal: layout.spacing_x2,
              minHeight: windowHeight - 170,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <DAppsList isEditing={enableEditingDApps} />
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
        }
      />

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
