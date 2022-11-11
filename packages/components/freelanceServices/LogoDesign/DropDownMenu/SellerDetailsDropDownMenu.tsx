import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import {
  primaryColor,
  secondaryColor,
  neutral77,
  neutral00,
} from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText/BrandText";
import { Separator } from "../../../Separator";
import { TertiaryBox } from "../../../boxes/TertiaryBox";
import { SecondaryButton } from "../../../buttons/SecondaryButton";

export const SellerDetailsDropDownMenu: React.FC = () => {
  const [isTopRatedSellerCheckek, setIsTopRatedSellerCheckek] = useState(false);
  const [isLevelTwoChecked, setIsLevelTwoChecked] = useState(false);
  const [isLevelOneChecked, setIsLevelOneChecked] = useState(false);
  const [isNewSellerChecked, setIsNewSellerChecked] = useState(false);
  const [isEnglishChecked, setIsEnglishChecked] = useState(false);
  const [isSpanishChecked, setIsSpanishChecked] = useState(false);
  const [isFrenchChecked, setIsFrenchChecked] = useState(false);
  const [isGermanChecked, setIsGermanChecked] = useState(false);
  const [isUnitedStateChecked, setIsUnitedStateChecked] = useState(false);
  const [isUnitedKingdomChecked, setIsUnitedKingdomChecked] = useState(false);
  const [isCanadaChecked, setIsCanadaChecked] = useState(false);
  const [isGermanyChecked, setIsGermanyChecked] = useState(false);

  return (
    <TertiaryBox
      style={{ position: "absolute", top: 60, left: 0 }}
      mainContainerStyle={{ borderColor: secondaryColor }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          marginLeft: 32,
          marginTop: 20,
        }}
      >
        <BrandText style={[fontSemibold14, { marginBottom: 12 }]}>
          Seller level
        </BrandText>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isTopRatedSellerCheckek ? primaryColor : secondaryColor}
              value={isTopRatedSellerCheckek}
              onValueChange={setIsTopRatedSellerCheckek}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              Top Rated Seller
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (390)
              </BrandText>
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isLevelTwoChecked ? primaryColor : secondaryColor}
              value={isLevelTwoChecked}
              onValueChange={setIsLevelTwoChecked}
            />
            <BrandText
              style={[fontSemibold14, { marginRight: 6, marginLeft: 6 }]}
            >
              Level Two
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isLevelOneChecked ? primaryColor : secondaryColor}
              value={isLevelOneChecked}
              onValueChange={setIsLevelOneChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              Level One
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isNewSellerChecked ? primaryColor : secondaryColor}
              value={isNewSellerChecked}
              onValueChange={setIsNewSellerChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              New Seller
              <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
                (105 000)
              </BrandText>
            </BrandText>
          </View>
        </View>
        <Separator
          style={{
            width: "95%",
            alignSelf: "center",
            marginTop: 20,
            marginRight: 32,
          }}
        />

        <BrandText
          style={[fontSemibold14, { marginBottom: 12, marginTop: 16 }]}
        >
          Seller Speaks
        </BrandText>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isEnglishChecked ? primaryColor : secondaryColor}
              value={isEnglishChecked}
              onValueChange={setIsEnglishChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              English
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isSpanishChecked ? primaryColor : secondaryColor}
              value={isSpanishChecked}
              onValueChange={setIsSpanishChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              Spanish
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isFrenchChecked ? primaryColor : secondaryColor}
              value={isFrenchChecked}
              onValueChange={setIsFrenchChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              French
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isGermanChecked ? primaryColor : secondaryColor}
              value={isGermanChecked}
              onValueChange={setIsGermanChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              German
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
        </View>
        <TouchableOpacity>
          <BrandText style={[fontSemibold14, { color: primaryColor }]}>
            +23 More
          </BrandText>
        </TouchableOpacity>
        <Separator
          style={{
            width: "95%",
            alignSelf: "center",
            marginTop: 20,
            marginRight: 32,
          }}
        />

        <BrandText
          style={[fontSemibold14, { marginBottom: 12, marginTop: 16 }]}
        >
          Seller Lives In
        </BrandText>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isUnitedStateChecked ? primaryColor : secondaryColor}
              value={isUnitedStateChecked}
              onValueChange={setIsUnitedStateChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              United States
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isUnitedKingdomChecked ? primaryColor : secondaryColor}
              value={isUnitedKingdomChecked}
              onValueChange={setIsUnitedKingdomChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              United Kingdom
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isCanadaChecked ? primaryColor : secondaryColor}
              value={isCanadaChecked}
              onValueChange={setIsCanadaChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              Canada
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isGermanyChecked ? primaryColor : secondaryColor}
              value={isGermanyChecked}
              onValueChange={setIsGermanyChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              Germany
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
        </View>
        <TouchableOpacity>
          <BrandText style={[fontSemibold14, { color: primaryColor }]}>
            +114 More
          </BrandText>
        </TouchableOpacity>
        <Separator
          style={{
            width: "95%",
            alignSelf: "center",
            marginTop: 20,
            marginRight: 32,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          justifyContent: "space-around",
          width: "100%",
          marginBottom: 20,
        }}
      >
        <SecondaryButton
          size="SM"
          text="Clear All"
          onPress={() => {
            setIsNewSellerChecked(false);
            setIsLevelTwoChecked(false);
            setIsEnglishChecked(false);
            setIsLevelOneChecked(false);
            setIsTopRatedSellerCheckek(false);
            setIsSpanishChecked(false);
            setIsGermanChecked(false);
            setIsFrenchChecked(false);
            setIsUnitedStateChecked(false);
            setIsCanadaChecked(false);
            setIsGermanyChecked(false);
            setIsUnitedKingdomChecked(false);
          }}
        />
        <SecondaryButton
          size="SM"
          text="Apply"
          backgroundColor={primaryColor}
          color={neutral00}
        />
      </View>
    </TertiaryBox>
  );
};
