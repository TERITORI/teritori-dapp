import axios from "axios";
import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { ProfileBody } from "../../components/freelanceServices/Profile/ProfileBody";
import { ProfileFooter } from "../../components/freelanceServices/Profile/ProfileFooter";
import { ProfileHeader } from "../../components/freelanceServices/Profile/ProfileHeader";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useWallets } from "../../context/WalletsProvider";
import { sellerprofileBackendClient } from "../../utils/backend";
import { ipfsPinataUrl, uploadJSONToIPFS } from "../../utils/ipfs";
import { getFirstKeplrAccount } from "../../utils/keplr";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { ProfileStep } from "../../utils/types/freelance";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { getSellerIpfsHash, updateSellerProfileToContract } from "./contract";
import { emptySeller, SellerInfo } from "./types/fields";

export const FreelanceServicesProfileSeller: ScreenFC<
  "FreelanceServicesProfileSeller"
> = () => {
  const { wallets } = useWallets();
  const [currentStep, setCurrentStep] = useState<ProfileStep>(
    ProfileStep.PersonalInfo
  );
  const [step, setStep] = useState<ProfileStep>(ProfileStep.PersonalInfo);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo>(emptySeller);
  const navigation = useAppNavigation();

  const { setToastError } = useFeedbacks();

  useEffect(() => {
    if (wallets.length > 0) {
      getSellerInfo(wallets[0].address);
    }
  }, [wallets]);
  const getSellerInfo = async (address: string) => {
    try {
      const ipfs_hash = await getSellerIpfsHash(address);
      if (!ipfs_hash) return;

      const profile_json_res = await axios.get(ipfsPinataUrl(ipfs_hash));
      if (profile_json_res.status !== 200) return;
      const profile_json = profile_json_res.data;
      setSellerInfo({
        id: profile_json.id,
        avatar: profile_json.avatar,
        firstName: profile_json.firstName,
        lastName: profile_json.lastName,
        description: profile_json.description,
        profilePicture: profile_json.profilePicture,
        occupations: profile_json.occupations,
        languages: profile_json.languages,
        skills: profile_json.skills,
        educations: profile_json.educations,
        certifications: profile_json.certifications,
        personalSite: profile_json.personalSite,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const nextStep = () => {
    if (currentStep === ProfileStep.AccountSecurity) {
      // store  UserSeller to ipfs and db
      uploadJSONToIPFS(sellerInfo).then(async (ipfsHash) => {
        try {
          const walletAddress = (await getFirstKeplrAccount()).address;
          const updatedProfileRes = await updateSellerProfileToContract(
            walletAddress,
            ipfsHash
          );
          if (updatedProfileRes) {
            const obserable = sellerprofileBackendClient.updateProfile({
              sellerId: walletAddress,
              profileHash: ipfsHash,
            });
            obserable.subscribe((ret) => {
              if (ret.result === 0) {
                console.log("successful");
              } else {
                console.log("failed: ", ret.result);
              }
            });
          }
          navigation.navigate("FreelanceServicesHomeSeller");
        } catch (e) {
          if (e instanceof Error) {
            setToastError({
              title: "Transaction Failed",
              message: e.message,
            });
          }
        }
      });
      return;
    }

    if (currentStep === ProfileStep.PersonalInfo) {
      //verify
      if (!sellerInfo.firstName.trim() || !sellerInfo.lastName.trim()) {
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
        <ProfileHeader
          currentStep={currentStep}
          step={step}
          setCurrentStep={setCurrentStep}
        />
        <ProfileBody
          step={currentStep}
          seller={sellerInfo}
          setSeller={setSellerInfo}
        />
      </View>
      <ProfileFooter step={currentStep} nextStep={nextStep} />
    </FreelanceServicesScreenWrapper>
  );
};
