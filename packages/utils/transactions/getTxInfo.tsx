// FIXME: handle case where there is bad json in the db

import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import React from "react";
import { View, Pressable, ViewStyle, TextStyle, StyleProp } from "react-native";
import { SvgProps } from "react-native-svg";

import feedWhiteSVG from "../../../assets/icons/feed_white.svg";
import multisigWhiteSVG from "../../../assets/icons/multisig_white.svg";
import stakingWhiteSVG from "../../../assets/icons/staking_white.svg";
import tnsWhiteSVG from "../../../assets/icons/tns-service_white.svg";
import walletWhiteSVG from "../../../assets/icons/wallet_white.svg";
import { BrandText } from "../../components/BrandText";
import { Username } from "../../components/user/Username";
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

// once we gather enough different messages here, we should try to establish meaningful abstractions and split this func

export const getTxInfo = (
  msgs: any[],
  navigation: AppNavigationProp,
  network: NetworkInfo | undefined,
  opts?: { textStyle?: StyleProp<TextStyle> }
): [string, React.ReactElement, React.ReactElement, React.FC<SvgProps>] => {
  if (!opts) {
    opts = {};
  }
  if (!opts.textStyle) {
    opts.textStyle = fontSemibold14;
    opts.textStyle.lineHeight = 14;
  }
  const brandTextNormalStyle: StyleProp<TextStyle> = [
    opts.textStyle,
    { color: neutral77 },
  ];
  if (msgs.length === 0) {
    return [
      "Sentiment",
      <BrandText style={brandTextNormalStyle}> </BrandText>,
      <BrandText style={brandTextNormalStyle}> </BrandText>,
      multisigWhiteSVG,
    ];
  }
  if (msgs.length > 1) {
    return [
      "Complex",
      <BrandText style={brandTextNormalStyle}>
        {msgs.length} messages
      </BrandText>,
      <BrandText style={brandTextNormalStyle}> </BrandText>,
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
            sender: "TODO",
            msg: Buffer.from(msg.wasm.execute.msg, "base64"),
          },
        };
        msg = execMsg;
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
            <BrandText style={brandTextNormalStyle}>Sending to: </BrandText>
            <Username
              userId={getUserId(network?.id, recipientAddress)}
              textStyle={opts.textStyle}
            />
          </View>,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalStyle}>Will receive: </BrandText>
            <BrandText style={opts.textStyle}>
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
            <BrandText style={brandTextNormalStyle}>Delegating to: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, validatorAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={opts.textStyle}>
                {tinyAddress(validatorAddress, 20)}
              </BrandText>
            </Pressable>
          </View>,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalStyle}>Will delegate: </BrandText>
            <BrandText style={opts.textStyle}>
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
            <BrandText style={brandTextNormalStyle}>
              Undelegating from:{" "}
            </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, validatorAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={opts.textStyle}>
                {tinyAddress(validatorAddress, 20)}
              </BrandText>
            </Pressable>
          </View>,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalStyle}>
              Will undelegate:{" "}
            </BrandText>
            <BrandText style={opts.textStyle}>
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
            <BrandText style={brandTextNormalStyle}>From: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, sourceValidatorAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={opts.textStyle}>
                {tinyAddress(sourceValidatorAddress, 10)}
              </BrandText>
            </Pressable>
            <BrandText style={brandTextNormalStyle}>, To: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, destinationValidatorAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={opts.textStyle}>
                {tinyAddress(destinationValidatorAddress, 10)}
              </BrandText>
            </Pressable>
          </View>,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalStyle}>
              Will redelegate:{" "}
            </BrandText>
            <BrandText style={opts.textStyle}>
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
        return [
          name,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalStyle}>Contract: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, contractAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={opts.textStyle}>
                {tinyAddress(contractAddress, 10)}
              </BrandText>
            </Pressable>
          </View>,
          <View style={rowCenterCStyle}>
            <BrandText style={brandTextNormalStyle}>Method: </BrandText>
            <BrandText style={opts.textStyle}>{method}</BrandText>
          </View>,
          icon,
        ];
      }
      case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward": {
        const validatorAddress = msg.value.validatorAddress;
        return [
          "Withdraw staking rewards",
          <View style={rowCenterCStyle}>
            <BrandText style={opts.textStyle}>Validator: </BrandText>
            <Pressable
              onPress={() => {
                // TODO: show tns info using reusable component
                const id = getUserId(network?.id, validatorAddress);
                navigation.navigate("UserPublicProfile", { id });
              }}
            >
              <BrandText style={opts.textStyle}>
                {tinyAddress(validatorAddress, 20)}
              </BrandText>
            </Pressable>
          </View>,
          <BrandText style={brandTextNormalStyle}> </BrandText>,
          stakingWhiteSVG,
        ];
      }
    }
  } catch (err) {
    console.error(err);
  }
  return [
    "Unknown",
    <BrandText style={brandTextNormalStyle}>{msg.typeUrl}</BrandText>,
    <BrandText style={brandTextNormalStyle}> </BrandText>,
    multisigWhiteSVG,
  ];
};

const rowCenterCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
