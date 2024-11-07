import React from "react";
import { View, Linking } from "react-native";

import { PrimaryButton } from "./../../../../../components/buttons/PrimaryButton";
import { useAppNavigation } from "./../../../../../hooks/navigation/useAppNavigation";
import { launchpadProjectStatus } from "./../../../../../utils/launchpad";
import { ApplicationCard } from "./ApplicationCard";
import { Status } from "../../../../../api/launchpad/v1/launchpad";
import { StatusBadge } from "../../../components/StatusBadge";

import websiteSVG from "@/assets/icons/website.svg";
import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { BoxStyle } from "@/components/boxes/Box";
import { SocialButton } from "@/components/buttons/SocialButton";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

const breakpointM = 900;

export const ApplicationDetail: React.FC<{
  collectionData: CollectionDataResult;
  projectStatus: Status;
}> = ({ collectionData, projectStatus }) => {
  const { width } = useMaxResolution();
  const navigation = useAppNavigation();

  return (
    <View
      style={{
        flexDirection: width >= breakpointM ? "row" : "column-reverse",
        alignItems: width >= breakpointM ? "flex-start" : "center",
        justifyContent: "center",
      }}
    >
      {/* ===== Left container */}
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <StatusBadge projectStatus={projectStatus} />
          {launchpadProjectStatus(projectStatus) === "INCOMPLETE" && (
            <>
              <SpacerRow size={2} />
              <PrimaryButton
                text="Complete collection"
                size="XXS"
                onPress={() =>
                  navigation.navigate("LaunchpadComplete", {
                    id: collectionData.symbol,
                  })
                }
              />
            </>
          )}
        </View>
        <BrandText style={[fontSemibold28, { marginTop: layout.spacing_x3 }]}>
          {collectionData.name}
        </BrandText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: layout.spacing_x1_5,
            gap: layout.spacing_x1_5,
            flexWrap: "wrap",
          }}
        >
          <ApplicationCard
            title="Supply"
            value={collectionData.tokens_count.toString()}
            style={applicationCardCStyle}
          />
          <ApplicationCard
            title="Symbol"
            value={collectionData.symbol}
            style={applicationCardCStyle}
          />
        </View>
        <View style={{ marginTop: layout.spacing_x3 }}>
          <BrandText style={fontSemibold14}>{collectionData.desc}</BrandText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: layout.spacing_x3,
            gap: layout.spacing_x1_5,
            flexWrap: "wrap",
          }}
        >
          <SocialButton
            text="Website"
            iconSvg={websiteSVG}
            onPress={() => Linking.openURL(collectionData.website_link)}
          />
        </View>
      </View>

      {width >= breakpointM ? (
        <SpacerRow size={3} />
      ) : (
        <SpacerColumn size={3} />
      )}

      {/* ===== Right container */}
      <OptimizedImage
        resizeMode="contain"
        height={width >= breakpointM ? 534 : 380}
        width={width >= breakpointM ? 534 : 380}
        style={[
          {
            height: width >= breakpointM ? 534 : 380,
            width: width >= breakpointM ? 534 : 380,
          },
          width >= breakpointM && { flex: 1 },
        ]}
        sourceURI={collectionData.cover_img_uri}
      />
    </View>
  );
};

const applicationCardCStyle: BoxStyle = { width: 132, maxWidth: 140 };
