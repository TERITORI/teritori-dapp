import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import Long from "long";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
  TextInput,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import CountDown from "react-native-countdown-component";

import balanceSVG from "../../../assets/icons/balance.svg";
import minusSVG from "../../../assets/icons/minus.svg";
import plusSVG from "../../../assets/icons/plus.svg";
import sigmaSVG from "../../../assets/icons/sigma.svg";
import { BrandText } from "../../components/BrandText";
import { ExternalLink } from "../../components/ExternalLink";
import FlexRow from "../../components/FlexRow";
import { OptimizedImage } from "../../components/OptimizedImage";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBadge } from "../../components/badges/TertiaryBadge";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { ProgressionCard } from "../../components/cards/ProgressionCard";
import { CollectionSocialButtons } from "../../components/collections/CollectionSocialButtons";
import { GradientText } from "../../components/gradientText";
import { SpacerRow } from "../../components/spacer";
import {
  initialToastError,
  useFeedbacks,
} from "../../context/FeedbacksProvider";
import { Wallet } from "../../context/WalletsProvider";
import { TeritoriMinter__factory } from "../../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { useBalances } from "../../hooks/useBalances";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  NetworkKind,
  CosmosNetworkInfo,
  EthereumNetworkInfo,
  getCosmosNetwork,
  getCurrency,
  getKeplrSigningCosmWasmClient,
  getNativeCurrency,
  parseNetworkObjectId,
  getEthereumNetwork,
} from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { MintPhase } from "../../utils/collection";
import { getMetaMaskEthereumSigner } from "../../utils/ethereum";
import { ScreenFC } from "../../utils/navigation";
import {
  neutral17,
  neutral30,
  neutral33,
  neutral67,
  neutral77,
  neutral22,
  neutralA3,
  pinkDefault,
  primaryColor,
  yellowDefault,
  secondaryColor,
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

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const MintCollectionScreen: ScreenFC<"MintCollection"> = ({
  route: {
    params: { id },
  },
}) => {
  const { width: currentWidth } = useWindowDimensions();

  const wallet = useSelectedWallet();
  const [minted, setMinted] = useState(false);
  const [isDepositVisible, setDepositVisible] = useState(false);
  const {
    collectionInfo: info,
    notFound,
    refetch: refetchCollectionInfo,
  } = useCollectionInfo(id);
  const { setToastError } = useFeedbacks();
  const [viewWidth, setViewWidth] = useState(0);
  const [network, mintAddress] = parseNetworkObjectId(id);
  const balances = useBalances(network?.id, wallet?.address);
  const balance = balances.find((bal) => bal.denom === info?.priceDenom);

  const [totalBulkMint, setTotalBulkMint] = useState(1);

  const imageSize = viewWidth < maxImageSize ? viewWidth : maxImageSize;
  const mintButtonDisabled = minted || !wallet?.connected;

  const updateTotalBulkMint = (newTotalBulkMint: number | string) => {
    const numOnlyRegexp = new RegExp(/^\d+$/);
    if (!numOnlyRegexp.test("" + newTotalBulkMint)) {
      return;
    }

    const MAX_BULK = 99;

    let totalBulkMint = +newTotalBulkMint;
    if (+newTotalBulkMint < 1) {
      totalBulkMint = 1;
    } else if (info?.maxPerAddress && +newTotalBulkMint > +info.maxPerAddress) {
      totalBulkMint = +info.maxPerAddress;
    } else if (totalBulkMint > MAX_BULK) {
      totalBulkMint = MAX_BULK;
    }

    setTotalBulkMint(totalBulkMint);
  };

  const prettyError = (err: any) => {
    const msg = err?.message;
    if (typeof msg !== "string") {
      return `${err}`;
    }
    if (
      msg.includes("Already minted maximum for whitelist period") ||
      msg.includes("EXCEED_WHITELIST_MINT_MAX")
    ) {
      return "You already minted the maximum allowed per address during presale";
    }
    if (
      msg.includes("Already minted maximum") ||
      msg.includes("EXCEED_MINT_MAX")
    ) {
      return "You already minted the maximum allowed per address";
    }
    if (msg.includes("Not whitelisted!") || msg.includes("NOT_WHITELISTED")) {
      return "You are not in the presale whitelist";
    }
    return msg;
  };

  const ethereumMint = useCallback(
    async (network: EthereumNetworkInfo, wallet: Wallet) => {
      const signer = await getMetaMaskEthereumSigner(network, wallet.address);
      if (!signer) {
        throw Error("no account connected");
      }

      const minterClient = TeritoriMinter__factory.connect(mintAddress, signer);
      const userState = await minterClient.callStatic.userState(wallet.address);

      // TODO: check this properly later
      // if (!userState.userCanMint) {
      //   throw Error("You cannot mint now");
      // }

      const address = await signer.getAddress();

      const { maxFeePerGas, maxPriorityFeePerGas } = await signer.getFeeData();

      const estimatedGasLimit = await minterClient.estimateGas.requestMint(
        address,
        totalBulkMint,
        {
          value: userState.mintPrice.mul(totalBulkMint),
        }
      );

      const tx = await minterClient.requestMint(address, totalBulkMint, {
        value: userState.mintPrice.mul(totalBulkMint),
        maxFeePerGas: maxFeePerGas?.toNumber(),
        maxPriorityFeePerGas: maxPriorityFeePerGas?.toNumber(),
        gasLimit: estimatedGasLimit.mul(150).div(100),
      });
      await tx.wait();
    },
    [mintAddress, totalBulkMint]
  );

  const cosmosMint = useCallback(
    async (network: CosmosNetworkInfo, wallet: Wallet) => {
      const sender = wallet.address;
      if (!sender || !info?.unitPrice || !info.priceDenom) {
        throw Error("invalid mint args");
      }
      const cosmwasmClient = await getKeplrSigningCosmWasmClient(network.id);

      const msgs: EncodeObject[] = [];

      for (let i = 0; i < totalBulkMint; i++) {
        let funds;
        if (info.unitPrice !== "0") {
          funds = [{ amount: info.unitPrice, denom: info.priceDenom }];
        }

        const msg = {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: {
            sender,
            msg: toUtf8(
              JSON.stringify({
                request_mint: {
                  addr: sender,
                },
              })
            ),
            contract: mintAddress,
            funds,
          },
        };

        msgs.push(msg);
      }

      const tx = await cosmwasmClient.signAndBroadcast(sender, msgs, "auto");

      if (isDeliverTxFailure(tx)) {
        throw Error(tx.transactionHash);
      }
    },
    [info?.priceDenom, info?.unitPrice, mintAddress, totalBulkMint]
  );

  const mint = useCallback(async () => {
    try {
      setToastError(initialToastError);
      if (!wallet) {
        setToastError({
          title: "Error",
          message: `no wallet`,
        });
        return;
      }
      switch (network?.kind) {
        case NetworkKind.Cosmos:
          await cosmosMint(network, wallet);
          break;
        case NetworkKind.Ethereum:
          await ethereumMint(network, wallet);
          break;
        default:
          setToastError({
            title: "Error",
            message: `unsupported network ${network?.id}`,
          });
          return;
      }

      setMinted(true);
      await sleep(5000);
      setMinted(false);
    } catch (e) {
      if (e instanceof Error) {
        return setToastError({
          title: "Mint failed",
          message: prettyError(e),
        });
      }
      console.error(e);
    }
  }, [cosmosMint, ethereumMint, network, setToastError, wallet]);

  const mintTermsConditionsURL = useMemo(() => {
    switch (mintAddress) {
      case getCosmosNetwork(network?.id)?.riotContractAddressGen0:
        return "https://teritori.notion.site/The-R-ot-Terms-Conditions-0ea730897c964b04ab563e0648cc2f5b";
      case getEthereumNetwork(network?.id)?.riotContractAddress:
        return "https://teritori.notion.site/The-Riot-Terms-Conditions-ETH-92328fb2d4494b6fb073b38929b28883";
      default:
        return null;
    }
  }, [mintAddress, network?.id]);

  if (!info) {
    return <ScreenContainer noMargin />;
  }

  const {
    discord: discordLink,
    twitter: twitterLink,
    website: websiteLink,
  } = info;
  const hasLinks = discordLink || twitterLink || websiteLink;

  const priceCurrency = getCurrency(network?.id, info.priceDenom);
  const priceNativeCurrency = getNativeCurrency(network?.id, info.priceDenom);

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
      <ScreenContainer noMargin fullWidth forceNetworkId={network?.id}>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 72,
              width: "100%",
            }}
            onLayout={(event) => setViewWidth(event.nativeEvent.layout.width)}
          >
            {/* ===== Left container */}
            <View
              style={{
                justifyContent: "flex-start",
                width: "100%",
                maxWidth: 534,
                margin: layout.spacing_x2,
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

              <GradientText
                gradientType="grayLight"
                style={[
                  fontSemibold14,
                  {
                    marginBottom: layout.spacing_x3,
                  },
                ]}
              >
                {info.description}
              </GradientText>

              <ProgressionCard
                label="Tokens Minted"
                valueCurrent={
                  info.mintedAmount ? parseInt(info.mintedAmount, 10) : 0
                }
                valueMax={info.maxSupply ? parseInt(info.maxSupply, 10) : 0}
                style={{
                  marginBottom: layout.spacing_x3,
                }}
              />

              <TertiaryBox noBrokenCorners fullWidth>
                {/* Upper section */}
                <FlexRow
                  style={{
                    backgroundColor: neutral17,
                    borderBottomWidth: 1,
                    borderBottomColor: neutral33,
                    width: "100%",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                  breakpoint={650}
                >
                  {/* Left block */}
                  <View
                    style={{
                      padding: layout.spacing_x2,
                      borderRightColor: neutral33,
                      borderRightWidth: currentWidth >= 650 ? 1 : 0,
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <SVG
                      style={{
                        backgroundColor: neutral22,
                        padding: layout.spacing_x1_5,
                        borderRadius: 8,
                      }}
                      source={sigmaSVG}
                      color={secondaryColor}
                    />

                    <SpacerRow size={2} />

                    <View style={{ justifyContent: "center" }}>
                      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                        Total price:
                      </BrandText>
                      <BrandText style={fontSemibold16}>
                        {info.isMintable
                          ? prettyPrice(
                              network?.id,
                              +(info?.unitPrice || "0") * totalBulkMint + "",
                              info?.priceDenom || ""
                            )
                          : "0"}
                      </BrandText>
                    </View>
                  </View>

                  {/* Right block */}
                  <View
                    style={{
                      flexDirection: "row",
                      padding: layout.spacing_x2,
                      flex: 1,
                    }}
                  >
                    <SVG
                      style={{
                        backgroundColor: neutral22,
                        padding: layout.spacing_x1_5,
                        borderRadius: 8,
                      }}
                      source={balanceSVG}
                      color={secondaryColor}
                    />

                    <SpacerRow size={2} />

                    <View style={{ justifyContent: "center" }}>
                      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                        Available balance:
                      </BrandText>
                      <BrandText style={fontSemibold16}>
                        {prettyPrice(
                          network?.id || "",
                          balance?.amount || "0",
                          balance?.denom || ""
                        )}
                      </BrandText>
                    </View>
                  </View>
                </FlexRow>

                <FlexRow
                  style={{
                    width: "100%",
                    paddingHorizontal: layout.spacing_x2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  breakpoint={700}
                >
                  {info.isMintable && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: layout.spacing_x2,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => updateTotalBulkMint(totalBulkMint - 1)}
                        style={{
                          borderRadius: 40,
                          backgroundColor: neutral30,
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SVG source={minusSVG} color={primaryColor} />
                      </TouchableOpacity>
                      <SpacerRow size={2} />
                      <TextInput
                        value={"" + totalBulkMint}
                        onChangeText={(val) => updateTotalBulkMint(+val)}
                        style={[
                          {
                            color: secondaryColor,
                            width: 20,
                            textAlign: "center",
                          },
                          fontSemibold14,
                        ]}
                      />
                      <SpacerRow size={2} />
                      <TouchableOpacity
                        onPress={() => updateTotalBulkMint(totalBulkMint + 1)}
                        style={{
                          borderRadius: 40,
                          backgroundColor: neutral30,
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SVG source={plusSVG} color={primaryColor} />
                      </TouchableOpacity>
                    </View>
                  )}

                  {currentWidth >= 700 && (
                    <View
                      style={{
                        borderRightWidth: 1,
                        borderRightColor: neutral33,
                        height: layout.spacing_x4,
                      }}
                    />
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      marginVertical: layout.spacing_x2,
                    }}
                  >
                    {priceCurrency?.kind === "ibc" && (
                      <SecondaryButton
                        size="XL"
                        text={`Deposit ${
                          priceNativeCurrency?.displayName ||
                          priceCurrency.denom
                        }`}
                        width={150}
                        disabled={mintButtonDisabled}
                        loader
                        onPress={() => setDepositVisible(true)}
                      />
                    )}

                    <SpacerRow size={2} />

                    {info.isMintable && (
                      <PrimaryButton
                        size="XL"
                        text="Mint"
                        width={priceCurrency?.kind === "ibc" ? 100 : 200}
                        disabled={
                          mintButtonDisabled ||
                          parseInt(balance?.amount || "0", 10) <
                            parseInt(info.unitPrice || "0", 10)
                        }
                        loader
                        onPress={mint}
                      />
                    )}
                  </View>
                </FlexRow>
              </TertiaryBox>

              {mintTermsConditionsURL && (
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: layout.spacing_x0_5,
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold14,
                      {
                        color: neutralA3,
                        textDecorationLine: "none",
                      },
                    ]}
                  >
                    {'By clicking "Mint", you agree to the '}
                  </BrandText>
                  <ExternalLink
                    gradientType="gray"
                    externalUrl={mintTermsConditionsURL}
                    style={[
                      fontSemibold14,
                      {
                        color: neutral67,
                        textDecorationLine: "none",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    Sale Terms & Conditions
                  </ExternalLink>
                </View>
              )}

              {hasLinks && (
                <View
                  style={{
                    marginTop: layout.spacing_x2_5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                      margin: -cardsHalfGap,
                    }}
                  >
                    <CollectionSocialButtons
                      collectionInfo={info}
                      hideMintButton
                    />
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
                margin: layout.spacing_x2,
              }}
            >
              <TertiaryBox style={{ marginBottom: 40 }}>
                {info.image ? (
                  <OptimizedImage
                    sourceURI={info.image}
                    width={imageSize}
                    height={imageSize}
                    style={{
                      width: imageSize,
                      height: imageSize,
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: imageSize,
                      height: imageSize,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator size="large" style={{ margin: 40 }} />
                  </View>
                )}
              </TertiaryBox>

              <BrandText style={[fontSemibold20, { marginBottom: 24 }]}>
                Activity
              </BrandText>
              {info.mintStarted ? (
                <>
                  {info.mintPhases.map((phase, index) => {
                    return <PresaleActivy key={index} info={phase} />;
                  })}
                  <PublicSaleActivity
                    started={!info.isInPresalePeriod}
                    ended={!!info.publicSaleEnded}
                    running={info.maxSupply !== info.mintedAmount}
                    startsAt={info.publicSaleStartTime}
                    onCountdownEnd={refetchCollectionInfo}
                  />
                </>
              ) : (
                <MintNotStartedActivity />
              )}
            </View>
          </View>
        </View>
        <DepositWithdrawModal
          variation="deposit"
          networkId={network?.id || ""}
          targetCurrency={info.priceDenom}
          onClose={() => setDepositVisible(false)}
          isVisible={isDepositVisible}
        />
        {minted && (
          <ConfettiCannon count={200} origin={{ x: -400, y: 0 }} fadeOut />
        )}
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
  info: MintPhase;
}> = ({ info }) => {
  const now = Long.fromNumber(Date.now() / 1000);
  const running = info.start.lessThanOrEqual(now) && info.end.greaterThan(now);
  const incoming = info.start.greaterThan(now);
  const maxPerAddress = info.mintMax.toString();
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
        ) : incoming ? (
          <PhaseCountdown startsAt={info.start.toNumber()} />
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
          <BrandText style={fontSemibold16}>{info.size.toString()}</BrandText>

          <View
            style={{
              borderRadius: 999,
              width: 2,
              height: 2,
              marginHorizontal: 12,
              backgroundColor: neutral77,
            }}
          />

          {maxPerAddress && maxPerAddress !== "0" ? (
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

const PhaseCountdown: React.FC<{
  onCountdownEnd?: () => void;
  startsAt?: number;
}> = ({ onCountdownEnd, startsAt }) => {
  const now = Date.now() / 1000;
  return (
    <BrandText style={[fontSemibold16, { color: pinkDefault }]}>
      STARTS IN
      {/** @ts-ignore */}
      <CountDown
        until={(startsAt || now) - now}
        onFinish={onCountdownEnd}
        size={8}
        style={{ marginLeft: layout.spacing_x1 }}
        digitTxtStyle={countDownTxtStyleStarts}
        separatorStyle={countDownTxtStyleStarts}
        digitStyle={{ backgroundColor: "none" }}
        showSeparator
        timeLabels={{ d: "", h: "", m: "", s: "" }}
      />
    </BrandText>
  );
};

const PublicSaleActivity: React.FC<{
  started?: boolean;
  startsAt?: number;
  ended: boolean;
  running?: boolean;
  onCountdownEnd?: () => void;
}> = ({ started, running, ended, startsAt, onCountdownEnd }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TertiaryBadge label="Public Mint" />
      {!started && !ended ? (
        <PhaseCountdown onCountdownEnd={onCountdownEnd} startsAt={startsAt} />
      ) : running ? (
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

const MintNotStartedActivity: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TertiaryBadge label="Mint not started" />
    </View>
  );
};
