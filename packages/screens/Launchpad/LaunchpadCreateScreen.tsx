import React, { useState } from "react";
import { View } from "react-native";

import { LaunchpadAdditional } from "./components/LaunchpadAdditional";
import { LaunchpadAssetsandMetadata } from "./components/LaunchpadAssetsandMetadata";
import { LaunchpadBasic } from "./components/LaunchpadBasic";
import { LaunchpadDetails } from "./components/LaunchpadDetails";
import { LaunchpadMinting } from "./components/LaunchpadMinting";
import { LaunchpadSteper } from "./components/LaunchpadSteper";
import { LaunchpadTeamandInvestment } from "./components/LaunchpadTeamandInvestment";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { SpacerColumn } from "@/components/spacer";
import { NetworkFeature } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral33 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

const StepContent = ({ step }: { step: number }) => {
  switch (step) {
    case 1:
      return <LaunchpadBasic />;
    case 2:
      return <LaunchpadDetails />;
    case 3:
      return <LaunchpadTeamandInvestment />;
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

const stepOptions = [
  { key: 1, title: "Basic" },
  { key: 2, title: "Details" },
  { key: 3, title: "Team & Investments" },
  { key: 4, title: "Additional" },
  { key: 5, title: "Minting" },
  { key: 6, title: "Assets & Metadata" },
];

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
        <LaunchpadSteper
          stepOptions={stepOptions}
          step={selectedStep}
          onStepPress={setSelectedStep}
        />

        <View
          style={{
            paddingHorizontal: layout.spacing_x3_5,
            zIndex: 1,
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
                size="M"
                text="Back"
                loader
                onPress={() => {
                  setSelectedStep(selectedStep - 1);
                }}
              />
            )}
            <PrimaryButton
              width={137}
              size="M"
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
