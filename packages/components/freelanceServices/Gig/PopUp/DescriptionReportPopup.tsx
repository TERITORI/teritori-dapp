import React, { useState } from "react";
import { View } from "react-native";

import { useFeedbacks } from "../../../../context/FeedbacksProvider";
import { TeritoriReportClient } from "../../../../contracts-clients/teritori-freelance/TeritoriReport.client";
import { useSelectedNetworkId } from "../../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import {
  mustGetCosmosNetwork,
  getKeplrSigningCosmWasmClient,
} from "../../../../networks";
import {
  neutral00,
  neutral33,
  primaryColor,
  neutral77,
} from "../../../../utils/style/colors";
import { fontSemibold14, fontSemibold12 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText/BrandText";
import { Separator } from "../../../Separator";
import { SecondaryButton } from "../../../buttons/SecondaryButton";
import { TextInputCustom } from "../../../inputs/TextInputCustom";
import { ModalBase } from "../../../modals/ModalBase";

export const DescriptionReportPopup: React.FC<{
  seller: string;
  visible?: boolean;
  optionIndex: number;
  onClose: () => void;
}> = ({ seller, visible, optionIndex, onClose }) => {
  const wallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();

  const [displayDescriptionReportPopUp, setDisplayDescriptionReportPopUp] =
    useState(visible);

  const [description, setDescription] = useState("");
  const [refUrl, setRefUrl] = useState("");

  const { setToastError, setToastSuccess } = useFeedbacks();

  function handleConfirmClick() {
    onClose();
    setDisplayDescriptionReportPopUp(false);
  }

  const sendReportToContract = async () => {
    if (!wallet || !wallet.connected) {
      setToastError({
        title: "Please connect Keplr",
        message: "",
      });
      return;
    }
    try {
      const signingClient = await getKeplrSigningCosmWasmClient(networkId);
      const network = mustGetCosmosNetwork(networkId);
      const client = new TeritoriReportClient(
        signingClient,
        wallet?.address!,
        network.freelanceReportAddress!
      );
      const res = await client.sellerReportContract({
        seller,
        optionIndex,
        description,
        refUrl,
      });
      if (res) {
        setToastSuccess({
          title: `report for ${seller} sent successfully`,
          message: "",
        });
        handleConfirmClick();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ModalBase
      onClose={() => {
        handleConfirmClick();
      }}
      label="Reporting Inappropriate Gig"
      visible={displayDescriptionReportPopUp}
      width={372}
      childrenBottom={
        <>
          <Separator style={{ width: "100%" }} />

          <View
            style={{
              width: "100%",
              justifyContent: "space-around",
              flexDirection: "row",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <SecondaryButton
              size="XS"
              text="   Cancel   "
              color={primaryColor}
              backgroundColor={neutral33}
              onPress={() => {
                handleConfirmClick();
              }}
            />
            <SecondaryButton
              size="XS"
              text="   Submit   "
              color={neutral00}
              backgroundColor={primaryColor}
              onPress={async () => {
                await sendReportToContract();
              }}
            />
          </View>
        </>
      }
    >
      <BrandText
        style={[fontSemibold14, { color: neutral77, marginBottom: 12 }]}
      >
        Describe the violation/reason for Gig removal request *
      </BrandText>
      <TextInputCustom
        label=""
        name="Description Input"
        placeHolder="Type description here"
        height={120}
        multiline
        numberOfLines={5}
        value={description}
        onChangeText={setDescription}
      />
      <BrandText
        style={[
          fontSemibold14,
          { color: neutral77, marginTop: 20, marginBottom: 12 },
        ]}
      >
        Reference URL (if applicable)
      </BrandText>
      <TextInputCustom
        label=""
        name="Reference URL"
        placeHolder="Type Reference URL here"
        height={40}
        value={refUrl}
        onChangeText={setRefUrl}
      />
      <BrandText
        style={[
          fontSemibold12,
          { color: neutral77, marginTop: 20, marginBottom: 12 },
        ]}
      >
        * Gigs associated with non permitted usage as detailed in the User
        Conduct section under our{" "}
        <BrandText style={fontSemibold12}>Terms of Service</BrandText>
      </BrandText>
    </ModalBase>
  );
};
