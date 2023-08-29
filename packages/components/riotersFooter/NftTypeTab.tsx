import React, { memo } from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { BrandText } from "../../components/BrandText";
import { neutral33, primaryColor } from "../../utils/style/colors";

const NftTypeTab: React.FC<{
  tabName: string;
  setTabName: (text: string) => void;
}> = memo(({ tabName, setTabName }) => {
  return (
    <View style={containerStyle}>
      <View style={{ flexDirection: "row", height: "100%" }}>
        <TouchableOpacity style={tabStyle} onPress={() => setTabName("New")}>
          <View
            style={[
              tabButtonStyle,
              tabName === "New" && {
                backgroundColor: primaryColor,
                borderRadius: 7,
              },
            ]}
          >
            <BrandText
              style={[tabTextStyle, tabName === "New" && { color: "black" }]}
            >
              New
            </BrandText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={tabStyle}
          onPress={() => setTabName("Existing")}
        >
          <View
            style={[
              tabButtonStyle,
              tabName === "Existing" && {
                backgroundColor: primaryColor,
                borderRadius: 7,
              },
            ]}
          >
            <BrandText
              style={[
                tabTextStyle,
                tabName === "Existing" && { color: "black" },
              ]}
            >
              Existing
            </BrandText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default NftTypeTab;

const containerStyle: ViewStyle = {
  marginTop: 12,
  height: 40,
  borderRadius: 10,
  borderColor: neutral33,
  borderWidth: 1,
};
const tabStyle: ViewStyle = {
  width: "50%",
  justifyContent: "center",
  alignItems: "center",
};
const tabTextStyle: TextStyle = {
  textAlign: "center",
  fontSize: 14,
};
const tabButtonStyle: ViewStyle = {
  width: "96%",
  height: "90%",
  justifyContent: "center",
};
