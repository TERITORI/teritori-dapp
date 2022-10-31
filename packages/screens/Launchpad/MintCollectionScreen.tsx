import { logs } from "@cosmjs/stargate";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import CountDown from "react-native-countdown-component";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBadge } from "../../components/badges/TertiaryBadge";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { ProgressionCard } from "../../components/cards/ProgressionCard";
import { CollectionSocialButtons } from "../../components/collections/CollectionSocialButtons";
import {
  initialToastError,
  useFeedbacks,
} from "../../context/FeedbacksProvider";
import { TeritoriBunkerMinterClient } from "../../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getCurrency, getNetwork } from "../../networks";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import {
  neutral33,
  neutral77,
  pinkDefault,
  primaryColor,
  yellowDefault,
} from "../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold12,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { DepositWithdrawModal } from "../WalletManager/components/DepositWithdrawModal";

const maxImageSize = 532;
const cardsHalfGap = 6;

const countDownTxtStyleStarts: StyleProp<TextStyle> = {
  fontSize: 16,
  letterSpacing: 0,
  lineHeight: 20,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
  color: pinkDefault,
};
const countDownTxtStyleProgress: StyleProp<TextStyle> = {
  fontSize: 16,
  letterSpacing: 0,
  lineHeight: 20,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
  color: primaryColor,
};

