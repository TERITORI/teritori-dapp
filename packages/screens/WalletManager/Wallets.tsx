import React from "react";
import { View, TouchableOpacity } from "react-native";

import copySVG from "../../../assets/icons/copy.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { neutral33 } from "../../utils/style/colors";
import { getIconFromTitle } from "./Overview/TokenAllocation";

const WALLETS = [
  {
    title: "Teritori",
    apr: 84.36,
    address: "GxF3432432904320430SDSDSFDS@S>!3A31",
    amount: 400,
    isFavorite: false,
  },
  {
    title: "Cosmos Hub",
    apr: 84.36,
    address: "GxF3432432904320430SDSDSFDS@S>!3A31",
    amount: 400,
    isFavorite: false,
  },
  {
    title: "Terra",
    apr: 84.36,
    address: "GxF3432432904320430SDSDSFDS@S>!3A31",
    amount: 400,
    isFavorite: false,
  },
];
export const Wallets: React.FC = () => {
  return (
    <View
      style={{
        paddingTop: 40,
        borderTopWidth: 1,
        borderColor: neutral33,
      }}
    >
      <BrandText style={{ marginRight: 20, fontSize: 20 }}>Wallets</BrandText>

      {WALLETS.map((item, index) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: index !== WALLETS.length - 1 ? 1 : 0,
            borderColor: neutral33,
            paddingVertical: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <SVG
              source={getIconFromTitle(item.title)}
              height={64}
              width={64}
              style={{
                marginRight: 16,
              }}
            />
            <View>
              <View style={{}}>
                <BrandText>{item.title}</BrandText>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <BrandText
                    style={{
                      fontSize: 12,
                    }}
                  >
                    {item.address.substr(0, 5)}...
                    {item.address.substr(-4)}
                  </BrandText>
                  <TouchableOpacity
                    style={{
                      height: 24,
                      width: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 4,
                    }}
                  >
                    <SVG source={copySVG} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
