import { useQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { TeritoriNameServiceQueryClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { useFeedConfig } from "../../hooks/feed/useFeedConfig";
import { useBalances } from "../../hooks/useBalances";
import { useBreedingConfig } from "../../hooks/useBreedingConfig";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useVaultConfig } from "../../hooks/vault/useVaultConfig";
import {
  getCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
} from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { makeProposal } from "../../utils/dao";
import { ScreenFC } from "../../utils/navigation";

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
  const network = getCosmosNetwork(networkId);
  const balances = useBalances(networkId, network?.coreDAOAddress);
  return (
    <View>
      <BrandText>Funds</BrandText>
      {balances.map((balance) => {
        return (
          <BrandText>
            {prettyPrice(networkId, balance.amount, balance.denom)} - $
            {balance.usdAmount}
          </BrandText>
        );
      })}
    </View>
  );
};

const VaultManager: React.FC<{ networkId: string }> = ({ networkId }) => {
  const network = getCosmosNetwork(networkId);
  const { vaultConfig } = useVaultConfig(networkId);
  const vaultBalances = useBalances(networkId, network?.vaultContractAddress);
  const { wrapWithFeedback } = useFeedbacks();
  const selectedWallet = useSelectedWallet();

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
        text="Propose to withdraw marketplace fees"
        onPress={wrapWithFeedback(async () => {
          if (!network?.vaultContractAddress) {
            throw new Error("no vault contract address");
          }
          const msg = { withdraw_fee: {} };
          await makeProposal(
            networkId,
            selectedWallet?.address,
            network?.coreDAOAddress,
            {
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
            }
          );
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