export const MintCollectionScreen: ScreenFC<"MintCollection"> = ({
  route: {
    params: { id },
  },
}) => {
  const mintAddress = id.startsWith("tori-") ? id.substring(5) : id;
  const wallet = useSelectedWallet();
  const [minted, setMinted] = useState(false);
  const [isDepositVisible, setDepositVisible] = useState(false);
  const selectedNetwork = useSelectedNetworkId();
  const { info, notFound, loading } = useCollectionInfo(id);
  const { setToastError } = useFeedbacks();
  const { navigate } = useAppNavigation();
  const [viewWidth, setViewWidth] = useState(0);
  const { setLoadingFullScreen } = useFeedbacks();

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loading);
  }, [loading]);

  const imageSize = viewWidth < maxImageSize ? viewWidth : maxImageSize;
  const mintButtonDisabled = minted || !wallet?.connected;
  const {
    discord: discordLink,
    twitter: twitterLink,
    website: websiteLink,
  } = info;
  const hasLinks = discordLink || twitterLink || websiteLink;

  const mint = useCallback(async () => {
    try {
      const mintAddress = id.startsWith("tori-") ? id.substring(5) : id;

      setToastError(initialToastError);
      const sender = wallet?.address;
      if (!sender || !info.unitPrice || !info.priceDenom) {
        console.error("invalid mint args");
        return;
      }
      const cosmwasmClient = await getSigningCosmWasmClient();
      const minterClient = new TeritoriBunkerMinterClient(
        cosmwasmClient,
        sender,
        mintAddress
      );
      const reply = await minterClient.requestMint(
        { addr: sender },
        "auto",
        "",
        [{ amount: info.unitPrice, denom: info.priceDenom }]
      );
      setMinted(true);
      const tokenId = firstTokenId(reply.logs);
      setTimeout(() => {
        if (tokenId) {
          navigate("NFTDetail", { id: `${id}-${tokenId}` });
        } else {
          navigate("MyCollection");
        }
        setMinted(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setToastError({
        title: "Mint failed",
        message: prettyError(err),
      });
    }
  }, [wallet?.address, mintAddress, info.unitPrice, info.hasPresale]);

  if (notFound) {
    return (
      <ScreenContainer noMargin>
        <View style={{ alignItems: "center", width: "100%", marginTop: 40 }}>
          <BrandText>Collection not found</BrandText>
        </View>
      </ScreenContainer>
    );
  } else
    return (
      <ScreenContainer noMargin>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 72,
            }}
            onLayout={(event) => setViewWidth(event.nativeEvent.layout.width)}
          >
            {/* ===== Left container */}
            <View
              style={{
                justifyContent: "flex-start",
                width: "100%",
                maxWidth: 534,
              }}
            >
              <BrandText style={{ marginBottom: 12 }}>{info.name}</BrandText>

              <View style={{ marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    margin: -cardsHalfGap,
                  }}
                >
                  <AttributesCard
                    label="Supply"
                    value={info.maxSupply || ""}
                    style={{ margin: cardsHalfGap }}
                  />
                  <AttributesCard
                    label="Price"
                    value={info.prettyUnitPrice || ""}
                    style={{ margin: cardsHalfGap }}
                  />
                  <AttributesCard
                    label="Limit Buy"
                    value={
                      info.maxPerAddress
                        ? `${info.maxPerAddress} by address`
                        : "Unlimited"
                    }
                    style={{ margin: cardsHalfGap }}
                  />
                </View>
              </View>

              {/*TODO: Gradient white text (see figma)*/}
              <BrandText
                style={[fontSemibold14, { marginBottom: 24, marginRight: 24 }]}
              >
                {info.description}
              </BrandText>

              <ProgressionCard
                label="Tokens Minted"
                valueCurrent={
                  info.mintedAmount ? parseInt(info.mintedAmount, 10) : 0
                }
                valueMax={info.maxSupply ? parseInt(info.maxSupply, 10) : 0}
                style={{
                  marginBottom: 24,
                  maxWidth: 420,
                }}
              />

              <View style={{ flexDirection: "row", marginBottom: 24 }}>
                {info.isMintable && (
                  <PrimaryButton
                    size="XL"
                    text="Mint now"
                    touchableStyle={{ marginRight: 36 }}
                    width={160}
                    disabled={mintButtonDisabled}
                    loader
                    onPress={mint}
                  />
                )}

                {getCurrency(process.env.TERITORI_NETWORK_ID, info.priceDenom)
                  ?.kind === "ibc" && (
                  <PrimaryButton
                    size="XL"
                    text="Deposit Atom"
                    width={160}
                    disabled={mintButtonDisabled}
                    loader
                    onPress={() => setDepositVisible(true)}
                  />
                )}
              </View>

              {hasLinks && (
                <View style={{ marginBottom: 24 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                      margin: -cardsHalfGap,
                    }}
                  >
                    <CollectionSocialButtons collectionInfo={info} />
                  </View>
                </View>
              )}
            </View>

            {/* ===== Right container */}
            <View
              style={{
                justifyContent: "flex-start",
                width: "100%",
                maxWidth: 534,
                maxHeight: 806,
                paddingBottom: 72,
              }}
            >
              <TertiaryBox style={{ marginBottom: 40 }}>
                {info.image ? (
                  <Image
                    source={{ uri: info.image }}
                    style={{
                      width: imageSize,
                      height: imageSize,
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <ActivityIndicator size="large" style={{ margin: 40 }} />
                )}
              </TertiaryBox>

              <BrandText style={[fontSemibold20, { marginBottom: 24 }]}>
                Activity
              </BrandText>
              {info.hasPresale && (
                <PresaleActivy
                  running={info.isInPresalePeriod || false}
                  whitelistSize={info.whitelistSize || 0}
                  maxPerAddress={info.whitelistMaxPerAddress || "0"}
                  started
                />
              )}
              {info.isInPresalePeriod || (
                <PublicSaleActivity
                  running={info.maxSupply !== info.mintedAmount}
                />
              )}
            </View>
          </View>
        </View>

        <DepositWithdrawModal
          variation="deposit"
          networkId={process.env.TERITORI_NETWORK_ID || ""}
          targetCurrency={info.priceDenom}
          onClose={() => setDepositVisible(false)}
          isVisible={isDepositVisible}
        />

        {minted && <ConfettiCannon count={200} origin={{ x: -200, y: 0 }} />}
      </ScreenContainer>
    );
};

const AttributesCard: React.FC<{
  style?: StyleProp<ViewStyle>;
  label: string;
  value: string;
}> = ({ style, label, value }) => {
  return (
    <TertiaryBox
      style={style}
      width={132}
      height={62}
      mainContainerStyle={{
        alignItems: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 14,
      }}
    >
      <BrandText
        style={[fontSemibold12, { color: neutral77, marginBottom: 6 }]}
      >
        {label}
      </BrandText>
      <BrandText style={fontMedium14}>{value}</BrandText>
    </TertiaryBox>
  );
};

const PresaleActivy: React.FC<{
  running?: boolean;
  started?: boolean;
  whitelistSize: number;
  maxPerAddress: string;
}> = ({ started, running, whitelistSize, maxPerAddress }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TertiaryBadge label="Presale" />
        {!started ? (
          <BrandText style={[fontSemibold16, { color: pinkDefault }]}>
            STARTS IN
            <CountDown
              until={3600}
              onFinish={() => console.log("Presale started")}
              size={8}
              style={{ marginLeft: layout.padding_x1 }}
              digitTxtStyle={countDownTxtStyleStarts}
              separatorStyle={countDownTxtStyleStarts}
              digitStyle={{ backgroundColor: "none" }}
              showSeparator
              timeLabels={{ d: "", h: "", m: "", s: "" }}
            />
          </BrandText>
        ) : running ? (
          <BrandText style={[fontSemibold16, { color: primaryColor }]}>
            IN PROGRESS, ENDS IN
            <CountDown
              until={3600}
              onFinish={() => console.log("Presale ended")}
              size={8}
              style={{ marginLeft: layout.padding_x1 }}
              digitTxtStyle={countDownTxtStyleProgress}
              separatorStyle={countDownTxtStyleProgress}
              digitStyle={{ backgroundColor: "none" }}
              showSeparator
              timeLabels={{ d: "", h: "", m: "", s: "" }}
            />
          </BrandText>
        ) : (
          <BrandText style={[fontSemibold16, { color: yellowDefault }]}>
            ENDED
          </BrandText>
        )}
      </View>

      <View
        style={[
          {
            marginBottom: 24,
          },
          !running && {
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 16,
          }}
        >
          <BrandText
            style={[fontSemibold16, { color: neutral77, marginRight: 5 }]}
          >
            Whitelist
          </BrandText>
          <BrandText style={fontSemibold16}>{whitelistSize}</BrandText>

          <View
            style={{
              borderRadius: 999,
              width: 2,
              height: 2,
              marginHorizontal: 12,
              backgroundColor: neutral77,
            }}
          />

          {maxPerAddress ? (
            <>
              <BrandText
                style={[fontSemibold16, { color: neutral77, marginRight: 5 }]}
              >
                Max
              </BrandText>
              <BrandText style={fontSemibold16}>{maxPerAddress}</BrandText>
              <BrandText
                style={[fontSemibold16, { color: neutral77, marginLeft: 5 }]}
              >
                Token
              </BrandText>
            </>
          ) : (
            <BrandText
              style={[fontSemibold16, { color: neutral77, marginRight: 5 }]}
            >
              Unlimited
            </BrandText>
          )}
        </View>
      </View>
    </View>
  );
};

const PublicSaleActivity: React.FC<{
  started?: boolean;
  running?: boolean;
}> = ({ started, running }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TertiaryBadge label="Public Mint" />
      {!started ? (
        <BrandText style={[fontSemibold16, { color: pinkDefault }]}>
          STARTS IN
          <CountDown
            until={3600}
            onFinish={() => console.log("Public mint started")}
            size={8}
            style={{ marginLeft: layout.padding_x1 }}
            digitTxtStyle={countDownTxtStyleStarts}
            separatorStyle={countDownTxtStyleStarts}
            digitStyle={{ backgroundColor: "none" }}
            showSeparator
            timeLabels={{ d: "", h: "", m: "", s: "" }}
          />
        </BrandText>
      ) : running ? (
        <BrandText style={[fontSemibold16, { color: primaryColor }]}>
          IN PROGRESS, ENDS IN
          <CountDown
            until={3600}
            onFinish={() => console.log("Presale ended")}
            size={8}
            style={{ marginLeft: layout.padding_x1 }}
            digitTxtStyle={countDownTxtStyleProgress}
            separatorStyle={countDownTxtStyleProgress}
            digitStyle={{ backgroundColor: "none" }}
            showSeparator
            timeLabels={{ d: "", h: "", m: "", s: "" }}
          />
        </BrandText>
      ) : (
        <BrandText style={[fontSemibold16, { color: yellowDefault }]}>
          ENDED
        </BrandText>
      )}
    </View>
  );
};

const prettyError = (err: any) => {
  const msg = err?.message;
  if (typeof msg !== "string") {
    return `${err}`;
  }
  if (msg.includes("Already minted maximum for whitelist period")) {
    return "You already minted the maximum allowed per address during presale";
  }
  if (msg.includes("Already minted maximum")) {
    return "You already minted the maximum allowed per address";
  }
  if (msg.includes("Not whitelisted!")) {
    return "You are not in the presale whitelist";
  }
  return msg;
};

const firstTokenId = (logs: readonly logs.Log[]) => {
  for (const logEntry of logs) {
    for (const event of logEntry.events) {
      if (event.type === "wasm") {
        for (const attr of event.attributes) {
          if (attr.key === "token_id") {
            return attr.value;
          }
        }
      }
    }
  }
};
