import React from "react";
import { TouchableOpacity, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { neutral33, primaryColor } from "../../utils/style/colors";

const NftTypeTab: React.FC<{
  nftType: string;
  setNftType: (text: string) => void;
}> = ({ nftType, setNftType }) => {
  return (
    <View
      style={{
        marginTop: 12,
        height: 40,
        borderRadius: 10,
        borderColor: neutral33,
        borderWidth: 1,
      }}
    >
      <View style={{ flexDirection: "row", height: "100%" }}>
        <TouchableOpacity
          style={[
            {
              width: "50%",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          onPress={() => setNftType("New")}
        >
          <View
            style={[
              { width: "96%", height: "90%", justifyContent: "center" },
              nftType === "New" && {
                backgroundColor: primaryColor,
                borderRadius: 7,
              },
            ]}
          >
            <BrandText
              style={[
                {
                  textAlign: "center",
                  fontSize: 14,
                },
                nftType === "New" && { color: "black" },
              ]}
            >
              New
            </BrandText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setNftType("Existing")}
        >
          <View
            style={[
              { width: "96%", height: "90%", justifyContent: "center" },
              nftType === "Existing" && {
                backgroundColor: primaryColor,
                borderRadius: 7,
              },
            ]}
          >
            <BrandText
              style={[
                {
                  textAlign: "center",
                  fontSize: 14,
                },
                nftType === "Existing" && { color: "black" },
              ]}
            >
              Existing
            </BrandText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NftTypeTab;
