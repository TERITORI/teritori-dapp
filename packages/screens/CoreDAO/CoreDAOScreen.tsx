import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { View } from "react-native";

import { Coin } from "../../api/teritori/coin";
import { MsgBurnTokens } from "../../api/teritori/mint";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { TeritoriNameServiceQueryClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { TeritoriNftVaultClient } from "../../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { useDAOMakeProposal } from "../../hooks/dao/useDAOMakeProposal";
import { useFeedConfig } from "../../hooks/feed/useFeedConfig";
import { useBalances } from "../../hooks/useBalances";
import { useBreedingConfig } from "../../hooks/useBreedingConfig";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useVaultConfig } from "../../hooks/vault/useVaultConfig";
import {
  getCosmosNetwork,
  getKeplrSigningCosmWasmClient,
  getKeplrSigningStargateClient,
  getStakingCurrency,
  getUserId,
  keplrCurrencyFromNativeCurrencyInfo,
  mustGetNonSigningCosmWasmClient,
} from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { ScreenFC } from "../../utils/navigation";

// This is a dev tool for now

export const CoreDAOScreen: ScreenFC<"CoreDAO"> = () => {
  const networkId = useSelectedNetworkId();
  return (
    <ScreenContainer>
      <DAOManager />
      <SpacerColumn size={2} />
      <VaultManager networkId={networkId} />
      <SpacerColumn size={2} />
      <NameServiceManager networkId={networkId} />
      <SpacerColumn size={2} />
      <SocialFeedManager networkId={networkId} />
      <SpacerColumn size={2} />
      <BreedingManager networkId={networkId} />
    </ScreenContainer>
  );
};

const DAOManager: React.FC = () => {
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const network = getCosmosNetwork(networkId);
  const daoBalances = useBalances(networkId, network?.coreDAOAddress);
  const userBalances = useBalances(networkId, selectedWallet?.address);
  const makeProposal = useDAOMakeProposal(
    getUserId(networkId, network?.coreDAOAddress)
  );
  const [burnAmount, setBurnAmount] = useState("0");
  const { wrapWithFeedback } = useFeedbacks();
  const currency = getStakingCurrency(networkId);
  return (
    <View>
      <BrandText>Core DAO Funds</BrandText>
      <SpacerColumn size={1} />
      {daoBalances.map((balance) => {
        return (
          <BrandText>
            {prettyPrice(networkId, balance.amount, balance.denom)} - $
            {balance.usdAmount}
          </BrandText>
        );
      })}
      <SpacerColumn size={1} />
      <PrimaryButton
        text="Burn a TORI"
        loader
        onPress={async () => {
          if (!network?.coreDAOAddress) {
            return;
          }

          if (!selectedWallet?.address) {
            return;
          }

          const burnMsg: MsgBurnTokens = {
            sender: network.coreDAOAddress,
            amount: [
              Buffer.from(
                Coin.encode({ amount: "1000000", denom: "utori" }).finish()
              ).toString(),
            ],
          };

          await makeProposal(selectedWallet?.address, {
            title: "Propose to burn a TORI",
            description: "",
            msgs: [
              {
                stargate: {
                  type_url: "/teritori.mint.v1beta1.MsgBurnTokens",
                  value: Buffer.from(
                    MsgBurnTokens.encode(burnMsg).finish()
                  ).toString("base64"),
                },
              },
            ],
          });
        }}
      />
      <SpacerColumn size={4} />
      <BrandText>Your Funds</BrandText>
      {userBalances.map((balance) => {
        return (
          <BrandText>
            {prettyPrice(networkId, balance.amount, balance.denom)} - $
            {balance.usdAmount}
          </BrandText>
        );
      })}
      <SpacerColumn size={1} />
      <TextInputCustom
        label="Amount to burn"
        name="burn-amount"
        currency={keplrCurrencyFromNativeCurrencyInfo(currency)}
        onChangeText={setBurnAmount}
      />
      <SpacerColumn size={1} />
      <PrimaryButton
        text="Burn your TORIs"
        loader
        onPress={wrapWithFeedback(async () => {
          if (!selectedWallet?.address || !currency) {
            throw new Error("no wallet or currency");
          }
          const client = await getKeplrSigningStargateClient(
            selectedWallet.networkId
          );
          const burnMsg: MsgBurnTokens = {
            sender: selectedWallet?.address,
            amount: [
              Buffer.from(
                Coin.encode({
                  amount: Decimal.fromUserInput(burnAmount, currency.decimals)
                    .atomics,
                  denom: currency.denom,
                }).finish()
              ).toString(),
            ],
          };
          await client.signAndBroadcast(
            selectedWallet?.address,
            [
              {
                typeUrl: "/teritori.mint.v1beta1.MsgBurnTokens",
                value: burnMsg,
              },
            ],
            "auto"
          );
        })}
      />
    </View>
  );
};

