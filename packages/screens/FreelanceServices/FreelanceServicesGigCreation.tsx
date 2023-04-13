import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { GigCreationBody } from "../../components/freelanceServices/GigCreation/GigCreationBody";
import { GigCreationFooter } from "../../components/freelanceServices/GigCreation/GigCreationFooter";
import { GigCreationHeader } from "../../components/freelanceServices/GigCreation/GigCreationHeader";
import { useSelectedNetwork } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { freelanceClient } from "../../utils/backend";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { GigStep } from "../../utils/types/freelance";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { getSellerIpfsHash } from "./contract";
import { emptyGigInfo, GigInfo } from "./types/fields";

export const FreelanceServicesGigCreation: ScreenFC<
  "FreelanceServicesGigCreation"
> = ({ route }) => {
  const [currentStep, setCurrentStep] = useState<GigStep>(GigStep.OverView);
  const [step, setStep] = useState<GigStep>(GigStep.OverView);
  const [gigInfo, setGigInfo] = useState<GigInfo>(emptyGigInfo);
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetwork();
  useEffect(() => {
    const getGigData = async () => {
      if (route.params && route.params.gigId! >= 0) {
        const res = await freelanceClient.gigData({ id: route.params.gigId });
        if (res.gig) {
          const _gigInfo = JSON.parse(res.gig.data) as GigInfo;
          _gigInfo.id = route.params.gigId;
          setGigInfo(_gigInfo);
        }
      }
    };
    getGigData();
  }, [route.params]);
  useEffect(() => {
    const setProfileIpfs = async () => {
      if (!gigInfo) return;
      const profileHash = await getSellerIpfsHash(selectedWallet?.address!);
      setGigInfo({ ...gigInfo, profileHash });
    };
    setProfileIpfs();
  }, [selectedWallet]);
  const nextStep = async () => {
    if (currentStep === GigStep.Publish) {
      if (!selectedWallet || !selectedNetwork) return;
      const _gigInfo = { ...gigInfo };
      const walletAddress = selectedWallet.address;
      _gigInfo.address = {
        address: walletAddress,
        network: selectedNetwork,
      };

      await freelanceClient.addGig({
        address: walletAddress,
        data: JSON.stringify(gigInfo),
      });
      navigation.navigate("FreelanceServicesHomeSeller");
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
    <FreelanceServicesScreenWrapper>
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
    </FreelanceServicesScreenWrapper>
  );
};
