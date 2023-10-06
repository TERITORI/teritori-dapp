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
import { SocialMessageContent } from "../../components/socialFeed/SocialThread/SocialMessageContent";
import { SpacerColumn } from "../../components/spacer";
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
): {
  name: string;
  small1: React.ReactElement;
  small2: React.ReactElement;
  icon: React.FC<SvgProps>;
  MessagePreview: React.FC;
} => {
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
    return {
      name: "Sentiment",
      small1: <BrandText style={brandTextNormalStyle}> </BrandText>,
      small2: <BrandText style={brandTextNormalStyle}> </BrandText>,
      icon: multisigWhiteSVG,
      MessagePreview: () => null,
    };
  }
  if (msgs.length > 1) {
    return {
      name: "Complex",
      small1: (
        <BrandText style={brandTextNormalStyle}>
          {msgs.length} actions
        </BrandText>
      ),
      small2: <BrandText style={brandTextNormalStyle}> </BrandText>,
      icon: multisigWhiteSVG,
      MessagePreview: () => null,
    };
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
        return {
          name: "Send",
          small1: (
            <View style={rowCenterCStyle}>
              <BrandText style={brandTextNormalStyle}>Sending to: </BrandText>
              <Username
                userId={getUserId(network?.id, recipientAddress)}
                textStyle={opts.textStyle}
              />
            </View>
          ),
          small2: (
            <View style={rowCenterCStyle}>
              <BrandText style={brandTextNormalStyle}>Will receive: </BrandText>
              <BrandText style={opts.textStyle}>
                {prettyPrice(network?.id, amount, denom)}
              </BrandText>
            </View>
          ),
          icon: walletWhiteSVG,
          MessagePreview: () => {
            return (
              <View>
                <BrandText>
                  Send {prettyPrice(network?.id, amount, denom)} to{" "}
                  <Username userId={getUserId(network?.id, recipientAddress)} />
                </BrandText>
              </View>
            );
          },
        };
      }
      case "/cosmos.staking.v1beta1.MsgDelegate": {
        const validatorAddress = msg.value.validatorAddress;
        const amount = msg.value.amount?.amount;
        const denom = msg.value.amount?.denom;
        return {
          name: "Delegate",
          small1: (
            <View style={rowCenterCStyle}>
              <BrandText style={brandTextNormalStyle}>
                Delegating to:{" "}
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
            </View>
          ),
          small2: (
            <View style={rowCenterCStyle}>
              <BrandText style={brandTextNormalStyle}>
                Will delegate:{" "}
              </BrandText>
              <BrandText style={opts.textStyle}>
                {prettyPrice(network?.id, amount, denom)}
              </BrandText>
            </View>
          ),
          icon: stakingWhiteSVG,
          MessagePreview: () => null,
        };
      }
      case "/cosmos.staking.v1beta1.MsgUndelegate": {
        const validatorAddress = msg.value.validatorAddress;
        const amount = msg.value.amount?.amount;
        const denom = msg.value.amount?.denom;
        return {
          name: "Undelegate",
          small1: (
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
            </View>
          ),
          small2: (
            <View style={rowCenterCStyle}>
              <BrandText style={brandTextNormalStyle}>
                Will undelegate:{" "}
              </BrandText>
              <BrandText style={opts.textStyle}>
                {prettyPrice(network?.id, amount, denom)}
              </BrandText>
            </View>
          ),
          icon: stakingWhiteSVG,
          MessagePreview: () => null,
        };
      }
      case "/cosmos.staking.v1beta1.MsgBeginRedelegate": {
        const sourceValidatorAddress = msg.value.validatorSrcAddress;
        const destinationValidatorAddress = msg.value.validatorDstAddress;
        const amount = msg.value.amount?.amount;
        const denom = msg.value.amount?.denom;
        return {
          name: "Redelegate",
          small1: (
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
                  const id = getUserId(
                    network?.id,
                    destinationValidatorAddress
                  );
                  navigation.navigate("UserPublicProfile", { id });
                }}
              >
                <BrandText style={opts.textStyle}>
                  {tinyAddress(destinationValidatorAddress, 10)}
                </BrandText>
              </Pressable>
            </View>
          ),
          small2: (
            <View style={rowCenterCStyle}>
              <BrandText style={brandTextNormalStyle}>
                Will redelegate:{" "}
              </BrandText>
              <BrandText style={opts.textStyle}>
                {prettyPrice(network?.id, amount, denom)}
              </BrandText>
            </View>
          ),
          icon: stakingWhiteSVG,
          MessagePreview: () => null,
        };
      }
      case "/cosmwasm.wasm.v1.MsgExecuteContract": {
        const contractAddress = msg.value.contract;
        let execMsg: any = {};
        try {
          execMsg = JSON.parse(
            Buffer.from(new Uint8Array(Object.values(msg.value.msg))).toString()
          );
        } catch (err) {
          console.error("olol failed to parse msg", err, msg);
        }
        let method;
        try {
          // TODO: prettify method name
          method = Object.keys(execMsg)[0];
        } catch (err) {
          console.error("failed to find method name", err);
          method = "Unknown";
        }
        let icon = multisigWhiteSVG;
        let name = "Execute";
        let preview: React.FC | undefined;
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
          preview = () => {
            return (
              <View>
                <BrandText>Post on social feed</BrandText>
                <SpacerColumn size={2.5} />
                <SocialMessageContent
                  postCategory={execMsg.create_post.category}
                  metadata={JSON.parse(execMsg.create_post.metadata)}
                  isPreview
                />
              </View>
            );
          };
        }
        if (!preview) {
          preview = () => {
            return (
              <View>
                <BrandText>{JSON.stringify(execMsg, null, 2)}</BrandText>
              </View>
            );
          };
        }
        return {
          name,
          small1: (
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
            </View>
          ),
          small2: (
            <View style={rowCenterCStyle}>
              <BrandText style={brandTextNormalStyle}>Method: </BrandText>
              <BrandText style={opts.textStyle}>{method}</BrandText>
            </View>
          ),
          icon,
          MessagePreview: preview,
        };
      }
      case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward": {
        const validatorAddress = msg.value.validatorAddress;
        return {
          name: "Withdraw staking rewards",
          small1: (
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
            </View>
          ),
          small2: <BrandText style={brandTextNormalStyle}> </BrandText>,
          icon: stakingWhiteSVG,
          MessagePreview: () => null,
        };
      }
    }
  } catch (err) {
    console.error(err);
  }
  return {
    name: "Unknown",
    small1: <BrandText style={brandTextNormalStyle}>{msg.typeUrl}</BrandText>,
    small2: <BrandText style={brandTextNormalStyle}> </BrandText>,
    icon: multisigWhiteSVG,
    MessagePreview: () => null,
  };
};

const rowCenterCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
