import React, { useCallback } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import { ReviewCollapsable } from "./ReviewCollapsable";
import { ReviewCollapsableItem } from "./ReviewCollapsableItem";
import { BrandText } from "../../../components/BrandText";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutral00, primaryColor } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import {
  ConfigureVotingFormType,
  CreateDaoFormType,
  TokenSettingFormType,
} from "../types";

interface ReviewInformationSectionProps {
  organizationData?: CreateDaoFormType;
  votingSettingData?: ConfigureVotingFormType;
  tokenSettingData?: TokenSettingFormType;
  onSubmit: () => void;
}

export const ReviewInformationSection: React.FC<
  ReviewInformationSectionProps
> = ({ organizationData, votingSettingData, tokenSettingData, onSubmit }) => {
  // returns
  const AddressBalanceValue = useCallback(
    ({ address, balance }: { address: string; balance: string }) => (
      <View style={styles.row}>
        <BrandText style={styles.addressText}>
          {tinyAddress(address, 10)}
        </BrandText>
        <SpacerRow size={1.5} />
        <BrandText style={fontSemibold14}>{balance}</BrandText>
      </View>
    ),
    []
  );

  let associateName = organizationData?.associatedTeritoriNameService
    ? organizationData?.associatedTeritoriNameService
    : "";
  associateName = associateName.includes(".tori")
    ? associateName
    : associateName + ".tori";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BrandText style={fontSemibold28}>Review information</BrandText>
      <SpacerColumn size={3} />

      <ReviewCollapsable title="Organization information">
        <ReviewCollapsableItem
          title="Organization's image"
          value={() => (
            <Image
              source={{ uri: organizationData?.imageUrl }}
              style={styles.image}
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
          title="Associated Teritori Name Service"
          value={associateName}
        />
        <SpacerColumn size={1} />
        <ReviewCollapsableItem
          title="Structure"
          value={organizationData?.structure}
        />
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

      <ReviewCollapsable title="Token settings">
        <ReviewCollapsableItem
          title="TOKEN NAME & SYMBOL"
          value={`${tokenSettingData?.tokenName} (${tokenSettingData?.tokenSymbol})`}
        />
        <SpacerColumn size={1} />
        {tokenSettingData?.tokenHolders.map((holder, index) => (
          <View key={holder.address} style={styles.fill}>
            <ReviewCollapsableItem
              title={`TOKENHOLDER #${index + 1}`}
              value={() => (
                <AddressBalanceValue
                  address={holder.address}
                  balance={`${holder.balance} ${tokenSettingData?.tokenSymbol}`}
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

      <View style={styles.rowSB}>
        <View style={styles.footerRowInside}>
          <BrandText style={fontSemibold14}>Associated TNS:</BrandText>
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
            5 TORI
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
// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingRight: layout.padding_x2_5,
    paddingTop: layout.topContentPaddingWithHeading,
  },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  rowSB: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  footerRowInside: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
    flexWrap: "wrap",
  },
  addressText: StyleSheet.flatten([
    fontSemibold14,
    { padding: layout.padding_x1, backgroundColor: neutral00, borderRadius: 8 },
  ]),
  fill: { flex: 1 },
});
