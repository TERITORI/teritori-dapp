import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { GigCreationBody } from "../../components/freelanceServices/GigCreation/GigCreationBody";
import { GigCreationFooter } from "../../components/freelanceServices/GigCreation/GigCreationFooter";
import { GigCreationHeader } from "../../components/freelanceServices/GigCreation/GigCreationHeader";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { uploadJSONToIPFS } from "../../utils/ipfs";
import { getFirstKeplrAccount } from "../../utils/keplr";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { GigStep } from "../../utils/types/freelance";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { addGigToContract, getSellerIpfsHash } from "./contract";
import { emptyGigInfo, GigInfo } from "./types/fields";

export const FreelanceServicesGigCreation: ScreenFC<
  "FreelanceServicesGigCreation"
> = () => {
  const [currentStep, setCurrentStep] = useState<GigStep>(GigStep.OverView);
  const [step, setStep] = useState<GigStep>(GigStep.OverView);
  const [gigInfo, setGigInfo] = useState<GigInfo>(emptyGigInfo);
  const navigation = useAppNavigation();
  const { setToastError } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  useEffect(() => {
    const setProfileIpfs = async () => {
      if (!gigInfo) return;
      const profileHash = await getSellerIpfsHash(selectedWallet?.address!);
      setGigInfo({ ...gigInfo, profileHash });
    };
    setProfileIpfs();
  }, [gigInfo, selectedWallet]);
  const nextStep = () => {
    if (currentStep === GigStep.Publish) {
      uploadJSONToIPFS(gigInfo).then(async (ipfsHash) => {
        const walletAddress = (await getFirstKeplrAccount()).address;
        const addGigRes = await addGigToContract(walletAddress, ipfsHash);
        if (!addGigRes) {
          setToastError({
            title: "Fail",
            message: "Fail transaction",
          });
          return;
        }
        navigation.navigate("FreelanceServicesHomeSeller");
      });
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
