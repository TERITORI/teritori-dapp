import React, { useState } from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle } from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { CurrencyIcon } from "../../components/images/CurrencyIcon";
import { getNetwork } from "../../networks";
import { Balance, prettyPrice } from "../../utils/coins";
import { neutral22, neutral33 } from "../../utils/style/colors";
import { DepositWithdrawModal } from "./components/DepositWithdrawModal";

const collapsedCount = 5;

export const Assets: React.FC<{
  networkId: string;
  balances: Balance[];
  style?: StyleProp<ViewStyle>;
}> = ({ networkId, balances, style }) => {
  const [isDepositVisible, setDepositVisible] = useState(false);
  const [isWithdrawVisible, setWithdrawVisible] = useState(false);
  const [targetCurrency, setTargetCurrency] = useState<string>();
  const [expanded, setExpanded] = useState(false);

  const selectedNetwork = getNetwork(networkId);
  if (!selectedNetwork) {
    return null;
  }

  const deposit = (target: string) => {
    setTargetCurrency(target);
    setDepositVisible(true);
  };

  const withdraw = (target: string) => {
    setTargetCurrency(target);
    setWithdrawVisible(true);
  };

  let currencies = [...selectedNetwork.currencies]
    .sort((a, b) => {
      const aBal = balances.find((bal) => bal.denom === a.denom);
      const bBal = balances.find((bal) => bal.denom === b.denom);
      return (bBal?.usdAmount || 0) - (aBal?.usdAmount || 0);
    })
    .filter((currency) => {
      const balance = balances.find((bal) => bal.denom === currency.denom);
      if (
        currency.kind === "ibc" &&
        currency.deprecated &&
        (!balance?.amount || balance.amount === "0")
      ) {
        return false;
      }
      return true;
    });

  if (!expanded) {
    currencies = currencies.slice(0, collapsedCount);
  }

  return (
    <View
      style={[
        {
          marginTop: 40,
          paddingTop: 40,
          borderTopWidth: 1,
          borderColor: neutral33,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BrandText style={{ marginRight: 20, fontSize: 20 }}>
            Assets on {selectedNetwork.displayName}
          </BrandText>
        </View>
        {selectedNetwork.currencies.length > collapsedCount && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <BrandText
              style={{
                fontSize: 14,
                lineHeight: 16,
                marginRight: 16,
              }}
            >
              {expanded ? "Collapse" : "Expand"} All Items
            </BrandText>
            <TouchableOpacity
              onPress={() => setExpanded((prev) => !prev)}
              style={{
                backgroundColor: neutral22,
                borderWidth: 1,
                borderColor: neutral33,
                height: 32,
                width: 32,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SVG
                width={16}
                height={16}
                source={expanded ? chevronUpSVG : chevronDownSVG}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {currencies
        .filter((currency) => currency.denom)
        .map((currency, index) => {
          const balance = balances.find((bal) => bal.denom === currency.denom);
          return (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: index !== currencies.length - 1 ? 1 : 0,
                borderColor: neutral33,
                paddingVertical: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/*TODO: Refactor that : We want SVG with icon-circle (from currencies). And SWG with icon (From network).*/}
                {/*==> By extension, FIXME: Allow to add currencies to a network WITHOUT adding this network*/}
                {/*=> CurrencyIcon is useless*/}
                <CurrencyIcon
                  size={64}
                  networkId={networkId}
                  denom={currency.denom}
                  icon={currency.icon}
                />
                <View style={{ marginLeft: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <BrandText>
                      {prettyPrice(
                        networkId,
                        balance?.amount || "0",
                        currency.denom
                      )}
                    </BrandText>
                  </View>
                  {!!balance?.usdAmount && (
                    <BrandText
                      style={{
                        marginTop: 8,
                        fontSize: 14,
                      }}
                    >
                      ≈ ${balance.usdAmount.toFixed(2)}
                    </BrandText>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {currency.kind === "ibc" && (
                  <>
                    {currency.deprecated || (
                      <SecondaryButton
                        style={{ marginRight: 16 }}
                        text="Deposit"
                        size="M"
                        onPress={() => deposit(currency.denom)}
                      />
                    )}
                    <SecondaryButton
                      text="Withdraw"
                      size="M"
                      onPress={() => withdraw(currency.denom)}
                    />
                  </>
                )}
              </View>
            </View>
          );
        })}
      <DepositWithdrawModal
        variation="deposit"
        selectedNetworkId={networkId}
        targetCurrency={targetCurrency}
        onClose={() => setDepositVisible(false)}
        isVisible={isDepositVisible}
      />
      <DepositWithdrawModal
        variation="withdraw"
        selectedNetworkId={networkId}
        targetCurrency={targetCurrency}
        onClose={() => setWithdrawVisible(false)}
        isVisible={isWithdrawVisible}
      />
    </View>
  );
};
