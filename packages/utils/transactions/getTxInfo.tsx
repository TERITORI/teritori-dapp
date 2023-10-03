// FIXME: handle case where there is bad json in the db

import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import React from "react";
import { View, Pressable, ViewStyle, StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";

import feedWhiteSVG from "../../../assets/icons/feed_white.svg";
import multisigWhiteSVG from "../../../assets/icons/multisig_white.svg";
import stakingWhiteSVG from "../../../assets/icons/staking_white.svg";
import tnsWhiteSVG from "../../../assets/icons/tns-service_white.svg";
import walletWhiteSVG from "../../../assets/icons/wallet_white.svg";
import { BrandText } from "../../components/BrandText";
import {
  NetworkInfo,
  getUserId,
  NetworkKind,
  cosmosTypesRegistry,
} from "../../networks";
import { prettyPrice } from "../coins";
import { AppNavigationProp } from "../navigation";
import { neutral77 } from "../style/colors";
import { fontSemibold14 } from "../style/fonts";
import { tinyAddress } from "../text";

export const getTxInfo = (
  msgs: any[],
  navigation: AppNavigationProp,
  network: NetworkInfo | undefined
): [string, React.ReactElement, React.ReactElement, React.FC<SvgProps>] => {
  if (msgs.length === 0) {
    return [
      "Sentiment",
      <BrandText style={brandTextNormalCStyle}> </BrandText>,
      <BrandText style={brandTextNormalCStyle}> </BrandText>,
      multisigWhiteSVG,
    ];
  }
  if (msgs.length > 1) {
    return [
      "Complex",
      <BrandText style={brandTextNormalCStyle}>
        {msgs.length} messages
      </BrandText>,
      <BrandText style={brandTextNormalCStyle}> </BrandText>,
      multisigWhiteSVG,
    ];
  }
  let msg = msgs[0];
  try {
    if (msg.stargate) {
      const obj = cosmosTypesRegistry.decode({
        typeUrl: msg.stargate.type_url,
        value: Buffer.from(msg.stargate.value, "base64"),
      });
      msg = { typeUrl: msg.stargate.type_url, value: obj };
    } else if (msg.bank) {
      if (msg.bank.send) {
        msg = { typeUrl: "/cosmos.bank.v1beta1.MsgSend", value: msg.bank.send };
      }
    } else if (msg.wasm) {
      if (msg.wasm.execute) {
        const execMsg: MsgExecuteContractEncodeObject = {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: {
            contract: msg.wasm.execute.contract_addr,
            funds: msg.wasm.execute.funds,
            sender: "",
            msg: Buffer.from(msg.wasm.execute.msg, "base64"),
          },
        };
        console.log("olol", msg);
        msg = execMsg;
        console.log("olol2", execMsg);
      }
    }
    switch (msg.typeUrl) {
      case "/cosmos.bank.v1beta1.MsgSend": {
        const recipientAddress = msg.value.toAddress;
        const amount = msg.value.amount?.[0]?.amount;
        const denom = msg.value.amount?.[0]?.denom;
        return [
          "Send",
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Sending to: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, recipientAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={StyleSheet.flatten(fontSemibold14)}>
                {tinyAddress(recipientAddress, 14)}
              </BrandText>
            </Pressable>
          </View>,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Will receive: </BrandText>
            <BrandText style={StyleSheet.flatten(fontSemibold14)}>
              {prettyPrice(network?.id, amount, denom)}
            </BrandText>
          </View>,
          walletWhiteSVG,
        ];
      }
      case "/cosmos.staking.v1beta1.MsgDelegate": {
        const validatorAddress = msg.value.validatorAddress;
        const amount = msg.value.amount?.amount;
        const denom = msg.value.amount?.denom;
        return [
          "Delegate",
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Delegating to: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, validatorAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={StyleSheet.flatten(fontSemibold14)}>
                {tinyAddress(validatorAddress, 20)}
              </BrandText>
            </Pressable>
          </View>,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Will delegate: </BrandText>
            <BrandText style={StyleSheet.flatten(fontSemibold14)}>
              {prettyPrice(network?.id, amount, denom)}
            </BrandText>
          </View>,
          stakingWhiteSVG,
        ];
      }
      case "/cosmos.staking.v1beta1.MsgUndelegate": {
        const validatorAddress = msg.value.validatorAddress;
        const amount = msg.value.amount?.amount;
        const denom = msg.value.amount?.denom;
        return [
          "Undelegate",
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>
              Undelegating from:{" "}
            </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, validatorAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={StyleSheet.flatten(fontSemibold14)}>
                {tinyAddress(validatorAddress, 20)}
              </BrandText>
            </Pressable>
          </View>,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>
              Will undelegate:{" "}
            </BrandText>
            <BrandText style={StyleSheet.flatten(fontSemibold14)}>
              {prettyPrice(network?.id, amount, denom)}
            </BrandText>
          </View>,
          stakingWhiteSVG,
        ];
      }
      case "/cosmos.staking.v1beta1.MsgBeginRedelegate": {
        const sourceValidatorAddress = msg.value.validatorSrcAddress;
        const destinationValidatorAddress = msg.value.validatorDstAddress;
        const amount = msg.value.amount?.amount;
        const denom = msg.value.amount?.denom;
        return [
          "Redelegate",
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>From: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, sourceValidatorAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={StyleSheet.flatten(fontSemibold14)}>
                {tinyAddress(sourceValidatorAddress, 10)}
              </BrandText>
            </Pressable>
            <BrandText style={brandTextNormalCStyle}>, To: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, destinationValidatorAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={StyleSheet.flatten(fontSemibold14)}>
                {tinyAddress(destinationValidatorAddress, 10)}
              </BrandText>
            </Pressable>
          </View>,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>
              Will redelegate:{" "}
            </BrandText>
            <BrandText style={StyleSheet.flatten(fontSemibold14)}>
              {prettyPrice(network?.id, amount, denom)}
            </BrandText>
          </View>,
          stakingWhiteSVG,
        ];
      }
      case "/cosmwasm.wasm.v1.MsgExecuteContract": {
        const contractAddress = msg.value.contract;
        let method;
        try {
          // TODO: prettify method name
          method = Object.keys(
            JSON.parse(
              Buffer.from(
                Uint8Array.from(Object.values(msg.value.msg))
              ).toString()
            )
          )[0];
        } catch (err) {
          console.error("failed to find method name", err);
          method = "Unknown";
        }
        let icon = multisigWhiteSVG;
        let name = "Execute";
        console.log("olol3", network?.kind, contractAddress, method);
        if (
          network?.kind === NetworkKind.Cosmos &&
          contractAddress === network.nameServiceContractAddress &&
          method === "mint"
        ) {
          icon = tnsWhiteSVG;
          name = "Book name";
        } else if (
          network?.kind === NetworkKind.Cosmos &&
          contractAddress === network.socialFeedContractAddress &&
          method === "create_post"
        ) {
          icon = feedWhiteSVG;
          name = "Post on feed";
        }
        // if(network?.kind === NetworkKind.Cosmos && contractAddress === network.socialFeedContractAddress && method === "post") {
        //   txType = MultisigTransactionType.CREATE_NEW_POST
        // }
        return [
          name,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Contract: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, contractAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={StyleSheet.flatten(fontSemibold14)}>
                {tinyAddress(contractAddress, 10)}
              </BrandText>
            </Pressable>
          </View>,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Method: </BrandText>
            <BrandText style={StyleSheet.flatten(fontSemibold14)}>
              {method}
            </BrandText>
          </View>,
          icon,
        ];
      }
      case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward": {
        const validatorAddress = msg.value.validatorAddress;
        return [
          "Withdraw staking rewards",
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalCStyle}>Validator: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, validatorAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={StyleSheet.flatten(fontSemibold14)}>
                {tinyAddress(validatorAddress, 20)}
              </BrandText>
            </Pressable>
          </View>,
          <BrandText style={brandTextNormalCStyle}> </BrandText>,
          stakingWhiteSVG,
        ];
      }
    }
  } catch (err) {
    console.error(err);
  }
  return [
    "Unknown",
    <BrandText style={brandTextNormalCStyle}>{msg.typeUrl}</BrandText>,
    <BrandText style={brandTextNormalCStyle}> </BrandText>,
    multisigWhiteSVG,
  ];
};

const rowCenterCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const brandTextNormalCStyle: ViewStyle = StyleSheet.flatten([
  fontSemibold14,
  { color: neutral77 },
]);
