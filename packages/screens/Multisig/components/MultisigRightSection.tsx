import { Decimal } from "@cosmjs/math";
import { useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { View, ViewStyle } from "react-native";

import { Coin } from "../../../api/teritori-chain/cosmos/base/v1beta1/coin";
import { MsgBurnTokens } from "../../../api/teritori-chain/teritori/mint/v1beta1/tx";
import { BrandText } from "../../../components/BrandText";
import { MaxButton } from "../../../components/buttons/MaxButton";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SendModal } from "../../../components/modals/SendModal";
import { TNSNameFinderModal } from "../../../components/modals/teritoriNameService/TNSNameFinderModal";
import { LoginButton } from "../../../components/multisig/LoginButton";
import { SpacerColumn } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useMultisigAuthToken } from "../../../hooks/multisig/useMultisigAuthToken";
import { useMultisigClient } from "../../../hooks/multisig/useMultisigClient";
import {
  multisigInfoQueryKey,
  useMultisigInfo,
} from "../../../hooks/multisig/useMultisigInfo";
import { multisigTransactionsQueryKey } from "../../../hooks/multisig/useMultisigTransactions";
import { userMultisigsQueryKey } from "../../../hooks/multisig/useUserMultisigs";
import { useBalances } from "../../../hooks/useBalances";
import { useRunOrProposeTransaction } from "../../../hooks/useRunOrProposeTransaction";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  NetworkFeature,
  UserKind,
  getCosmosNetworkByChainId,
  getNativeCurrency,
  getStakingCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
  parseUserId,
  getNonSigningStargateClient,
  getUserId,
} from "../../../networks";
import { AppRouteType, useAppNavigation } from "../../../utils/navigation";
import {
  neutral33,
  neutral55,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { TNSMintNameModal } from "../../TeritoriNameService/TNSMintNameScreen";
import { TNSRegisterScreen } from "../../TeritoriNameService/TNSRegisterScreen";

export const MultisigRightSection: React.FC = () => {
  const navigation = useAppNavigation();
  const [visibleRegisterForm, setVisibleRegisterForm] =
    useState<boolean>(false);
  const [visibleMintForm, setVisibleMintForm] = useState<boolean>(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const {
    params: { id },
  } = useRoute<AppRouteType<"MultisigWalletDashboard">>();
  const [network] = parseUserId(id);
  const stakingCurrency = getStakingCurrency(network?.id);
  const { multisig, isInitialLoading } = useMultisigInfo(id);
  const [joinMultisigModalVisible, setJoinMultisigModalVisible] =
    useState(false);
  const selectedWallet = useSelectedWallet();
  const authToken = useMultisigAuthToken(selectedWallet?.userId);
  const multisigClient = useMultisigClient(network?.id);
  const { wrapWithFeedback } = useFeedbacks();
  const queryClient = useQueryClient();

  const [modalNameFinderVisible, setModalNameFinderVisible] = useState(false);
  const [burnModalVisible, setBurnModalVisible] = useState(false);

  const handleRegisterTnsModalClose = (modalName?: string) => {
    setVisibleRegisterForm(false);
    if (modalName === "TNSMintName") {
      setVisibleMintForm(true);
    }
  };
  const handleMintTnsModalClose = (modalName?: string) => {
    setVisibleMintForm(false);
    navigation.reset({
      index: 1,
      routes: [{ name: "Multisig" }],
    });
  };

  if (isInitialLoading) {
    return null;
  }

  const actions: React.ReactElement[] = [];

  if (!authToken) {
    actions.push(<LoginButton userId={selectedWallet?.userId} />);
  } else {
    if (multisig) {
      if (!multisig.joined) {
        actions.push(
          <>
            <PrimaryButton
              size="M"
              text="Join this multisig"
              loader
              fullWidth
              onPress={() => setJoinMultisigModalVisible(true)}
            />
            <JoinMultisigModal
              visible={joinMultisigModalVisible}
              onClose={() => setJoinMultisigModalVisible(false)}
              multisigId={id}
              userId={selectedWallet?.userId}
            />
          </>,
        );
      }

      actions.push(
        <>
          <PrimaryButton
            size="M"
            text="Send"
            fullWidth
            onPress={() => setShowSendModal(true)}
          />
          {!!network && (
            <SendModal
              isVisible={showSendModal}
              userId={id}
              userKind={UserKind.Multisig}
              onClose={() => setShowSendModal(false)}
              nativeCurrency={getStakingCurrency(network.id)}
            />
          )}
        </>,
      );

      actions.push(
        <PrimaryButton
          size="M"
          text="Delegate"
          fullWidth
          onPress={() => navigation.navigate("Staking", { multisigId: id })}
        />,
      );

      if (network?.features.includes(NetworkFeature.NameService)) {
        actions.push(
          <>
            <PrimaryButton
              size="M"
              text="Buy a name"
              fullWidth
              onPress={() => {
                setModalNameFinderVisible(true);
              }}
            />
            <TNSNameFinderModal
              visible={modalNameFinderVisible}
              onClose={() => {
                setModalNameFinderVisible(false);
              }}
              onEnter={() => {
                setModalNameFinderVisible(false);
                setVisibleRegisterForm(true);
              }}
            />
            {visibleRegisterForm && (
              <TNSRegisterScreen onClose={handleRegisterTnsModalClose} />
            )}
            {visibleMintForm && (
              <TNSMintNameModal
                initialData={{}}
                userId={id}
                userKind={UserKind.Multisig}
                onClose={handleMintTnsModalClose}
                navigateBackTo="TNSManage" // FIXME: this is weird
              />
            )}
          </>,
        );
      }

      if (network?.features.includes(NetworkFeature.BurnTokens)) {
        actions.push(
          <>
            <PrimaryButton
              size="M"
              text={`Burn ${stakingCurrency?.displayName}s`}
              fullWidth
              onPress={() => {
                setBurnModalVisible(true);
              }}
            />
            <BurnModal
              visible={burnModalVisible}
              onClose={() => setBurnModalVisible(false)}
              networkId={network?.id}
              userId={id}
              userKind={UserKind.Multisig}
              denom={stakingCurrency?.denom}
            />
          </>,
        );
      }

      // TODO: add warning modal
      actions.push(
        <PrimaryButton
          size="M"
          text="Clear signatures"
          fullWidth
          loader
          onPress={wrapWithFeedback(async () => {
            const network = getCosmosNetworkByChainId(multisig.chainId);
            if (!network) {
              throw new Error("Invalid multisig network");
            }
            const stargateClient = await getNonSigningStargateClient(
              network.id,
            );
            if (!stargateClient) {
              throw new Error("Invalid multisig network");
            }
            const account = await stargateClient.getAccount(multisig.address);
            await multisigClient.ClearSignatures({
              authToken,
              multisigChainId: multisig.chainId,
              multisigAddress: multisig.address,
              sequence: account?.sequence || 0,
            });
            await queryClient.invalidateQueries(
              multisigTransactionsQueryKey(
                network.id,
                getUserId(network.id, multisig.address),
              ),
            );
            await queryClient.invalidateQueries(
              multisigTransactionsQueryKey(network.id, undefined),
            );
          })}
        />,
      );
    }
  }

  return (
    <View style={containerCStyle}>
      <SpacerColumn size={5} />
      <BrandText style={[fontSemibold12, { color: neutral55 }]}>
        ACTIONS
      </BrandText>
      <SpacerColumn size={2} />
      {joinElements(actions, <SpacerColumn size={2.5} />)}
    </View>
  );
};

const containerCStyle: ViewStyle = {
  width: 300,
  height: "100%",
  borderLeftWidth: 1,
  borderColor: neutral33,
  padding: layout.spacing_x2_5,
};

const BurnModal: React.FC<{
  networkId: string | undefined;
  userId: string | undefined;
  userKind: UserKind;
  denom: string | undefined;
  visible: boolean;
  onClose?: () => void;
}> = ({ networkId, denom, userKind, userId, visible, onClose }) => {
  const [userAmount, setUserAmount] = useState<string>("0");
  const runOrProposeTransaction = useRunOrProposeTransaction(userId, userKind);
  const [userNetwork, userAddress] = parseUserId(userId);
  const balances = useBalances(userNetwork?.id, userAddress);
  const nativeCurrency = getNativeCurrency(networkId, denom);
  const { wrapWithFeedback } = useFeedbacks();
  const balance = balances.find((b) => b.denom === nativeCurrency?.denom);
  const max = Decimal.fromAtomics(
    balance?.amount || "0",
    nativeCurrency?.decimals || 0,
  ).toString();
  const runOrProposeBurn = wrapWithFeedback(async () => {
    if (!nativeCurrency) {
      throw new Error("invalid currency");
    }
    const amount = Decimal.fromUserInput(userAmount, nativeCurrency.decimals);
    const burnMsg: MsgBurnTokens = {
      sender: userAddress,
      amount: [
        Buffer.from(
          Coin.encode({
            amount: amount.atomics,
            denom: nativeCurrency?.denom,
          }).finish(),
        ).toString(),
      ],
    };
    await runOrProposeTransaction({
      msgs: [
        {
          typeUrl: "/teritori.mint.v1beta1.MsgBurnTokens",
          value: burnMsg,
        },
      ],
    });
    onClose?.();
  });
  return (
    <ModalBase visible={visible} onClose={onClose} label="Burn tokens">
      <TextInputCustom
        value={userAmount}
        onChangeText={setUserAmount}
        height={48}
        variant="labelOutside"
        label="Amount"
        name="local-name"
        currency={keplrCurrencyFromNativeCurrencyInfo(nativeCurrency)}
        rules={{ required: true, max }}
        placeHolder="0"
        defaultValue=""
        subtitle={
          <BrandText style={[fontSemibold13, { color: neutral77 }]}>
            Available:{" "}
            <BrandText style={[fontSemibold13, { color: primaryColor }]}>
              {max}
            </BrandText>
          </BrandText>
        }
      >
        <MaxButton onPress={() => setUserAmount(max)} />
      </TextInputCustom>
      <SpacerColumn size={2.5} />
      <PrimaryButton
        text={userKind === UserKind.Single ? "Burn" : "Propose burn"}
        onPress={runOrProposeBurn}
      />
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

export const joinElements = <ElementType, SeparatorType>(
  elements: ElementType[],
  separator: SeparatorType,
) => {
  const result: (ElementType | SeparatorType)[] = [];
  elements.forEach((e, i) => {
    result.push(e);
    if (i < elements.length - 1) {
      result.push(separator);
    }
  });
  return result;
};

const JoinMultisigModal: React.FC<{
  multisigId: string | undefined;
  userId: string | undefined;
  visible: boolean;
  onClose?: () => void;
}> = ({ multisigId, userId, visible, onClose }) => {
  const [network] = parseUserId(userId);
  const [name, setName] = useState("");
  const authToken = useMultisigAuthToken(userId);
  const { multisig } = useMultisigInfo(multisigId);
  const multisigClient = useMultisigClient(network?.id);
  const { wrapWithFeedback } = useFeedbacks();
  const queryClient = useQueryClient();

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      label="Join multisig"
      boxStyle={{ minWidth: 400 }}
    >
      <TextInputCustom
        value={name}
        onChangeText={setName}
        height={48}
        variant="labelOutside"
        label="Local name"
        name="local-name"
        rules={{ required: true }}
        placeHolder="Type the local name for this multisig..."
        defaultValue=""
      />
      <SpacerColumn size={2.5} />
      <PrimaryButton
        text="Join"
        disabled={!name}
        onPress={wrapWithFeedback(
          async () => {
            if (!name) {
              throw new Error("Need a name");
            }
            if (!multisig) {
              throw new Error("Multisig not found");
            }
            if (!authToken) {
              throw new Error("Need an auth token");
            }
            const cosmosNetwork = getCosmosNetworkByChainId(multisig.chainId);
            if (!cosmosNetwork) {
              throw new Error("Invalid multisig network");
            }
            await multisigClient.CreateOrJoinMultisig({
              chainId: multisig.chainId,
              multisigPubkeyJson: multisig.pubkeyJson,
              authToken,
              name,
              bech32Prefix: cosmosNetwork.addressPrefix,
            });
            await queryClient.invalidateQueries(
              multisigInfoQueryKey(multisigId),
            );
            await queryClient.invalidateQueries(
              multisigTransactionsQueryKey(cosmosNetwork.id, undefined),
            );
            await queryClient.invalidateQueries(userMultisigsQueryKey(userId));
            onClose?.();
          },
          { title: "Joined multisig!" },
        )}
      />
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};
