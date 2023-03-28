import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";

import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";
import ModalBase from "../../components/modals/GradientModalBase";
import { TNSSendFundsModal } from "../../components/modals/teritoriNameService/TNSSendFundsModal";
import { FindAName } from "../../components/teritoriNameService/FindAName";
import { useTNS } from "../../context/TNSProvider";
import { useNSNameAvailability } from "../../hooks/useNSNameAvailability";
import { useNSTokensByOwner } from "../../hooks/useNSTokensByOwner";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getCosmosNetwork } from "../../networks";
import { neutral17 } from "../../utils/style/colors";
import { modalWidthRatio, smallMobileWidth } from "../../utils/style/layout";
import { TNSModalCommonProps } from "./TNSHomeScreen";

interface TNSExploreScreenProps extends TNSModalCommonProps {}

export const TNSExploreScreen: React.FC<TNSExploreScreenProps> = ({
  onClose,
}) => {
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const { name, setName } = useTNS();
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);
  const { tokens } = useNSTokensByOwner(selectedWallet?.userId);
  const tokenId = (name + network?.nameServiceTLD || "").toLowerCase();
  const { nameAvailable, nameError, loading } = useNSNameAvailability(
    networkId,
    tokenId
  );

  const { width } = useWindowDimensions();

  return (
    <ModalBase
      label="Find a name"
      hideMainSeparator
      onClose={() => onClose()}
      modalStatus={name && nameAvailable ? "success" : "danger"}
      // modalStatus={"danger"}
      width={width < smallMobileWidth ? modalWidthRatio * width : 457}
    >
      {/*----- The first thing you'll see on this screen is <FindAName> */}
      <FindAName
        name={name}
        setName={setName}
        nameError={nameError}
        nameAvailable={nameAvailable}
        loading={loading}
      >
        {/*-----  If name entered, no error and if the name is minted, we display some buttons for Explore flow */}
        {name && !nameError && !nameAvailable ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 56,
              maxHeight: 56,
              minHeight: 56,
              maxWidth: 332,
              width: "100%",
            }}
          >
            <PrimaryButton
              size="XL"
              width={154}
              text="View"
              onPress={() => {
                onClose("TNSConsultName");
              }}
              squaresBackgroundColor={neutral17}
            />
            <PrimaryButtonOutline
              size="XL"
              width={154}
              disabled={tokens.includes(tokenId) || !selectedWallet?.connected}
              text="Send funds"
              onPress={() => setSendFundsModalVisible(true)}
              squaresBackgroundColor={neutral17}
            />
          </View>
        ) : null}
      </FindAName>

      <TNSSendFundsModal
        onClose={() => setSendFundsModalVisible(false)}
        isVisible={sendFundsModalVisible}
      />
    </ModalBase>
  );
};