const VaultManager: React.FC<{ networkId: string }> = ({ networkId }) => {
  const network = getCosmosNetwork(networkId);
  const { vaultConfig } = useVaultConfig(networkId);
  const vaultBalances = useBalances(networkId, network?.vaultContractAddress);
  const { wrapWithFeedback } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const makeProposal = useDAOMakeProposal(
    getUserId(networkId, network?.vaultContractAddress)
  );

  return (
    <View>
      <BrandText>
        Marketplace
        {"\n"}
        Contract address: {network?.vaultContractAddress}
        {"\n"}
        Admin: {vaultConfig?.owner}
      </BrandText>
      {vaultBalances.map((balance) => {
        return (
          <BrandText>
            {prettyPrice(networkId, balance.amount, balance.denom)}
          </BrandText>
        );
      })}
      <PrimaryButton
        text="Withdraw marketplace fees"
        onPress={wrapWithFeedback(async () => {
          if (!selectedWallet?.address) {
            throw new Error("no wallet connected");
          }
          if (!network?.vaultContractAddress) {
            throw new Error("no vault contract address");
          }
          const cosmwasmClient = await getKeplrSigningCosmWasmClient(
            network.id
          );
          const client = new TeritoriNftVaultClient(
            cosmwasmClient,
            selectedWallet.address,
            network.vaultContractAddress
          );
          await client.withdrawFee();
        })}
      />
      <PrimaryButton
        text="Propose to withdraw marketplace fees"
        onPress={wrapWithFeedback(async () => {
          if (!selectedWallet?.address) {
            return;
          }
          if (!network?.vaultContractAddress) {
            throw new Error("no vault contract address");
          }
          const msg = { withdraw_fee: {} };
          await makeProposal(selectedWallet?.address, {
            title: "Withdraw marketplace fees",
            description: "",
            msgs: [
              {
                wasm: {
                  execute: {
                    contract_addr: network?.vaultContractAddress,
                    funds: [],
                    msg: Buffer.from(JSON.stringify(msg)).toString("base64"),
                  },
                },
              },
            ],
          });
        })}
      />
    </View>
  );
};

const NameServiceManager: React.FC<{ networkId: string }> = ({ networkId }) => {
  const network = getCosmosNetwork(networkId);
  const { data: nsAdmin } = useQuery(
    ["nsAdmin", networkId, network?.nameServiceContractAddress],
    async () => {
      if (!network?.nameServiceContractAddress) {
        return undefined;
      }
      const client = new TeritoriNameServiceQueryClient(
        await mustGetNonSigningCosmWasmClient(networkId),
        network.nameServiceContractAddress
      );

      const res = await client.adminAddress();
      return res.minter;
    }
  );
  return (
    <View>
      <BrandText>
        Name Service
        {"\n"}
        Contract address: {network?.nameServiceContractAddress}
        {"\n"}
        Admin: {nsAdmin}
        {"\n"}
        Name service fees are automatically sent to the admin address
      </BrandText>
    </View>
  );
};

const SocialFeedManager: React.FC<{ networkId: string }> = ({ networkId }) => {
  const network = getCosmosNetwork(networkId);
  const { feedConfig } = useFeedConfig(networkId);
  const feedBalances = useBalances(
    networkId,
    network?.socialFeedContractAddress
  );
  const { wrapWithFeedback } = useFeedbacks();
  return (
    <View>
      <BrandText>
        Social Feed
        {"\n"}
        Contract address: {network?.socialFeedContractAddress}
        {"\n"}
        Admin: {feedConfig?.owner}
      </BrandText>
      {feedBalances.map((balance) => {
        return (
          <BrandText>
            {prettyPrice(networkId, balance.amount, balance.denom)}
          </BrandText>
        );
      })}
      <PrimaryButton
        text="Propose to withdraw social feed fees"
        onPress={wrapWithFeedback(async () => {
          throw new Error("not implemented");
        })}
      />
    </View>
  );
};

const BreedingManager: React.FC<{ networkId: string }> = ({ networkId }) => {
  const network = getCosmosNetwork(networkId);
  const { breedingConfig } = useBreedingConfig(networkId);
  const breedingBalances = useBalances(
    networkId,
    network?.riotContractAddressGen1
  );
  const { wrapWithFeedback } = useFeedbacks();
  return (
    <View>
      <BrandText>
        Breeding
        {"\n"}
        Contract address: {network?.riotContractAddressGen1}
        {"\n"}
        Admin: {breedingConfig?.owner}
      </BrandText>
      {breedingBalances.map((balance) => {
        return (
          <BrandText>
            {prettyPrice(networkId, balance.amount, balance.denom)}
          </BrandText>
        );
      })}
      <PrimaryButton
        text="Propose to withdraw breeding fees"
        onPress={wrapWithFeedback(async () => {
          throw new Error("not implemented");
        })}
      />
    </View>
  );
};
