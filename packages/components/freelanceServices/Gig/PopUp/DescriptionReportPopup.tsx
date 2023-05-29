import React, { useState } from "react";
import { View } from "react-native";

import { useFeedbacks } from "../../../../context/FeedbacksProvider";
import { TeritoriReportClient } from "../../../../contracts-clients/teritori-freelance/TeritoriReport.client";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import { getSigningCosmWasmClient } from "../../../../utils/keplr";
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
      const client = new TeritoriReportClient(
        await getSigningCosmWasmClient(),
        wallet?.address || "",
        process.env.TERITORI_FREELANCE_REPORT_ADDRESS || ""
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
                //using contract
                await sendReportToContract();

                //using backend_api
                // const obserable = backendReportClient.report({
                //   desc: description,
                //   refUrl: referenceUrl,
                // });
                // obserable.subscribe((ret) => {
                //   if (ret.result === 0) {
                //     console.log("successful");
                //   } else {
                //     console.log("failed: ", ret.result);
                //   }
                // });
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
        mainContainerStyle={{}}
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
        mainContainerStyle={{}}
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
