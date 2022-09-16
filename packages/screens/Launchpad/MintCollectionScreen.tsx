import { logs } from "@cosmjs/stargate";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

import discordSVG from "../../../assets/icons/discord.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBadge } from "../../components/badges/TertiaryBadge";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SocialButton } from "../../components/buttons/SocialButton";
import { ProgressionCard } from "../../components/cards/ProgressionCard";
import {
  initialToastError,
  useFeedbacks,
} from "../../context/FeedbacksProvider";
import {
  TeritoriNftMinterClient,
  TeritoriNftMinterQueryClient,
} from "../../contracts-clients/teritori-nft-minter/TeritoriNftMinter.client";
import { TeritoriNftQueryClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { prettyPrice } from "../../utils/coins";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { Network } from "../../utils/network";
import {
  neutral33,
  neutral77,
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

const maxImageSize = 532;
const cardsHalfGap = 6;

export const MintCollectionScreen: React.FC<{
  route: RouteProp<RootStackParamList, "MintCollection">;
}> = ({
  route: {
    params: { id },
  },
}) => {
  const wallet = useSelectedWallet();
  const [minted, setMinted] = useState(false);
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
  const mintButtonDisabled =
    minted ||
    !wallet ||
    wallet.network !== Network.Teritori ||
    !wallet.connected;
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
      const sender = wallet?.publicKey;
      if (!sender || !info.unitPrice || !info.priceDenom) {
        console.error("invalid mint args");
        return;
      }
      const cosmwasmClient = await getSigningCosmWasmClient();
      const minterClient = new TeritoriNftMinterClient(
        cosmwasmClient,
        sender,
        mintAddress
      );
      const reply = await minterClient.mint("auto", "", [
        { amount: info.unitPrice, denom: info.priceDenom },
      ]);
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
  }, [wallet?.publicKey, id, info.unitPrice, info.hasPresale]);

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginHorizontal: 40,
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

            {info.isMintable && (
              <PrimaryButton
                size="XL"
                text="Mint now"
                style={{ marginBottom: 24 }}
                width={160}
                disabled={mintButtonDisabled}
                loader
                onPress={mint}
              />
            )}

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
                  {discordLink && (
                    <SocialButton
                      text="Discord"
                      iconSvg={discordSVG}
                      style={{ margin: cardsHalfGap }}
                      onPress={() => Linking.openURL(discordLink)}
                    />
                  )}
                  {websiteLink && (
                    <SocialButton
                      text="Website"
                      iconSvg={websiteSVG}
                      style={{ margin: cardsHalfGap }}
                      onPress={() => Linking.openURL(websiteLink)}
                    />
                  )}
                  {twitterLink && (
                    <SocialButton
                      style={{ margin: cardsHalfGap }}
                      text="Twitter"
                      iconSvg={twitterSVG}
                      onPress={() => Linking.openURL(twitterLink)}
                    />
                  )}
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
                whitelistSize={info.whitelistSize || "0"}
                maxPerAddress={info.whitelistMaxPerAddress || "0"}
              />
            )}
            {info.isInPresalePeriod || (
              <PublicSaleActivity
                running={info.maxSupply !== info.mintedAmount}
              />
            )}
          </View>
        </View>
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
  running: boolean;
  whitelistSize: string;
  maxPerAddress: string;
}> = ({ running, whitelistSize, maxPerAddress }) => {
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
        {running ? (
          <BrandText style={[fontSemibold16, { color: primaryColor }]}>
            IN PROGRESS
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

const PublicSaleActivity: React.FC<{ running: boolean }> = ({ running }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TertiaryBadge label="Public Mint" />
      {running ? (
        <BrandText style={[fontSemibold16, { color: primaryColor }]}>
          IN PROGRESS
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

interface CollectionInfo {
  image?: string;
  description?: string;
  prettyUnitPrice?: string;
  unitPrice?: string;
  priceDenom?: string;
  maxSupply?: string;
  mintedAmount?: string;
  name?: string;
  discord?: string;
  twitter?: string;
  website?: string;
  maxPerAddress?: string;
  hasPresale?: boolean;
  whitelistMaxPerAddress?: string;
  whitelistSize?: string;
  isInPresalePeriod?: boolean;
  isMintable?: boolean;
  publicSaleEnded?: boolean;
}

const useCollectionInfo = (id: string) => {
  const [info, setInfo] = useState<CollectionInfo>({});
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    let canceled = false;
    const effect = async () => {
      setLoading(true);
      try {
        if (!id.startsWith("tori-")) {
          setLoading(false);
          setNotFound(true);
          return;
        }

        const mintAddress = id.startsWith("tori-") ? id.substring(5) : id;

        const cosmwasm = await getNonSigningCosmWasmClient();

        const minterClient = new TeritoriNftMinterQueryClient(
          cosmwasm,
          mintAddress
        );
        const conf = await minterClient.config();

        const nftClient = new TeritoriNftQueryClient(cosmwasm, conf.nft_addr);
        const nftInfo = await nftClient.contractInfo();

        const baseURI = ipfsURLToHTTPURL(conf.nft_base_uri);
        const metadataURI = baseURI + "collection.json";
        const metadataReply = await fetch(metadataURI);
        const metadata = await metadataReply.json();

        const secondsSinceEpoch = Date.now() / 1000;

        const whitelistEnd = conf.mint_start_time + conf.whitelist_mint_period;
        const hasWhitelistPeriod = !!conf.whitelist_mint_period;
        const publicSaleEnded = conf.minted_amount === conf.nft_max_supply;

        const info: CollectionInfo = {
          name: nftInfo.name,
          image: ipfsURLToHTTPURL(metadata.image),
          description: metadata.description,
          prettyUnitPrice: prettyPrice(conf.nft_price_amount, conf.price_denom),
          unitPrice: conf.nft_price_amount,
          priceDenom: conf.price_denom,
          maxSupply: conf.nft_max_supply,
          mintedAmount: conf.minted_amount,
          discord: metadata.discord,
          twitter: metadata.twitter,
          website: metadata.website,
          maxPerAddress: conf.mint_max || undefined,
          whitelistMaxPerAddress: conf.whitelist_mint_max || undefined,
          whitelistSize: conf.whitelisted_size,
          hasPresale: hasWhitelistPeriod,
          publicSaleEnded,
          isMintable: !publicSaleEnded && conf.is_mintable,
          isInPresalePeriod:
            hasWhitelistPeriod &&
            conf.mint_start_time !== 0 &&
            secondsSinceEpoch >= conf.mint_start_time &&
            secondsSinceEpoch < whitelistEnd,
        };

        if (canceled) {
          return;
        }
        setInfo(info);
        setNotFound(false);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setNotFound(true);
        setLoading(false);
      }
    };
    effect();
    return () => {
      canceled = true;
    };
  }, [id]);
  useFocusEffect(refresh);

  return { info, notFound, loading };
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
