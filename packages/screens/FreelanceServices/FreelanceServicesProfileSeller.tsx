import React, {useState} from "react";

import {ScreenFC, useAppNavigation} from "../../utils/navigation";
import {FreelanceServicesScreenWrapper} from "./FreelanceServicesScreenWrapper";
import {ProfileHeader} from "../../components/freelanceServices/Profile/ProfileHeader";
import {View} from "react-native";
import {ProfileBody} from "../../components/freelanceServices/Profile/ProfileBody";
import {ProfileFooter} from "../../components/freelanceServices/Profile/ProfileFooter";
import {ProfileStep} from "../../utils/types/freelance";
import {emptySeller, SellerInfo} from "./types/fields";
import {uploadJSONToIPFS} from "../../utils/ipfs";
import {sellerprofileBackendClient} from "../../utils/backend";
import {getFirstKeplrAccount, getSigningCosmWasmClient} from "../../utils/keplr";
import {useFeedbacks} from "../../context/FeedbacksProvider";

export const FreelanceServicesProfileSeller: ScreenFC<"FreelanceServicesProfileSeller"> = () => {
  const [currentStep, setCurrentStep] = useState<ProfileStep>(ProfileStep.PersonalInfo)
  const [step, setStep] = useState<ProfileStep>(ProfileStep.PersonalInfo);
  const [sellerInfo,setSellerInfo] = useState<SellerInfo>(emptySeller);
  const navigation = useAppNavigation();

  const { setToastError, setToastSuccess } = useFeedbacks();

  const nextStep = ()=>{
    if ( currentStep === ProfileStep.AccountSecurity ){
      // store  UserSeller to ipfs and db
      uploadJSONToIPFS(sellerInfo).then(async (ipfsHash)=>{
        const walletAddress = (await getFirstKeplrAccount()).address;

        const contractAddress = process.env
          .TERITORI_SELLER_PROFILE_CONTRACT_ADRESS as string;

        const msg = {
          update_seller_profile: {
            seller_id: walletAddress,
            ipfs_hash: ipfsHash,
          },
        } as any;
        try{
          const signingClient = await getSigningCosmWasmClient();
          const walletAddress = (await getFirstKeplrAccount()).address;
          const updatedProfileRes = await signingClient.execute(
            walletAddress!,
            contractAddress,
            msg,
            "auto"
          );
          if (updatedProfileRes){
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
            })
          }
        }catch(e){
          if (e instanceof Error) {
            setToastError({
              title: "Transaction Failed",
              message: e.message,
            });
          }
        }

        navigation.navigate("FreelanceServicesHomeSeller");
      })
      return;
    }

    if (currentStep == ProfileStep.PersonalInfo){ //verify
        if (!sellerInfo.firstName.trim() || !sellerInfo.lastName.trim()){
          return;
        }
    }

    if (currentStep === step){
      setStep(step + 1);
    }
    setCurrentStep ( currentStep + 1);

  }

  return (
    <FreelanceServicesScreenWrapper>
      <View style={{marginLeft: 35, zIndex: 1}}>
        <ProfileHeader currentStep={ currentStep } step={step} setCurrentStep = {setCurrentStep} />
        <ProfileBody step={ currentStep } seller={sellerInfo} setSeller={setSellerInfo} />
      </View>
      <ProfileFooter step={currentStep} nextStep={nextStep}/>
    </FreelanceServicesScreenWrapper>
  );
};

