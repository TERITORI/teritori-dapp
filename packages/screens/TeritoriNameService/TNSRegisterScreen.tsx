import React from "react";
import { Platform, useWindowDimensions } from "react-native";

import { TNSCloseHandler } from "./types";
import GradientModalBase from "../../components/modals/GradientModalBase";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { FindAName } from "@/components/teritoriNameService/FindAName";
import { useTNS } from "@/context/TNSProvider";
import { useNSMintAvailability } from "@/hooks/useNSMintAvailability";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { getCosmosNetwork } from "@/networks";
import { neutral00, neutral33 } from "@/utils/style/colors";

interface TNSRegisterScreenProps {
  onClose: TNSCloseHandler;
}

export const TNSRegisterScreen: React.FC<TNSRegisterScreenProps> = ({
  onClose,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const networkId = useSelectedNetworkId();
  const { name, setName } = useTNS();
  const network = getCosmosNetwork(networkId);
  const tokenId = name + network?.nameServiceTLD || "";
  const { nameAvailable, nameError, loading } = useNSMintAvailability(
    networkId,
    tokenId,
  );

  const width = windowWidth < 457 ? windowWidth : 457;

  return (
    <GradientModalBase
      onClose={() => onClose()}
      label="Find a Name"
      width={width}
      modalStatus={name && nameAvailable ? "success" : "danger"}
      hideMainSeparator
      scrollable
      contentStyle={{
        marginTop: Platform.OS === "web" ? 0 : 60,
      }}
    >
      {/*----- The first thing you'll see on this screen is <FindAName> */}
      <FindAName
        name={name}
        setName={setName}
        nameError={nameError}
        nameAvailable={nameAvailable}
        loading={loading}
        nameNFTStyle={{
          backgroundColor: neutral00,
          borderWidth: 1,
          borderColor: neutral33,
          borderRadius: 8,
          paddingBottom: 48,
          width: "100%",
        }}
      >
        {name && !nameError && nameAvailable ? (
          <PrimaryButton
            size="XL"
            width={280}
            text="Register your Username"
            onPress={() => {
              setName(name);
              onClose("TNSMintName");
            }}
          />
        ) : null}

        {name && !nameError && !nameAvailable && (
          <PrimaryButton
            size="XL"
            width={280}
            text="View"
            onPress={() => {
              onClose("TNSConsultName");
            }}
          />
        )}
      </FindAName>
    </GradientModalBase>
  );
};
