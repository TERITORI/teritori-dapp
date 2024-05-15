import { Decimal } from "@cosmjs/math";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import { BrandText } from "@/components/BrandText";
import { PrimaryButtonOutline } from "@/components/buttons/PrimaryButtonOutline";
import { SecondaryButtonOutline } from "@/components/buttons/SecondaryButtonOutline";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { SpacerRow } from "@/components/spacer";
import { TableColumns, TableHeader } from "@/components/table/TableHeader";
import { useCosmosValidatorBondedAmount } from "@/hooks/useCosmosValidatorBondedAmount";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useKeybaseAvatarURL } from "@/hooks/useKeybaseAvatarURL";
import { Reward, rewardsPrice, useRewards } from "@/hooks/useRewards";
import { UserKind, getStakingCurrency, parseUserId } from "@/networks";
import { prettyPrice } from "@/utils/coins";
import { removeObjectKey, removeObjectKeys } from "@/utils/object";
import {
  errorColor,
  mineShaftColor,
  neutral33,
  orangeDefault,
  successColor,
  yellowDefault,
} from "@/utils/style/colors";
import { fontSemibold11, fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { ValidatorInfo } from "@/utils/types/staking";

const serviceScoreSize = 24;

const TABLE_COLUMNS: TableColumns = {
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
  serviceScore: {
    label: "Service Score",
    flex: 2,
  },
  commission: {
    label: "Commission",
    flex: 2,
  },
  staked: {
    label: "Staked",
    flex: 2,
  },
  claimable: {
    label: "Claimable Reward",
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
}> = ({ validators: validatorsProp, actions, style, userId, userKind }) => {
  const isMobile = useIsMobile();

  const [sortBy] = React.useState<string>("rank");

  const validators = [...validatorsProp].sort((a, b) => {
    switch (sortBy) {
      case "serviceScore":
        return (b.serviceScore || 0) - (a.serviceScore || 0);
      default:
        return Number(a.rank || Infinity) - Number(b.rank || Infinity);
    }
  });

  const COLUMNS_TMP =
    actions && !isMobile
      ? TABLE_COLUMNS
      : removeObjectKey(TABLE_COLUMNS, "actions");
  const COLUMNS = userId
    ? COLUMNS_TMP
    : removeObjectKeys(COLUMNS_TMP, ["staked", "claimable"]);
  const { rewards, claimReward } = useRewards(userId, userKind);

  return (
    <>
      <TableHeader
        columns={COLUMNS}
        style={{
          paddingHorizontal: layout.spacing_x2_5,
        }}
      />
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
              (reward) => reward.validator === item.address,
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
  const [network, userAddress] = parseUserId(userId);
  // Rewards price with all denoms
  const claimablePrice = rewardsPrice(pendingRewards);
  const stakingCurrency = getStakingCurrency(network?.id);
  const { bondedTokens } = useCosmosValidatorBondedAmount(
    userId,
    validator?.address,
  );

  return (
    <>
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
            { flex: TABLE_COLUMNS.rank.flex, paddingRight: layout.spacing_x1 },
          ]}
        >
          {validator.rank}
        </BrandText>
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: layout.spacing_x0_5,
            flex: TABLE_COLUMNS.name.flex,
            paddingRight: layout.spacing_x1,
          }}
        >
          <RoundedGradientImage size="XS" sourceURI={imageURL} />

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
              flex: TABLE_COLUMNS.votingPower.flex,
              paddingRight: layout.spacing_x1,
            },
          ]}
        >
          {validator.votingPowerPercent.toFixed(2)}%
          {!!stakingCurrency &&
            " - " +
              prettyPrice(
                network?.id,
                Decimal.fromUserInput(
                  validator.votingPower,
                  stakingCurrency?.decimals,
                ).atomics,
                stakingCurrency?.denom,
              )}
        </BrandText>
        <View
          style={{
            flex: TABLE_COLUMNS.serviceScore.flex,
            paddingRight: layout.spacing_x1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {validator.serviceScore === undefined ? (
            <ActivityIndicator size={serviceScoreSize} />
          ) : (
            <>
              <View
                style={{
                  width: serviceScoreSize,
                  height: serviceScoreSize,
                  backgroundColor: mapScoreToColor(validator.serviceScore),
                  borderRadius: serviceScoreSize / 2,
                  marginRight: layout.spacing_x1,
                }}
              />

              <BrandText
                style={[
                  isMobile ? fontSemibold11 : fontSemibold13,
                  { color: mapScoreToColor(validator.serviceScore) },
                ]}
              >
                {validator.serviceScore === null
                  ? "¯\\_(ツ)_/¯"
                  : (validator.serviceScore * 100).toFixed(1)}
              </BrandText>
            </>
          )}
        </View>
        <BrandText
          style={[
            fontSemibold13,
            {
              flex: TABLE_COLUMNS.commission.flex,
              paddingRight: actions || userId ? layout.spacing_x1 : 0,
            },
          ]}
        >
          {validator.commission}
        </BrandText>
        {!!userId && (
          <>
            <View
              style={{
                flex: TABLE_COLUMNS.staked.flex,
                paddingRight: layout.spacing_x1,
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {!!bondedTokens &&
                (bondedTokens.amount.toFloatApproximation() || 0) > 0 && (
                  <BrandText
                    style={[isMobile ? fontSemibold11 : fontSemibold13]}
                  >
                    {prettyPrice(
                      network?.id,
                      bondedTokens.amount.atomics,
                      bondedTokens.currency.denom,
                    )}
                  </BrandText>
                )}
            </View>
            <View
              style={{
                flex: TABLE_COLUMNS.claimable.flex,
                paddingRight: actions ? layout.spacing_x1 : 0,
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
              }}
            >
              {!!claimablePrice && (
                <BrandText style={[isMobile ? fontSemibold11 : fontSemibold13]}>
                  {`$${claimablePrice.toFixed(2)}`}
                </BrandText>
              )}
              {!!pendingRewards?.length && (
                <PrimaryButtonOutline
                  size={isMobile ? "XXS" : "XS"}
                  style={
                    isMobile
                      ? { paddingTop: layout.spacing_x1 }
                      : { paddingLeft: layout.spacing_x2 }
                  }
                  text="Claim"
                  disabled={!userAddress}
                  onPress={() => {
                    claimReward(validator.address);
                  }}
                />
              )}
            </View>
          </>
        )}
        {!!actions && !isMobile && (
          <View
            style={{
              flex: TABLE_COLUMNS.actions.flex,
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
                  size={isMobile ? "XXS" : "XS"}
                />
              ),
            )}
          </View>
        )}
      </View>
      {!!actions && isMobile && (
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            justifyContent: "center",
            width: 100,
            marginBottom: layout.spacing_x2,
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
                size={isMobile ? "XXS" : "XS"}
              />
            ),
          )}
        </View>
      )}
    </>
  );
};

const mapScoreToColor = (score: number | null) => {
  if (score === null) {
    return neutral33;
  }
  if (score >= 0.9) {
    return successColor;
  }
  if (score >= 0.7) {
    return yellowDefault;
  }
  if (score >= 0.4) {
    return orangeDefault;
  }
  return errorColor;
};
