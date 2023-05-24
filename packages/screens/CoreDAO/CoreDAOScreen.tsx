import { useQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { Member } from "../../contracts-clients/cw4-group/Cw4Group.types";
import { DaoCoreQueryClient } from "../../contracts-clients/dao-core/DaoCore.client";
import { DaoVotingCw4QueryClient } from "../../contracts-clients/dao-voting-cw4/DaoVotingCw4.client";
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
  const { setToastSuccess, setToastError } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const [newMemberAddress, setNewMemberAddress] = React.useState("");
  const [removeMemberAddress, setRemoveMemberAddress] = React.useState("");
  return (
    <View style={{ flexDirection: "row" }}>
      <TextInputCustom
        label="New member address"
        name="new-member-address"
        onChangeText={setNewMemberAddress}
      />
      <PrimaryButton
        text="Add member"
        onPress={async () => {
          try {
            if (!network?.coreDAOAddress) {
              throw new Error("no core DAO address");
            }
            if (!selectedWallet?.address) {
              throw new Error("no selected wallet");
            }

            const cosmwasmClient = await mustGetNonSigningCosmWasmClient(
              networkId
            );

            const daoCoreClient = new DaoCoreQueryClient(
              cosmwasmClient,
              network?.coreDAOAddress
            );

            const votingModuleAddress = await daoCoreClient.votingModule();
            const votingClient = new DaoVotingCw4QueryClient(
              cosmwasmClient,
              votingModuleAddress
            );

            const cw4Address = await votingClient.groupContract();

            const weight = 1;
            const updateMembersReq: {
              add: Member[];
              remove: string[];
            } = { add: [{ addr: newMemberAddress, weight }], remove: [] };

            const res = await makeProposal(
              networkId,
              selectedWallet.address,
              network.coreDAOAddress,
              {
                title: `Add ${newMemberAddress} as member with weight ${weight}`,
                description: "",
                msgs: [
                  {
                    wasm: {
                      execute: {
                        contract_addr: cw4Address,
                        msg: Buffer.from(
                          JSON.stringify({
                            update_members: updateMembersReq,
                          })
                        ).toString("base64"),
                        funds: [],
                      },
                    },
                  },
                ],
              }
            );

            console.log("created proposal", res);
            setToastSuccess({ title: "Created proposal", message: "" });
          } catch (err) {
            console.error(err);
            if (err instanceof Error)
              setToastError({
                title: "Failed to create proposal",
                message: err.message,
              });
          }
        }}
      />
      <TextInputCustom
        label="Remove member address"
        name="remove-member-address"
        onChangeText={setRemoveMemberAddress}
      />
      <PrimaryButton
        text="Remove member"
        onPress={async () => {
          try {
            if (!network?.coreDAOAddress) {
              throw new Error("no core DAO address");
            }
            if (!selectedWallet?.address) {
              throw new Error("no selected wallet");
            }

            const cosmwasmClient = await mustGetNonSigningCosmWasmClient(
              networkId
            );

            const daoCoreClient = new DaoCoreQueryClient(
              cosmwasmClient,
              network?.coreDAOAddress
            );

            const votingModuleAddress = await daoCoreClient.votingModule();
            const votingClient = new DaoVotingCw4QueryClient(
              cosmwasmClient,
              votingModuleAddress
            );

            const cw4Address = await votingClient.groupContract();

            const updateMembersReq: {
              add: Member[];
              remove: string[];
            } = { add: [], remove: [removeMemberAddress] };

            const res = await makeProposal(
              networkId,
              selectedWallet.address,
              network.coreDAOAddress,
              {
                title: `Remove ${removeMemberAddress} as member`,
                description: "",
                msgs: [
                  {
                    wasm: {
                      execute: {
                        contract_addr: cw4Address,
                        msg: Buffer.from(
                          JSON.stringify({
                            update_members: updateMembersReq,
                          })
                        ).toString("base64"),
                        funds: [],
                      },
                    },
                  },
                ],
              }
            );

            console.log("created proposal", res);
            setToastSuccess({ title: "Created proposal", message: "" });
          } catch (err) {
            console.error(err);
            if (err instanceof Error)
              setToastError({
                title: "Failed to create proposal",
                message: err.message,
              });
          }
        }}
      />
    </View>
  );
};

const VaultManager: React.FC<{ networkId: string }> = ({ networkId }) => {
  const network = getCosmosNetwork(networkId);

  const { vaultConfig } = useVaultConfig(networkId);

  const vaultBalances = useBalances(networkId, network?.vaultContractAddress);
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
    </View>
  );
};

const NameServiceManager: React.FC<{ networkId: string }> = ({ networkId }) => {
  const network = getCosmosNetwork(networkId);
  const { data: nsAdmin } = useQuery(
    ["ns-admin", networkId, network?.nameServiceContractAddress],
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
  return (
    <View>
      {" "}
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
  return (
    <View>
      {" "}
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
    </View>
  );
};
