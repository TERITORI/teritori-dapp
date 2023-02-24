import React, { useState } from "react";
import { View } from "react-native";

import { SecondaryButton } from "../../../../../components/buttons/SecondaryButton";
import { useFeedbacks } from "../../../../../context/FeedbacksProvider";
import { useIsKeplrConnected } from "../../../../../hooks/useIsKeplrConnected";
import {
  getFirstKeplrAccount,
  getSigningCosmWasmClient,
} from "../../../../../utils/keplr";
import {
  neutral00,
  neutral33,
  primaryColor,
  neutral77,
} from "../../../../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold12,
} from "../../../../../utils/style/fonts";
import { UserInfo } from "../../../../../utils/types/freelance";
import { BrandText } from "../../../../BrandText/BrandText";
import { Separator } from "../../../../Separator";
import { TextInputCustom } from "../../../../inputs/TextInputCustom";
import { ModalBase } from "../../../../modals/ModalBase";
// import { ReportRequest } from "../../../../../api/report/v1/report";

export const DescritpionReportPopup: React.FC<{
  userInfo: UserInfo;
  visible?: boolean;
  onClose: () => void;
}> = ({ userInfo, visible, onClose }) => {
  const isKeplrConnected = useIsKeplrConnected();

  const [displayDescriptionReportPopUp, setDisplayDescriptionReportPopUp] =
    useState(visible);

  const [description, setDescription] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");

  const { setToastError, setToastSuccess } = useFeedbacks();

  const contractAddress = process.env
    .TERITORI_REPORT_CONTRACT_ADDRESS as string;

  function handleConfirmClick() {
    onClose();
    setDisplayDescriptionReportPopUp(false);
  }

  const sendReportToContract = async () => {
    if (!isKeplrConnected) {
      setToastError({
        title: "Please connect Keplr",
        message: "",
      });
      return;
    }
    const msg = {
      seller_report: {
        seller: userInfo.user_addr,
        report_data: JSON.stringify({
          desc: description,
          ref_url: referenceUrl,
        }),
      },
    };
    const signingClient = await getSigningCosmWasmClient();
    const walletAddress = (await getFirstKeplrAccount()).address;
    const reportResult = await signingClient.execute(
      walletAddress!,
      contractAddress,
      msg,
      "auto"
    );
    if (reportResult) {
      setToastSuccess({
        title: `report for ${userInfo.user_addr} sent successfully`,
        message: "",
      });
      handleConfirmClick();
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
        value={referenceUrl}
        onChangeText={setReferenceUrl}
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
