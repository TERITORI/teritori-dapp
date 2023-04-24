import React from "react";
import { FlatList, StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { SecondaryButtonOutline } from "../../../components/buttons/SecondaryButtonOutline";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { SpacerRow } from "../../../components/spacer";
import { TableRow, TableRowHeading } from "../../../components/table/TableRow";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useKeybaseAvatarURL } from "../../../hooks/useKeybaseAvatarURL";
import { Reward, rewardsPrice, useRewards } from "../../../hooks/useRewards";
import { UserKind, parseUserId } from "../../../networks";
import { removeObjectKey } from "../../../utils/object";
import { mineShaftColor } from "../../../utils/style/colors";
import { fontSemibold11, fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { numFormatter } from "../../../utils/text";
import { ValidatorInfo } from "../types";

const TABLE_ROWS: { [key in string]: TableRowHeading } = {
  rank: {
    label: "Rank",
    flex: 1,
  },
  name: {
    label: "Name",
    flex: 4,
  },
  votingPower: {
    label: "Voting Power",
    flex: 3,
  },
  commission: {
    label: "Commission",
    flex: 2,
  },
  claimable: {
    label: "Claimable reward",
    flex: 3,
  },
  actions: {
    label: "",
    flex: 2,
  },
};

interface ValidatorsListAction {
  label?: string;
  renderComponent?: () => React.ReactNode;
  onPress?: (validator: ValidatorInfo) => void;
}

export const ValidatorsTable: React.FC<{
  validators: ValidatorInfo[];
  actions?: (validator: ValidatorInfo) => ValidatorsListAction[];
  style?: StyleProp<ViewStyle>;
  userId: string | undefined;
  userKind: UserKind;
}> = ({ validators, actions, style, userId, userKind }) => {
  const ROWS = actions ? TABLE_ROWS : removeObjectKey(TABLE_ROWS, "actions");
  const { rewards, claimReward } = useRewards(userId, userKind);

  return (
    <>
      <TableRow headings={Object.values(ROWS)} />
      <FlatList
        data={validators}
        style={style}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <ValidatorRow
            validator={item}
            userId={userId}
            actions={actions}
            pendingRewards={rewards.filter(
              (reward) => reward.validator === item.address
            )}
            claimReward={claimReward}
          />
        )}
      />
    </>
  );
};

const ValidatorRow: React.FC<{
  validator: ValidatorInfo;
  pendingRewards: Reward[];
  claimReward: (validatorAddress: string) => Promise<void>;
  actions?: (validator: ValidatorInfo) => ValidatorsListAction[];
  userId: string | undefined;
}> = ({ validator, claimReward, pendingRewards, actions, userId }) => {
  const isMobile = useIsMobile();
  const imageURL = useKeybaseAvatarURL(validator.identity);
  const [, userAddress] = parseUserId(userId);
  // Rewards price with all denoms
  const claimablePrice = rewardsPrice(pendingRewards);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        minHeight: layout.contentSpacing,
        paddingHorizontal: layout.spacing_x2_5,
        borderColor: mineShaftColor,
        borderTopWidth: 1,
        paddingVertical: layout.spacing_x2,
      }}
    >
      <BrandText
        style={[
          isMobile ? fontSemibold11 : fontSemibold13,
          { flex: TABLE_ROWS.rank.flex, paddingRight: layout.spacing_x1 },
        ]}
      >
        {validator.rank}
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: TABLE_ROWS.name.flex,
          paddingRight: layout.spacing_x1,
        }}
      >
        <RoundedGradientImage
          size="XS"
          sourceURI={imageURL}
          style={{ marginRight: isMobile ? 8 : 30 }}
        />

        <SpacerRow size={1} />
        <BrandText
          style={[isMobile ? fontSemibold11 : fontSemibold13]}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {validator.moniker || ""}
        </BrandText>
      </View>
      <BrandText
        style={[
          isMobile ? fontSemibold11 : fontSemibold13,
          {
            flex: TABLE_ROWS.votingPower.flex,
            paddingRight: layout.spacing_x1,
          },
        ]}
      >
        {numFormatter(validator.votingPower, 2)}
      </BrandText>
      <BrandText
        style={[
          fontSemibold13,
          {
            flex: TABLE_ROWS.commission.flex,
            paddingRight: layout.spacing_x1,
          },
        ]}
      >
        {validator.commission}
      </BrandText>

      <View
        style={{
          flex: TABLE_ROWS.claimable.flex,
          paddingRight: actions ? layout.spacing_x1 : 0,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {!!claimablePrice && (
          <BrandText style={[isMobile ? fontSemibold11 : fontSemibold13]}>
            {`$${claimablePrice.toFixed(2)}`}
          </BrandText>
        )}
        {!!pendingRewards.length && (
          <PrimaryButtonOutline
            size="XS"
            style={{ paddingLeft: layout.spacing_x2 }}
            text="Claim"
            disabled={!userAddress}
            onPress={() => {
              claimReward(validator.address);
            }}
          />
        )}
      </View>

      {!!actions && (
        <View
          style={{
            flex: TABLE_ROWS.actions.flex,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {actions(validator).map((action, index) =>
            action.renderComponent ? (
              action.renderComponent()
            ) : (
              <SecondaryButtonOutline
                key={index}
                onPress={() => {
                  if (typeof action.onPress !== "function") {
                    return;
                  }
                  action.onPress(validator);
                }}
                text={action.label || ""}
                size="XS"
              />
            )
          )}
        </View>
      )}
    </View>
  );
};
