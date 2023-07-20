import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { emptyGigInfo, GigInfo } from "./types/fields";
import { ScreenContainer } from "../../components/ScreenContainer";
import { GigCreationBody } from "../../components/freelanceServices/GigCreation/GigCreationBody";
import { GigCreationFooter } from "../../components/freelanceServices/GigCreation/GigCreationFooter";
import { GigCreationHeader } from "../../components/freelanceServices/GigCreation/GigCreationHeader";
import {
  TeritoriSellerQueryClient,
  TeritoriSellerClient,
} from "../../contracts-clients/teritori-freelance/TeritoriSeller.client";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
  getKeplrSigningCosmWasmClient,
} from "../../networks";
import { mustGetFreelanceClient } from "../../utils/backend";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { GigStep } from "../../utils/types/freelance";

export const FreelanceServicesGigCreationScreen: ScreenFC<
  "FreelanceServicesGigCreation"
> = ({ route }) => {
  const [currentStep, setCurrentStep] = useState<GigStep>(GigStep.OverView);
  const [step, setStep] = useState<GigStep>(GigStep.OverView);
  const [gigInfo, setGigInfo] = useState<GigInfo>(emptyGigInfo);
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  useEffect(() => {
    const getGigData = async () => {
      if (route.params && route.params.gigId! >= 0) {
        const freelanceClient = mustGetFreelanceClient(networkId);
        const res = await freelanceClient.GigData({ id: route.params.gigId });
        if (res.gig) {
          const _gigInfo = JSON.parse(res.gig.gigData) as GigInfo;
          _gigInfo.id = route.params.gigId;
          setGigInfo(_gigInfo);
        }
      }
    };
    getGigData();
  }, [route.params, networkId]);
  useEffect(() => {
    const setProfileIpfs = async () => {
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const network = mustGetCosmosNetwork(networkId);
      const sellerQueryClient = new TeritoriSellerQueryClient(
        cosmwasmClient,
        network.freelanceSellerAddress!
      );
      const profileHash = await sellerQueryClient.getSellerProfile(
        selectedWallet?.address!
      );
      setGigInfo((g) => ({ ...g, profileHash }));
    };
    setProfileIpfs();
  }, [selectedWallet, networkId]);

  const nextStep = async () => {
    if (currentStep === GigStep.Publish) {
      if (!selectedWallet) return;
      const walletAddress = selectedWallet.address;
      const signingClient = await getKeplrSigningCosmWasmClient(networkId);
      const network = mustGetCosmosNetwork(networkId);
      const sellerClient = new TeritoriSellerClient(
        signingClient,
        walletAddress,
        network.freelanceSellerAddress!
      );

      const addGigRes = await sellerClient.addGig({
        seller: walletAddress,
        gigInfo: JSON.stringify(gigInfo),
      });
      if (addGigRes) {
        navigation.navigate("FreelanceServicesHomeSeller");
      } else {
        console.log("failed to add gig into contract");
      }

      // uploadJSONToIPFS(gigInfo).then(async (ipfsHash) => {
      //   const walletAddress = (await getFirstKeplrAccount()).address;
      //   const addGigRes = await addGigToContract(walletAddress, ipfsHash);
      //   if (!addGigRes) {
      //     setToastError({
      //       title: "Fail",
      //       message: "Fail transaction",
      //     });
      //     return;
      //   }
      //   navigation.navigate("FreelanceServicesHomeSeller");
      // });
      return;
    }
    if (currentStep === GigStep.OverView) {
      //verify
      if (
        !gigInfo.title.trim() ||
        !gigInfo.category ||
        !gigInfo.subCategory ||
        gigInfo.positiveKeywords.length === 0
      ) {
        return;
      }
    }
    if (currentStep === GigStep.Pricing) {
      //verify
      if (
        !gigInfo.basicPackage.title.trim() ||
        !gigInfo.basicPackage.desc.trim() ||
        !gigInfo.basicPackage.price.trim() ||
        !gigInfo.standardPackage.title.trim() ||
        !gigInfo.standardPackage.desc.trim() ||
        !gigInfo.standardPackage.price.trim() ||
        !gigInfo.premiumPackage.title.trim() ||
        !gigInfo.premiumPackage.desc.trim() ||
        !gigInfo.premiumPackage.price.trim()
      ) {
        return;
      }
    }
    if (currentStep === GigStep.Description) {
      //verify
      if (!gigInfo.description.trim()) {
        return;
      }
    }
    if (currentStep === GigStep.Gallery) {
      //verify
      if (gigInfo.images.length === 0 || !gigInfo.approveLicense) {
        return;
      }
    }

    if (currentStep === step) {
      setStep(step + 1);
    }
    setCurrentStep(currentStep + 1);
  };
  return (
    <ScreenContainer fullWidth noMargin>
      <View style={{ marginLeft: 35, zIndex: 1 }}>
        <GigCreationHeader
          currentStep={currentStep}
          step={step}
          setCurrentStep={setCurrentStep}
        />
        <GigCreationBody
          step={currentStep}
          gigInfo={gigInfo}
          setGig={setGigInfo}
        />
      </View>
      <GigCreationFooter nextStep={nextStep} step={currentStep} />
    </ScreenContainer>
  );
};
