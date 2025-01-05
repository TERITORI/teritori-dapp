import { Dispatch, FC, SetStateAction, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  LayoutChangeEvent,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import ChevronRightSvg from "@/assets/icons/chevron-right.svg";
import RejectSVG from "@/assets/icons/reject.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  neutral17,
  neutral22,
  neutral77,
  primaryColor,
  primaryTextColor,
} from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionFormValues } from "@/utils/types/launchpad";
export type LaunchpadCreateStepKey = number;

interface LaunchpadStepperProps {
  selectedStepKey: LaunchpadCreateStepKey;
  setSelectedStepKey: Dispatch<SetStateAction<LaunchpadCreateStepKey>>;
}

interface LaunchpadCreateStep {
  key: LaunchpadCreateStepKey;
  title: string;
}

const steps: LaunchpadCreateStep[] = [
  {
    key: 1,
    title: "Basic",
  },
  {
    key: 2,
    title: "Details",
  },
  {
    key: 3,
    title: "Team & Investments",
  },
  {
    key: 4,
    title: "Additional",
  },
  {
    key: 5,
    title: "Minting",
  },
  {
    key: 6,
    title: "Assets & Metadata",
  },
];

export const LaunchpadStepper: FC<LaunchpadStepperProps> = ({
  selectedStepKey,
  setSelectedStepKey,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const isMobile = useIsMobile();
  const collectionForm = useFormContext<CollectionFormValues>();

  const hasErrors = (stepKey: number) => {
    if (
      (stepKey === 1 &&
        (!!collectionForm.getFieldState("name").error ||
          !!collectionForm.getFieldState("description").error ||
          !!collectionForm.getFieldState("symbol").error)) ||
      !!collectionForm.getFieldState("coverImage").error ||
      !!collectionForm.getFieldState("assetsMetadatas.nftApiKey").error
    ) {
      return true;
    }
    if (
      stepKey === 2 &&
      (!!collectionForm.getFieldState("websiteLink").error ||
        !!collectionForm.getFieldState("isDerivativeProject").error ||
        !!collectionForm.getFieldState("projectTypes").error ||
        !!collectionForm.getFieldState("isPreviouslyApplied").error ||
        !!collectionForm.getFieldState("email").error)
    ) {
      return true;
    }
    if (
      stepKey === 3 &&
      (!!collectionForm.getFieldState("teamDescription").error ||
        !!collectionForm.getFieldState("partnersDescription").error ||
        !!collectionForm.getFieldState("investDescription").error ||
        !!collectionForm.getFieldState("investLink").error)
    ) {
      return true;
    }
    if (
      stepKey === 4 &&
      (!!collectionForm.getFieldState("artworkDescription").error ||
        !!collectionForm.getFieldState("isReadyForMint").error ||
        !!collectionForm.getFieldState("isDox").error ||
        !!collectionForm.getFieldState("daoWhitelistCount").error ||
        !!collectionForm.getFieldState("escrowMintProceedsPeriod").error)
    ) {
      return true;
    }
    if (
      stepKey === 5 &&
      (!!collectionForm.getFieldState("mintPeriods").error ||
        !!collectionForm.getFieldState("royaltyAddress").error ||
        !!collectionForm.getFieldState("royaltyPercentage").error)
    ) {
      return true;
    }
    if (
      stepKey === 6 &&
      !!collectionForm.getFieldState("assetsMetadatas").error
    ) {
      return true;
    }
  };

  const onSelectedItemLayout = (e: LayoutChangeEvent) => {
    scrollViewRef.current?.scrollTo({
      x: e.nativeEvent.layout.x,
      animated: false,
    });
  };

  return (
    <PrimaryBox
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        backgroundColor: neutral17,
        justifyContent: "center",
        marginHorizontal: isMobile ? 0 : layout.spacing_x3,
        borderWidth: 0,
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <View
          style={[
            windowWidth >= 1240 && { justifyContent: "center" },
            {
              flexDirection: "row",
              width: "100%",
            },
          ]}
        >
          {steps.map((step, index) => {
            const isSelected = selectedStepKey === step.key;
            return (
              <TouchableOpacity
                key={step.key}
                onLayout={(e) => {
                  if (isSelected) onSelectedItemLayout(e);
                }}
                onPress={() => setSelectedStepKey(step.key)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: layout.spacing_x2,
                  paddingVertical: layout.spacing_x1,
                }}
              >
                <View
                  style={{
                    width: layout.iconButton,
                    height: layout.iconButton,
                    borderRadius: layout.iconButton / 2,
                    backgroundColor: isSelected ? primaryColor : neutral22,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: layout.spacing_x0_75,
                  }}
                >
                  {hasErrors(step.key) && (
                    <SVG
                      source={RejectSVG}
                      width={14}
                      height={14}
                      style={{ position: "absolute", top: -6, right: -6 }}
                    />
                  )}
                  <BrandText
                    style={[
                      fontMedium14,
                      {
                        lineHeight: layout.spacing_x2,
                        color: isSelected ? primaryTextColor : neutral77,
                      },
                    ]}
                  >
                    {step.key}
                  </BrandText>
                </View>
                <BrandText
                  style={[
                    fontMedium14,
                    {
                      lineHeight: layout.spacing_x2,
                      marginLeft: 12,
                      color: isSelected ? primaryColor : neutral77,
                      marginRight: layout.spacing_x2,
                    },
                  ]}
                >
                  {step.title}
                </BrandText>
                {steps.length !== index + 1 && (
                  <SVG
                    source={ChevronRightSvg}
                    width={16}
                    height={16}
                    color={neutral77}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </PrimaryBox>
  );
};
