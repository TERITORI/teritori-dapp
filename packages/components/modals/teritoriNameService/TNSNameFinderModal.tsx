import React, { useEffect } from "react";
import { View } from "react-native";

import { useTNS } from "../../../context/TNSProvider";
import {
  additionalRed,
  neutral33,
  neutral77,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import ModalBase from "../ModalBase";

import { AvailableNamesInput } from "@/components/inputs/AvailableNamesInput";
import { useNSMintAvailability } from "@/hooks/useNSMintAvailability";
import { useNSMintPrice } from "@/hooks/useNSMintPrice";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getCosmosNetwork, parseUserId } from "@/networks";
import { prettyPrice } from "@/utils/coins";

const AVAILABLE_DOMAINS = [".tori"];
const COMING_SOON_DOMAINS = [".rioter"];

const DomainsAvailability = () => {
  return (
    <View
      style={{
        padding: 20,
        borderTopWidth: 1,
        borderColor: neutral33,
        width: "100%",
      }}
    >
      <BrandText
        style={[
          fontSemibold14,
          {
            color: neutral77,
            lineHeight: 16,
          },
        ]}
      >
        Available domains:
      </BrandText>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {AVAILABLE_DOMAINS.map((domain) => (
          <BrandText
            key={domain}
            style={[
              fontSemibold14,
              {
                color: additionalRed,
                lineHeight: 20,
                marginRight: 5,
              },
            ]}
          >
            {domain}
          </BrandText>
        ))}
      </View>
      <BrandText
        style={[
          fontSemibold14,
          {
            color: neutral77,
            marginTop: 20,
          },
        ]}
      >
        Coming soon domains:
      </BrandText>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {COMING_SOON_DOMAINS.map((domain) => (
          <BrandText
            key={domain}
            style={[
              fontSemibold14,
              {
                color: neutral77,
                lineHeight: 20,
                marginRight: 5,
              },
            ]}
          >
            {domain}
          </BrandText>
        ))}
        <BrandText
          style={[
            fontSemibold14,
            {
              color: neutral77,
              lineHeight: 20,
            },
          ]}
        >
          and more
        </BrandText>
      </View>
    </View>
  );
};

export const TNSNameFinderModal: React.FC<{
  visible?: boolean;
  onClose: () => void;
  onEnter: () => void;
}> = ({ visible, onClose, onEnter }) => {
  const { name, setName } = useTNS();

  const selectedWallet = useSelectedWallet();
  const [network] = parseUserId(selectedWallet?.userId);
  const networkId = network?.id;
  const cosmosNetwork = getCosmosNetwork(networkId);
  const normalizedTokenId = (
    name + cosmosNetwork?.nameServiceTLD || ""
  ).toLowerCase();

  const tokenId = name + cosmosNetwork?.nameServiceTLD || "";

  const { nsMintPrice: price } = useNSMintPrice(networkId, normalizedTokenId);
  const { nameAvailable, loading } = useNSMintAvailability(networkId, tokenId);

  const onPressEnter = () => {
    if (name) {
      onEnter();
    }
  };

  useEffect(() => {
    // Reset the name each time the modal appears
    if (visible) setName("");
  }, [setName, visible]);

  // let availabilityInfo = <></>;
  // if (name && selectedNetwork?.kind === NetworkKind.Cosmos) {
  //   if (price?.invalid) {
  //     availabilityInfo = (
  //       <BrandText style={{ color: redDefault, ...fontSemibold14 }}>
  //         Invalid
  //       </BrandText>
  //     );
  //   } else if (nameAvailable) {
  //     availabilityInfo = (
  //       <View style={{ flexDirection: "row" }}>
  //         <BrandText style={{ color: primaryColor, ...fontSemibold14 }}>
  //           {prettyPrice(networkId, price?.amount, price?.denom)}
  //         </BrandText>
  //       </View>
  //     );
  //   } else if (!nameAvailable) {
  //     availabilityInfo = (
  //       <BrandText style={{ color: redDefault, ...fontSemibold14 }}>
  //         Taken
  //       </BrandText>
  //     );
  //   }
  // }

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      label="Find a Name"
      childrenBottom={<DomainsAvailability />}
      width={372}
    >
      <AvailableNamesInput
        loading={loading}
        nameValue={name}
        label={`NAME${name ? `: ${tokenId}` : ""}`}
        name="name"
        placeHolder="Type name here"
        value={name}
        onPressEnter={onPressEnter}
        onChangeText={(value: string) => setName(value)}
        isInvalid={!!price?.invalid}
        isNameAvailabel={nameAvailable}
        isTaken={!nameAvailable}
        price={prettyPrice(networkId, price?.amount, price?.denom)}
        style={{ marginBottom: 20, width: "100%" }}
      />

      {/* <TextInputCustom<NameFinderFormType>
        noBrokenCorners
        isLoading={loading}
        variant="labelOutside"
        label={`NAME${name ? `: ${name + cosmosNetwork?.nameServiceTLD}` : ""}`}
        placeHolder="Type name here"
        name="name"
        rules={{ required: true }}
        onPressEnter={onPressEnter}
        onChangeText={setName}
        regexp={new RegExp(/^[a-zA-Z]+$/)}
        style={{ marginBottom: 20, width: "100%" }}
        value={name}
      >
        {availabilityInfo}
      </TextInputCustom> */}

      {/* <TextInputCustom<NameFinderFormType>
        name="name"
        label="NAME"
        placeHolder="Type name here"
        onPressEnter={onPressEnter}
        onChangeText={setName}
        value={name}
        regexp={new RegExp(/^[a-zA-Z]+$/)}
        style={{ marginBottom: 20, width: "100%" }}
      /> */}
      <PrimaryButton
        size="M"
        text="Find"
        touchableStyle={{ marginBottom: 20 }}
        fullWidth
        disabled={!name}
        onPress={onPressEnter}
      />
    </ModalBase>
  );
};
