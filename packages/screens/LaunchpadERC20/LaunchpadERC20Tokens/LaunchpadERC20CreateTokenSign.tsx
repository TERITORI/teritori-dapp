import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Image, View } from "react-native";

import gnoSVG from "../../../../assets/icons/networks/gno.svg";
import projectSuccessPaymentPNG from "../../../../assets/project-success-payment.png";
import ModalBase from "../../../components/modals/ModalBase";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { Tag } from "../../Projects/components/Milestone";
import { useCreateTokenState } from "../hooks/useCreateToken";

import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { SecondaryButtonOutline } from "@/components/buttons/SecondaryButtonOutline";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useBalances } from "@/hooks/useBalances";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "@/hooks/useSelectedNetwork";
import { NetworkFeature, getNetworkFeature } from "@/networks";
import { prettyPrice } from "@/utils/coins";
import { adenaVMCall } from "@/utils/gno";
import { useAppNavigation } from "@/utils/navigation";
import {
  neutral00,
  neutral17,
  neutral33,
  neutral77,
  neutralFF,
} from "@/utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";

export const CreateTokenSign: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigation = useAppNavigation();
  const { createTokenFormBasics, createTokenFormDetails } =
    useCreateTokenState();
  const networkId = useSelectedNetworkId();

  const pmFeature = getNetworkFeature(networkId, NetworkFeature.LaunchpadERC20);

  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetworkInfo();
  const { balances } = useBalances(
    selectedNetwork?.id,
    selectedWallet?.address,
  );
  const bal = balances?.find((b) => b.denom === pmFeature?.paymentsDenom);

  const { setToast } = useFeedbacks();

  const queryClient = useQueryClient();

  const cancel = async () => {
    setIsShowConfirmModal(false);
    navigation.replace("LaunchpadERC20Tokens", { network: networkId });
  };

  const createTokenSign = async () => {
    try {
      setIsProcessing(true);

      if (!createTokenFormBasics.name) {
        setIsShowConfirmModal(false);
        throw Error("Name is required");
      }

      if (!createTokenFormBasics.symbol) {
        setIsShowConfirmModal(false);
        throw Error("Symbol is required");
      }

      if (!createTokenFormBasics.totalSupply) {
        setIsShowConfirmModal(false);
        throw Error("Total supply is required");
      }

      if (!pmFeature) {
        throw Error("Launchpad ERC20 feature not found");
      }

      await adenaVMCall(
        networkId,
        {
          caller: createTokenFormBasics.caller,
          send: "",
          pkg_path: pmFeature?.launchpadERC20PkgPath,
          func: "NewToken",
          args: [
            createTokenFormBasics.name,
            createTokenFormBasics.symbol,
            "noimage", // TODO: Add user to upload an image
            createTokenFormBasics.decimals.toString(),
            createTokenFormBasics.totalSupply.toString(),
            createTokenFormBasics.totalSupplyCap?.toString() || "0",
            createTokenFormDetails.allowMint.toString(),
            createTokenFormDetails.allowBurn.toString(),
          ],
        },
        { gasWanted: 10_000_000 },
      );

      await queryClient.invalidateQueries(["lastTokens"]);

      setIsShowConfirmModal(false);
      setIsShowModal(true);
    } catch (e) {
      let msg = "";
      if (e instanceof Error) {
        msg = e.message;
      } else {
        msg = `${e}`;
      }
      setIsShowConfirmModal(false);
      setToast({
        title: "Error",
        message: msg,
        type: "error",
        mode: "normal",
      });
      throw e;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      <ModalBase
        onClose={cancel}
        label="Sign the transaction"
        visible={isShowConfirmModal}
        width={480}
      >
        <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
          You’re making the signature to validate a transaction
        </BrandText>

        <SpacerColumn size={2} />

        <TertiaryBox
          style={{
            padding: layout.spacing_x1_5,
            flexDirection: "row",
            backgroundColor: neutral17,
            alignItems: "center",
          }}
        >
          <SVG width={20} height={20} source={gnoSVG} />

          <SpacerRow size={1.5} />

          <View style={{ flexGrow: 1 }}>
            <BrandText style={[{ color: neutral77 }, fontSemibold12]}>
              {selectedNetwork?.displayName}
            </BrandText>

            <BrandText style={fontSemibold13}>
              {tinyAddress(selectedWallet?.address, 16)}
            </BrandText>
          </View>

          {selectedWallet?.address && <Tag text="connected" color="#C8FFAE" />}
        </TertiaryBox>

        <SpacerColumn size={1.5} />
        <FlexRow style={{ justifyContent: "space-between" }}>
          <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
            Balance
          </BrandText>

          <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
            {prettyPrice(networkId, bal?.amount, pmFeature?.paymentsDenom)}
          </BrandText>
        </FlexRow>

        <SpacerColumn size={2} />

        <PrimaryButton
          disabled={isProcessing}
          fullWidth
          text="Sign & Create"
          testID="sign-create-token"
          onPress={createTokenSign}
        />

        <SpacerColumn size={2} />

        <SecondaryButton
          fullWidth
          size="M"
          disabled={isProcessing}
          text="Cancel"
          onPress={cancel}
        />

        <SpacerColumn size={2} />
      </ModalBase>

      <ModalBase
        onClose={() => setIsShowModal(false)}
        label="Successful payment"
        visible={isShowModal}
        width={480}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={projectSuccessPaymentPNG}
            style={{
              width: 124,
              height: 124,
              marginVertical: layout.spacing_x3,
            }}
          />

          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            You have successfully created Token: {createTokenFormBasics?.name}
          </BrandText>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
              paddingVertical: layout.spacing_x2,
              marginTop: layout.spacing_x2,
              borderTopColor: neutral33,
              borderTopWidth: 1,
            }}
          >
            <SecondaryButtonOutline
              size="SM"
              text="Back to Token Page"
              backgroundColor={neutral00}
              onPress={() => {
                setIsShowModal(false);
                navigation.navigate("LaunchpadERC20Tokens", {
                  network: networkId,
                });
              }}
            />
            <PrimaryButton
              size="SM"
              color={neutralFF}
              text="Publish in Social Feed"
            />
          </View>
        </View>
      </ModalBase>
    </View>
  );
};
