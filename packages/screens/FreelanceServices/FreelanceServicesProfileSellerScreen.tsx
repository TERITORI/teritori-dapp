import axios from "axios";
import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { emptySeller, SellerInfo } from "./types/fields";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ProfileBody } from "../../components/freelanceServices/Profile/ProfileBody";
import { ProfileFooter } from "../../components/freelanceServices/Profile/ProfileFooter";
import { ProfileHeader } from "../../components/freelanceServices/Profile/ProfileHeader";
import { useFeedbacks } from "../../context/FeedbacksProvider";
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
  getUserId,
} from "../../networks";
import { ipfsURLToHTTPURL, uploadJSONToIPFS } from "../../utils/ipfs";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { ProfileStep } from "../../utils/types/freelance";

export const FreelanceServicesProfileSellerScreen: ScreenFC<
  "FreelanceServicesProfileSeller"
> = () => {
  const selectedWallet = useSelectedWallet();
  const [currentStep, setCurrentStep] = useState<ProfileStep>(
    ProfileStep.PersonalInfo
  );
  const [step, setStep] = useState<ProfileStep>(ProfileStep.PersonalInfo);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo>(emptySeller);
  const navigation = useAppNavigation();

  const { setToastError } = useFeedbacks();
  const networkId = useSelectedNetworkId();
  const userId = getUserId(networkId, selectedWallet?.address);

  useEffect(() => {
    const getSellerInfo = async (address: string) => {
      try {
        const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
        const network = mustGetCosmosNetwork(networkId);
        const sellerQueryClient = new TeritoriSellerQueryClient(
          cosmwasmClient,
          network.freelanceSellerAddress!
        );
        const profileHash = await sellerQueryClient.getSellerProfile(address);

        if (!profileHash) return;

        const profile_json_res = await axios.get(ipfsURLToHTTPURL(profileHash));
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
    getSellerInfo(selectedWallet?.address!);
  }, [selectedWallet, networkId]);

  const nextStep = async () => {
    if (currentStep === ProfileStep.AccountSecurity) {
      try {
        const uploadedJson = await uploadJSONToIPFS(
          sellerInfo,
          networkId,
          userId
        );
        if (!uploadedJson?.url) {
          setToastError({
            title: "Failed",
            message: "Failed to upload Profile",
          });
          return;
        }
        // store  UserSeller to ipfs and db
        const walletAddress = selectedWallet?.address!;
        const signingClient = await getKeplrSigningCosmWasmClient(networkId);
        const network = mustGetCosmosNetwork(networkId);
        const sellerClient = new TeritoriSellerClient(
          signingClient,
          walletAddress,
          network.freelanceSellerAddress!
        );

        const updatedProfileRes = await sellerClient.updateSellerProfile({
          seller: walletAddress,
          ipfsHash: uploadedJson.url,
        });

        if (updatedProfileRes) {
          navigation.navigate("FreelanceServicesHomeSeller");
        }
      } catch (e) {
        if (e instanceof Error) {
          setToastError({
            title: "Transaction Failed",
            message: e.message,
          });
        }
      }
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
    <ScreenContainer fullWidth noMargin>
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
    </ScreenContainer>
  );
};
