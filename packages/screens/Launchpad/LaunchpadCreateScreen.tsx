import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { LaunchpadAdditional } from "./components/LaunchpadAdditional";
import { LaunchpadAssetsandMetadata } from "./components/LaunchpadAssetsandMetadata";
import { LaunchpadBasic } from "./components/LaunchpadBasic";
import { LaunchpadDetails } from "./components/LaunchpadDetails";
import { LaunchpadMinting } from "./components/LaunchpadMinting";
import { LaunchpadTeamandCondition } from "./components/LaunchpadTeamandCondition";
import ChevronRightSvg from "../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Box } from "../../components/boxes/Box";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { SpacerColumn } from "../../components/spacer";
import { NetworkFeature } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import {
  neutral17,
  neutral22,
  neutral33,
  neutral77,
  primaryColor,
  primaryTextColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const StepContent = ({ step }: { step: number }) => {
  switch (step) {
    case 1:
      return <LaunchpadBasic />;
    case 2:
      return <LaunchpadDetails />;
    case 3:
      return <LaunchpadTeamandCondition />;
    case 4:
      return <LaunchpadAdditional />;
    case 5:
      return <LaunchpadMinting />;
    case 6:
      return <LaunchpadAssetsandMetadata />;
    default:
      return <></>;
  }
};

export const LaunchpadCreateScreen: ScreenFC<"LaunchpadCreate"> = () => {
  const navigation = useAppNavigation();

  const [selectedStep, setSelectedStep] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const stepOptions = [
    { key: 1, title: "Basic" },
    { key: 2, title: "Details" },
    { key: 3, title: "Team & Investments" },
    { key: 4, title: "Additional" },
    { key: 5, title: "Minting" },
    { key: 6, title: "Assets & Metadata" },
  ];
  return (
    <ScreenContainer
      fullWidth
      noMargin
      noScroll={false}
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.SocialFeed]}
      headerChildren={<BrandText>Launchpad Submission Form</BrandText>}
      onBackPress={() => navigation.navigate("LaunchpadApply")}
    >
      <View
        style={{
          marginTop: layout.spacing_x3,
        }}
      >
        <Box
          style={{
            flexDirection: "row",
            alignItems: "center",
            minHeight: 56,
            backgroundColor: neutral17,
            justifyContent: "center",
            marginHorizontal: layout.spacing_x3,
          }}
        >
          {stepOptions.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedStep(item.key);
              }}
              key={index}
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: layout.spacing_x2,
                  paddingVertical: layout.spacing_x1,
                },
              ]}
            >
              <View
                style={{
                  width: layout.iconButton,
                  height: layout.iconButton,
                  borderRadius: layout.iconButton / 2,
                  backgroundColor:
                    selectedStep === item.key ? primaryColor : neutral22,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: layout.spacing_x0_75,
                }}
              >
                <BrandText
                  style={[
                    fontSemibold14,
                    {
                      color:
                        selectedStep === item.key
                          ? primaryTextColor
                          : neutral77,
                    },
                  ]}
                >
                  {item.key}
                </BrandText>
              </View>
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    marginLeft: 12,
                    color: selectedStep === item.key ? primaryColor : neutral77,
                    marginRight: layout.spacing_x2,
                  },
                ]}
              >
                {item.title}
              </BrandText>
              {stepOptions.length !== index + 1 && (
                <SVG
                  source={ChevronRightSvg}
                  width={16}
                  height={16}
                  color={neutral77}
                />
              )}
            </TouchableOpacity>
          ))}
        </Box>
        <View
          style={{
            paddingHorizontal: layout.spacing_x3_5,
          }}
        >
          <SpacerColumn size={4} />
          <StepContent step={selectedStep} />
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderColor: neutral33,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginVertical: layout.spacing_x2,
              marginLeft: layout.spacing_x4,
              marginRight: layout.spacing_x2,
              justifyContent: selectedStep === 1 ? "flex-end" : "space-between",
            }}
          >
            {selectedStep !== 1 && (
              <SecondaryButton
                width={136}
                size="XL"
                text="Back"
                loader
                onPress={() => {
                  setSelectedStep(selectedStep - 1);
                }}
              />
            )}
            <PrimaryButton
              width={137}
              size="XL"
              text={stepOptions.length === selectedStep ? "Submit" : "Next"}
              loader
              isLoading={isLoading}
              onPress={() => {
                if (stepOptions.length === selectedStep) {
                  onSubmit();
                } else {
                  setSelectedStep(selectedStep + 1);
                }
              }}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};
