import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import copySVG from "../../../assets/icons/copy.svg";
import starSVG from "../../../assets/icons/star.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ButtonGroup } from "../../components/buttons/ButtonGroup";
import { WALLET_CHAIN_ASSETS } from "../../utils/fakeData/walletManager";
import {
  neutral17,
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
} from "../../utils/style/colors";
import { getWalletIconFromTitle } from "../../utils/walletManagerHelpers";

export const TotalAssets: React.FC = () => {
  const [activeView, setActiveView] = useState<"Chain" | "Token">("Chain");
  const [isExpandAll, setIsExpandAll] = useState(false);
  return (
    <View
      style={{
        paddingTop: 40,
        borderTopWidth: 1,
        borderColor: neutral33,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BrandText style={{ marginRight: 20, fontSize: 20 }}>
            Total Assets By
          </BrandText>
          <ButtonGroup
            buttons={[
              {
                label: "Chain",
                onPress: () => setActiveView("Chain"),
                isActive: activeView === "Chain",
              },
              {
                label: "Token",
                onPress: () => setActiveView("Token"),
                isActive: activeView === "Token",
              },
            ]}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BrandText
            style={{
              fontSize: 14,
              lineHeight: 16,
              marginRight: 16,
            }}
          >
            {isExpandAll ? "Collapse" : "Expand"} All Items
          </BrandText>
          <TouchableOpacity
            onPress={() => setIsExpandAll((prev) => !prev)}
            style={{
              backgroundColor: neutral22,
              borderWidth: 1,
              borderColor: neutral33,
              height: 32,
              width: 32,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SVG source={isExpandAll ? chevronUpSVG : chevronDownSVG} />
          </TouchableOpacity>
        </View>
      </View>

      {WALLET_CHAIN_ASSETS.map((item, index) => (
        <View
          key={item.title}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: index !== WALLET_CHAIN_ASSETS.length - 1 ? 1 : 0,
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
            <SVG source={starSVG} height={16} width={16} />
            <SVG
              source={getWalletIconFromTitle(item.title)}
              height={64}
              width={64}
              style={{
                marginLeft: 20,
                marginRight: 16,
              }}
            />
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <BrandText>{item.title}</BrandText>
                {activeView === "Chain" && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 6,
                      paddingVertical: 2,
                      paddingHorizontal: 10,
                      backgroundColor: neutral22,
                      marginLeft: 12,
                    }}
                  >
                    <BrandText
                      style={{
                        marginRight: 4,
                        fontSize: 13,
                      }}
                    >
                      Chain info
                    </BrandText>
                    <SVG source={chevronRightSVG} />
                  </View>
                )}
              </View>
              {activeView === "Chain" && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      marginRight: 12,
                    }}
                  >
                    <BrandText
                      style={{
                        fontSize: 16,
                        color: neutralA3,
                        marginRight: 4,
                      }}
                    >
                      Staking APR:
                    </BrandText>
                    <BrandText
                      style={{
                        fontSize: 14,
                      }}
                    >
                      {item.apr}%
                    </BrandText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: neutral17,
                      paddingVertical: 2,
                      paddingHorizontal: 10,
                      borderRadius: 6,
                    }}
                  >
                    <BrandText
                      style={{
                        color: neutral77,
                        fontSize: 13,
                      }}
                    >
                      {item.address}
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
              )}
              {activeView === "Token" && (
                <BrandText
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                  }}
                >
                  ≈ ${item.exactAmount}
                </BrandText>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <BrandText
              style={{
                marginRight: 16,
                fontSize: 20,
              }}
            >
              ${item.amount}
            </BrandText>
            <TouchableOpacity>
              <SVG source={chevronDownSVG} height={16} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};
