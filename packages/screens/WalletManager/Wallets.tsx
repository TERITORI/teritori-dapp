import React from "react";
import { View, TouchableOpacity } from "react-native";

import copySVG from "../../../assets/icons/copy.svg";
import dotsCircleSVG from "../../../assets/icons/dots-circle.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { neutral33, neutral77, neutralA3 } from "../../utils/style/colors";
import { getIconFromTitle } from "./Overview/TokenAllocation";
const WALLETS = [
  {
    title: "Teritori",
    staked: 535053.812943,
    pendingReward: 56469.54635563,
    address: "GxF3432432904320430SDSDSFDS@S>!3A31",
  },
  {
    title: "Cosmos Hub",
    staked: 535053.812943,
    pendingReward: 56469.54635563,
    address: "GxF3432432904320430SDSDSFDS@S>!3A31",
  },
  {
    title: "Terra",
    staked: 535053.812943,
    pendingReward: 56469.54635563,
    address: "GxF3432432904320430SDSDSFDS@S>!3A31",
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
              <View>
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                paddingRight: 32,
                borderRightWidth: 1,
                borderColor: neutral33,
              }}
            >
              <BrandText
                style={{
                  fontSize: 12,
                  color: neutral77,
                  marginBottom: 2,
                }}
              >
                Staked
              </BrandText>
              <BrandText
                style={{
                  fontSize: 14,
                }}
              >
                {String(item.staked).split(".")[0]}
                <BrandText
                  style={{
                    color: neutralA3,
                    fontSize: 14,
                  }}
                >
                  .{String(item.staked).split(".")[1]}
                </BrandText>
              </BrandText>
            </View>
            <View
              style={{
                paddingHorizontal: 32,
              }}
            >
              <BrandText
                style={{
                  fontSize: 12,
                  color: neutral77,
                  marginBottom: 2,
                }}
              >
                Pending rewards
              </BrandText>
              <BrandText
                style={{
                  fontSize: 14,
                }}
              >
                {String(item.pendingReward).split(".")[0]}
                <BrandText
                  style={{
                    color: neutralA3,
                    fontSize: 14,
                  }}
                >
                  .{String(item.pendingReward).split(".")[1]}
                </BrandText>
              </BrandText>
            </View>

            <SecondaryButton
              size="XS"
              text="Claim reward"
              onPress={() => {}}
              style={{
                backgroundColor: neutral33,
                marginRight: 16,
              }}
            />
            <SecondaryButton
              size="XS"
              text="Stake"
              onPress={() => {}}
              style={{
                marginRight: 16,
              }}
            />
            <TouchableOpacity onPress={() => {}}>
              <SVG height={32} width={32} source={dotsCircleSVG} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};
