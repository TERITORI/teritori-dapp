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

export const LogoOptionsDropDownMenu: React.FC = () => {
  const [isPNGChecked, setIsPNGChecked] = useState(false);
  const [isJPGChecked, setIsJPGChecked] = useState(false);
  const [isPDFChecked, setIsPDFChecked] = useState(false);
  const [isAIChecked, setIsAIChecked] = useState(false);
  const [isLogoTransparencyChecked, setIsLogoTransparencyChecked] =
    useState(false);
  const [isPrintableFileChecked, setIsPrintableFileChecked] = useState(false);
  const [isVectorFileChecked, setIsVectorFileChecked] = useState(false);
  const [isSourceFileChecked, setIsSourceFileChecked] = useState(false);

  return (
    <TertiaryBox
      style={{ position: "absolute", top: 60 }}
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
          File Format
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
              color={isPNGChecked ? primaryColor : secondaryColor}
              value={isPNGChecked}
              onValueChange={setIsPNGChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              PNG
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isJPGChecked ? primaryColor : secondaryColor}
              value={isJPGChecked}
              onValueChange={setIsJPGChecked}
            />
            <BrandText
              style={[fontSemibold14, { marginRight: 6, marginLeft: 6 }]}
            >
              JPG
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
              color={isPDFChecked ? primaryColor : secondaryColor}
              value={isPDFChecked}
              onValueChange={setIsPDFChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              PDF
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isAIChecked ? primaryColor : secondaryColor}
              value={isAIChecked}
              onValueChange={setIsAIChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              AI
              <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
                (105 000)
              </BrandText>
            </BrandText>
          </View>
        </View>
        <TouchableOpacity>
          <BrandText style={[fontSemibold14, { color: primaryColor }]}>
            +5 More
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
          Service includes
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
              color={isLogoTransparencyChecked ? primaryColor : secondaryColor}
              value={isLogoTransparencyChecked}
              onValueChange={setIsLogoTransparencyChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              Logo transparency
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isPrintableFileChecked ? primaryColor : secondaryColor}
              value={isPrintableFileChecked}
              onValueChange={setIsPrintableFileChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              Printable file
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
              color={isVectorFileChecked ? primaryColor : secondaryColor}
              value={isVectorFileChecked}
              onValueChange={setIsVectorFileChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              Vector file
              <BrandText
                style={[{ color: neutral77, marginLeft: 6 }, fontSemibold14]}
              >
                (105 000)
              </BrandText>
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              color={isSourceFileChecked ? primaryColor : secondaryColor}
              value={isSourceFileChecked}
              onValueChange={setIsSourceFileChecked}
            />
            <BrandText
              style={[
                fontSemibold14,
                { marginRight: 6, marginLeft: 6, width: 220 },
              ]}
            >
              Source file
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
            +3 More
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
            setIsAIChecked(false);
            setIsJPGChecked(false);
            setIsLogoTransparencyChecked(false);
            setIsPDFChecked(false);
            setIsPNGChecked(false);
            setIsPrintableFileChecked(false);
            setIsSourceFileChecked(false);
            setIsVectorFileChecked(false);
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
