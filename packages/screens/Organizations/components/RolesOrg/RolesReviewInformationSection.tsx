import React, { useCallback } from "react";
import {
  Image,
  ImageStyle,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { ReviewCollapsable } from "./../ReviewCollapsable";
import { ReviewCollapsableItem } from "./../ReviewCollapsableItem";

import { BrandText } from "@/components/BrandText";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkKind } from "@/networks";
import { neutral00, primaryColor } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import {
  ConfigureVotingFormType,
  CreateDaoFormType,
  MemberSettingFormType,
  RolesSettingFormType,
  TokenSettingFormType,
} from "@/utils/types/organizations";

interface RolesReviewInformationSectionProps {
  organizationData?: CreateDaoFormType;
  votingSettingData?: ConfigureVotingFormType;
  tokenSettingData?: TokenSettingFormType;
  memberSettingData?: MemberSettingFormType;
  rolesSettingData?: RolesSettingFormType;
  onSubmit: () => void;
}

export const RolesReviewInformationSection: React.FC<
  RolesReviewInformationSectionProps
> = ({
  organizationData,
  votingSettingData,
  tokenSettingData,
  memberSettingData,
  rolesSettingData,
  onSubmit,
}) => {
  const network = useSelectedNetworkInfo();

  const MemberReviewValue = useCallback(
    ({
      address,
      weight,
      roles,
    }: {
      address: string;
      weight: string;
      roles: string[];
    }) => (
      <View style={rowCStyle}>
        <BrandText style={addressTextCStyle}>
          {tinyAddress(address, 16)}
        </BrandText>
        <SpacerRow size={1.5} />
        <BrandText style={fontSemibold14}>{weight}</BrandText>
        <SpacerRow size={1.5} />
        {roles.map((role, index) => (
          <View key={role} style={rowCStyle}>
            <BrandText
              style={{
                ...fontSemibold14,
                backgroundColor: neutral00,
                borderRadius: 5,
                padding: 5,
              }}
            >
              {role}
            </BrandText>
            {roles.length !== index + 1 && <SpacerRow size={1.5} />}
          </View>
        ))}
      </View>
    ),
    [],
  );

  let associateName = "";
  if (network?.kind === NetworkKind.Gno) {
    associateName = "gno.land/r/demo/" + organizationData?.associatedHandle;
  } else if (network?.kind === NetworkKind.Cosmos) {
    associateName =
      organizationData?.associatedHandle || "" + network.nameServiceTLD;
  }

  let price = "0";
  const availability = organizationData?.nameAvailability;
  if (
    availability &&
    (availability.availability === "mint" ||
      availability.availability === "market")
  ) {
    price = availability.prettyPrice;
  }

  return (
    <ScrollView contentContainerStyle={containerCStyle}>
      <BrandText style={fontSemibold28}>Review information</BrandText>
      <SpacerColumn size={3} />

      <ReviewCollapsable title="Organization information">
        <ReviewCollapsableItem
          title="Organization's image"
          value={() => (
            <Image
              source={{ uri: organizationData?.imageUrl }}
              style={imageCStyle}
            />
          )}
        />
        <SpacerColumn size={1} />
        <ReviewCollapsableItem
          title="Organization's name"
          value={organizationData?.organizationName}
        />
        <SpacerColumn size={1} />
        <ReviewCollapsableItem
          title="Organization's description"
          value={organizationData?.organizationDescription}
        />
        <SpacerColumn size={1} />
        <ReviewCollapsableItem
          title="Associated Handle"
          value={associateName}
        />
        <SpacerColumn size={1} />
        <ReviewCollapsableItem title="Structure" value="Roles" />
      </ReviewCollapsable>

      <SpacerColumn size={2.5} />

      <ReviewCollapsable title="Voting settings">
        <ReviewCollapsableItem
          title="Support %"
          value={votingSettingData?.supportPercent.toString()}
        />
        <SpacerColumn size={1} />
        <ReviewCollapsableItem
          title="Minimum Approval %"
          value={votingSettingData?.minimumApprovalPercent.toString()}
        />
        <SpacerColumn size={1} />
        <ReviewCollapsableItem title="Days" value={votingSettingData?.days} />
        <SpacerColumn size={1} />
        <ReviewCollapsableItem title="Hours" value={votingSettingData?.hours} />
        <SpacerColumn size={1} />
        <ReviewCollapsableItem
          title="Minutes"
          value={votingSettingData?.minutes}
        />
      </ReviewCollapsable>

      <SpacerColumn size={2.5} />
      <ReviewCollapsable title="Roles settings">
        {rolesSettingData?.roles?.map((role, index) => (
          <View key={role.name} style={fillCStyle}>
            <ReviewCollapsableItem
              title={`ROLE #${index + 1}`}
              value={() => (
                <BrandText style={fontSemibold14}>{role.name}</BrandText>
              )}
            />
            {rolesSettingData?.roles.length !== index + 1 && (
              <SpacerColumn size={1} />
            )}
          </View>
        ))}
      </ReviewCollapsable>
      <SpacerColumn size={2.5} />

      <ReviewCollapsable title="Member settings">
        {memberSettingData?.members.map((member, index) => (
          <View key={member.addr} style={fillCStyle}>
            <ReviewCollapsableItem
              title={`MEMBER #${index + 1}`}
              value={() => (
                <MemberReviewValue
                  address={member.addr}
                  weight={`${member.weight}`}
                  roles={member.roles.split(",")}
                />
              )}
            />
            {tokenSettingData?.tokenHolders.length !== index + 1 && (
              <SpacerColumn size={1} />
            )}
          </View>
        ))}
      </ReviewCollapsable>

      <SpacerColumn size={4} />

      <View style={rowSBCStyle}>
        <View style={footerRowInsideCStyle}>
          <BrandText style={fontSemibold14}>Associated Handle:</BrandText>
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold14, { color: primaryColor }]}>
            {associateName}
          </BrandText>

          <SpacerRow size={3} />
          <Separator horizontal />
          <SpacerRow size={3} />

          <BrandText style={fontSemibold14}>
            Price of Organization Deployment:
          </BrandText>
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold14, { color: primaryColor }]}>
            {price}
          </BrandText>
        </View>

        <PrimaryButton
          size="M"
          text="Confirm & Launch the Organization"
          onPress={onSubmit}
        />
      </View>
    </ScrollView>
  );
};

const containerCStyle: ViewStyle = {
  padding: layout.contentSpacing,
  paddingRight: layout.spacing_x2_5,
  paddingTop: layout.topContentSpacingWithHeading,
};

const rowCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
};

const rowSBCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
};

const imageCStyle: ImageStyle = {
  width: 140,
  height: 140,
  borderRadius: 12,
};

const footerRowInsideCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  height: 24,
  flexWrap: "wrap",
};

const addressTextCStyle: TextStyle = {
  ...fontSemibold14,
  padding: layout.spacing_x1,
  backgroundColor: neutral00,
  borderRadius: 8,
};

const fillCStyle: ViewStyle = { flex: 1 };
