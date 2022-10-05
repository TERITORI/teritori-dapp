import React from "react";
import { View, TouchableOpacity, Image, FlatList } from "react-native";

import guardianPNG from "../../../assets/default-images/guardian_1.png";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import dotsCircleSVG from "../../../assets/icons/dots-circle.svg";
import starSVG from "../../../assets/icons/star.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { MY_NFT } from "../../utils/fakeData/walletManager";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { getWalletIconFromTitle } from "../../utils/walletManagerHelpers";

export const MyNFTs: React.FC = () => {
  return (
    <View
      style={{
        paddingTop: 32,
        borderTopWidth: 1,
        borderColor: neutral33,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <BrandText style={{ marginRight: 20, fontSize: 20 }}>My NFTs</BrandText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {}}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BrandText
            style={{
              fontSize: 14,
              marginRight: 16,
            }}
          >
            See All
          </BrandText>
          <SVG source={chevronRightSVG} height={16} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <FlatList
          data={MY_NFT}
          horizontal
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <TertiaryBox
              key={item.title}
              height={438}
              width={255}
              style={{
                marginRight: 34,
              }}
            >
              <View>
                <View
                  style={{
                    paddingTop: 16,
                    paddingBottom: 12,
                    paddingHorizontal: 16,
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
                      <Image
                        source={{ uri: item.owner.avatar }}
                        style={{
                          height: 32,
                          width: 32,
                          borderRadius: 18,
                          marginRight: 6,
                        }}
                      />
                      <View>
                        <BrandText
                          style={{
                            fontSize: 10,
                            color: neutral77,
                          }}
                        >
                          Owned by
                        </BrandText>
                        <BrandText
                          style={{
                            fontSize: 12,
                            lineHeight: 16,
                          }}
                        >
                          {item.owner.name}
                        </BrandText>
                      </View>
                    </View>
                    <TouchableOpacity>
                      <SVG source={dotsCircleSVG} height={32} width={32} />
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={{ uri: guardianPNG }}
                    style={{
                      height: 223,
                      width: 223,
                      marginTop: 15,
                      marginBottom: 20,
                      borderRadius: 12,
                    }}
                  />
                  <BrandText
                    style={{
                      fontSize: 14,
                      marginBottom: 12,
                    }}
                  >
                    {item.title}
                  </BrandText>

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
                      <SVG
                        height={24}
                        width={24}
                        source={getWalletIconFromTitle(item.token)}
                      />
                      <BrandText
                        style={{
                          fontSize: 12,
                          marginLeft: 4,
                        }}
                      >
                        {item.subTitle}
                      </BrandText>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <BrandText
                        style={{
                          color: neutral77,
                          fontSize: 12,
                          marginRight: 4,
                        }}
                      >
                        {item.stars}
                      </BrandText>
                      <SVG height={16} width={16} source={starSVG} />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: neutral33,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <SVG
                      height={24}
                      width={24}
                      source={getWalletIconFromTitle(item.token)}
                    />
                    <BrandText
                      style={{ fontSize: 12, color: neutral77, marginLeft: 6 }}
                    >
                      Highest bid {item.bids.highest}/{item.bids.total}
                    </BrandText>
                  </View>
                  <SecondaryButton
                    size="XS"
                    text={`${item.points} ${item.pointsKey}`}
                    onPress={() => {}}
                  />
                </View>
              </View>
            </TertiaryBox>
          )}
        />
      </View>
    </View>
  );
};
