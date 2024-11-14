import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import useSelectedWallet from "../../hooks/useSelectedWallet";
import { CreateDAOSection } from "./components/CreateDAOSection";
import { LaunchingOrganizationSection } from "./components/LaunchingOrganizationSection";
import { MemberSettingsSection } from "./components/MemberSettingsSection";
import { ReviewInformationSection } from "./components/ReviewInformationSection";
import { RightSection } from "./components/RightSection";
import { RolesSettingsSection } from "./components/RolesSettingsSection";
import { TokenSettingsSection } from "./components/TokenSettingsSection";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ConfigureVotingSection } from "@/components/dao/ConfigureVotingSection";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { nsNameInfoQueryKey } from "@/hooks/useNSNameInfo";
import {
  getNetwork,
  getUserId,
  mustGetCosmosNetwork,
  NetworkKind,
} from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import {
  createDaoMemberBased,
  CreateDaoMemberBasedParams,
  createDaoTokenBased,
} from "@/utils/dao";
import { adenaDeployGnoDAO } from "@/utils/gnodao/deploy";
import {
  ConfigureVotingFormType,
  CreateDaoFormType,
  DaoType,
  LAUNCHING_PROCESS_STEPS,
  MemberSettingFormType,
  ORGANIZATION_DEPLOYER_STEPS,
  RolesSettingFormType,
  TokenSettingFormType,
} from "@/utils/types/organizations";

export const OrganizationDeployerScreen = () => {
  const selectedWallet = useSelectedWallet();
  const { setToast } = useFeedbacks();
  const [daoAddress, setDAOAddress] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [step1DaoInfoFormData, setStep1DaoInfoFormData] =
    useState<CreateDaoFormType>();
  const [step2ConfigureVotingFormData, setStep2ConfigureVotingFormData] =
    useState<ConfigureVotingFormType>();
  const [step3RoleSettingFormData, setStep3RoleSettingFormData] =
    useState<RolesSettingFormType>();
  const [step4TokenSettingFormData, setStep4TokenSettingFormData] =
    useState<TokenSettingFormType>();
  const [step4MemberSettingFormData, setStep4MemberSettingFormData] =
    useState<MemberSettingFormType>();
  const queryClient = useQueryClient();
  const [launchingStep, setLaunchingStep] = useState(0);
  const getPercent = (num: number | undefined): string => {
    let ret_num: number;
    ret_num = num === undefined ? 0 : num;
    ret_num = ret_num < 0 ? 0 : ret_num;
    ret_num = ret_num > 100 ? 100 : ret_num;
    return (ret_num / 100).toFixed(2);
  };
  const getDuration = (
    days: string | undefined,
    hours: string | undefined,
    minutes: string | undefined,
  ): number => {
    const num_days = !days ? 0 : parseInt(days, 10);
    const num_hours = !hours ? 0 : parseInt(hours, 10);
    const num_minutes = !minutes ? 0 : parseInt(minutes, 10);
    return num_days * 3600 * 24 + num_hours * 3600 + num_minutes * 60;
  };

  const network = getNetwork(selectedWallet?.networkId);

  const createDaoContract = async (): Promise<boolean> => {
    try {
      switch (network?.kind) {
        case NetworkKind.Gno: {
          const name = step1DaoInfoFormData?.associatedHandle!;
          const roles = step3RoleSettingFormData?.roles.map((role) =>
            role.name.trim(),
          ) || [];
          const pkgPath = await adenaDeployGnoDAO(
            network.id,
            selectedWallet?.address!,
            {
              name,
              maxVotingPeriodSeconds:
                parseInt(step2ConfigureVotingFormData?.days!, 10) *
                24 *
                60 *
                60,
              roles,
              initialMembers: (step4MemberSettingFormData?.members || []).map(
                (member) => ({
                  address: member.addr,
                  weight: parseInt(member.weight, 10),
                  roles: member.roles.split(",").map((role) => role.trim()),
                }),
              ),
              thresholdPercent:
                step2ConfigureVotingFormData?.minimumApprovalPercent!,
              quorumPercent: step2ConfigureVotingFormData?.supportPercent!,
              displayName: step1DaoInfoFormData?.organizationName!,
              description: step1DaoInfoFormData?.organizationDescription!,
              imageURI: step1DaoInfoFormData?.imageUrl!,
            },
          );
          setLaunchingStep(1);
          setDAOAddress(pkgPath);
          return true;
        }
        case NetworkKind.Cosmos: {
          if (
            !selectedWallet ||
            !step1DaoInfoFormData ||
            !step2ConfigureVotingFormData
          ) {
            return false;
          }

          const networkId = selectedWallet.networkId;
          const network = mustGetCosmosNetwork(networkId);
          const cwAdminFactoryContractAddress =
            network.cwAdminFactoryContractAddress!;
          const walletAddress = selectedWallet.address;
          const signingClient = await getKeplrSigningCosmWasmClient(networkId);

          let createDaoRes = null;
          if (step1DaoInfoFormData.structure === DaoType.TOKEN_BASED) {
            if (!step4TokenSettingFormData) return false;
            createDaoRes = await createDaoTokenBased(
              {
                client: signingClient,
                sender: walletAddress,
                contractAddress: cwAdminFactoryContractAddress,
                daoPreProposeSingleCodeId: network.daoPreProposeSingleCodeId!,
                daoProposalSingleCodeId: network.daoProposalSingleCodeId!,
                daoCw20CodeId: network.daoCw20CodeId!,
                daoCw20StakeCodeId: network.daoCw20StakeCodeId!,
                daoVotingCw20StakedCodeId: network.daoVotingCw20StakedCodeId!,
                daoCoreCodeId: network.daoCoreCodeId!,
                name: step1DaoInfoFormData.organizationName,
                description: step1DaoInfoFormData.organizationDescription,
                tns: step1DaoInfoFormData.associatedHandle,
                imageUrl: step1DaoInfoFormData.imageUrl,
                tokenName: step4TokenSettingFormData.tokenName,
                tokenSymbol: step4TokenSettingFormData.tokenSymbol,
                tokenHolders: step4TokenSettingFormData.tokenHolders.map(
                  (item) => {
                    return { address: item.address, amount: item.balance };
                  },
                ),
                quorum: getPercent(step2ConfigureVotingFormData.supportPercent),
                threshold: getPercent(
                  step2ConfigureVotingFormData.minimumApprovalPercent,
                ),
                maxVotingPeriod: getDuration(
                  step2ConfigureVotingFormData.days,
                  step2ConfigureVotingFormData.hours,
                  step2ConfigureVotingFormData.minutes,
                ),
              },
              "auto",
            );
          } else if (step1DaoInfoFormData.structure === DaoType.MEMBER_BASED) {
            if (!step4MemberSettingFormData) return false;
            const params: CreateDaoMemberBasedParams = {
              networkId,
              sender: walletAddress,
              contractAddress: cwAdminFactoryContractAddress,
              daoCoreCodeId: network.daoCoreCodeId!,
              daoPreProposeSingleCodeId: network.daoPreProposeSingleCodeId!,
              daoProposalSingleCodeId: network.daoProposalSingleCodeId!,
              cw4GroupCodeId: network.cw4GroupCodeId!,
              daoVotingCw4CodeId: network.daoVotingCw4CodeId!,
              name: step1DaoInfoFormData.organizationName,
              description: step1DaoInfoFormData.organizationDescription,
              tns: step1DaoInfoFormData.associatedHandle,
              imageUrl: step1DaoInfoFormData.imageUrl,
              members: step4MemberSettingFormData.members.map((value) => ({
                addr: value.addr,
                weight: parseInt(value.weight, 10),
              })),
              quorum: getPercent(step2ConfigureVotingFormData.supportPercent),
              threshold: getPercent(
                step2ConfigureVotingFormData.minimumApprovalPercent,
              ),
              maxVotingPeriod: getDuration(
                step2ConfigureVotingFormData.days,
                step2ConfigureVotingFormData.hours,
                step2ConfigureVotingFormData.minutes,
              ),
              onStepChange: setLaunchingStep,
            };
            const { daoAddress, executeResult } = await createDaoMemberBased(
              params,
              "auto",
            );
            createDaoRes = executeResult;
            setDAOAddress(daoAddress);
          } else {
            return false;
          }
          console.log("Res: ", createDaoRes);
          console.log(createDaoRes.transactionHash);
          if (createDaoRes) {
            return true;
          } else {
            console.error("Failed to create DAO");
            setToast({
              title: "Failed to create DAO",
              mode: "normal",
              type: "error",
            });
            return false;
          }
        }
        default: {
          throw new Error("Network not supported " + selectedWallet?.networkId);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to create DAO: ", err);
      if (err instanceof Error) {
        setToast({
          title: "Failed to create DAO",
          message: err.message,
          mode: "normal",
          type: "error",
        });
      }
      return false;
    }
  };
  // functions
  const onSubmitDAO = (data: CreateDaoFormType) => {
    setStep1DaoInfoFormData(data);
    setCurrentStep(1);
  };

  const onSubmitConfigureVoting = (data: ConfigureVotingFormType) => {
    setStep2ConfigureVotingFormData(data);
    setCurrentStep(2);
  };

  const onSubmitRolesSettings = (data: RolesSettingFormType) => {
    setStep3RoleSettingFormData(data);
    setCurrentStep(3);
  };

  const onSubmitTokenSettings = (data: TokenSettingFormType) => {
    setStep4TokenSettingFormData(data);
    setCurrentStep(4);
  };

  const onSubmitMemberSettings = (data: MemberSettingFormType) => {
    const temp = data.members.filter((member) => member.addr !== undefined);
    const processedData: MemberSettingFormType = { members: temp };
    setStep4MemberSettingFormData(processedData);
    setCurrentStep(4);
  };

  const onStartLaunchingProcess = async () => {
    setCurrentStep(5);
    if (!(await createDaoContract())) {
      setCurrentStep(4);
    }
  };

  return (
    <ScreenContainer
      headerChildren={<BrandText>Organization Deployer</BrandText>}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
    >
      <View style={styles.row}>
        <View style={styles.fill}>
          <View style={currentStep === 0 ? styles.show : styles.hidden}>
            <CreateDAOSection onSubmit={onSubmitDAO} />
          </View>

          <View style={currentStep === 1 ? styles.show : styles.hidden}>
            <ConfigureVotingSection onSubmit={onSubmitConfigureVoting} />
          </View>

          <View style={currentStep === 2 ? styles.show : styles.hidden}>
            <RolesSettingsSection onSubmit={onSubmitRolesSettings} />
          </View>

          <View
            style={
              currentStep === 3 &&
                step1DaoInfoFormData &&
                step1DaoInfoFormData.structure === DaoType.TOKEN_BASED
                ? styles.show
                : styles.hidden
            }
          >
            <TokenSettingsSection onSubmit={onSubmitTokenSettings} />
          </View>
          <View
            style={
              currentStep === 3 &&
                step1DaoInfoFormData &&
                step1DaoInfoFormData.structure === DaoType.MEMBER_BASED
                ? styles.show
                : styles.hidden
            }
          >
            <MemberSettingsSection onSubmit={onSubmitMemberSettings} />
          </View>

          <View style={currentStep === 4 ? styles.show : styles.hidden}>
            <ReviewInformationSection
              organizationData={step1DaoInfoFormData}
              votingSettingData={step2ConfigureVotingFormData}
              tokenSettingData={step4TokenSettingFormData}
              memberSettingData={step4MemberSettingFormData}
              rolesSettingData={step3RoleSettingFormData}
              onSubmit={onStartLaunchingProcess}
            />
          </View>

          <View style={currentStep === 5 ? styles.show : styles.hidden}>
            <LaunchingOrganizationSection
              id={getUserId(selectedWallet?.networkId, daoAddress)}
              isLaunched={launchingStep === LAUNCHING_PROCESS_STEPS.length}
              resetForm={async () => {
                let tokenId = step1DaoInfoFormData?.associatedHandle;
                const network = getNetwork(selectedWallet?.networkId);
                if (network?.kind === NetworkKind.Gno) {
                  tokenId += ".gno";
                } else if (network?.kind === NetworkKind.Cosmos) {
                  tokenId += network.nameServiceTLD || "";
                }
                await queryClient.invalidateQueries(
                  nsNameInfoQueryKey(selectedWallet?.networkId, tokenId),
                );
                setStep1DaoInfoFormData(undefined);
                setStep2ConfigureVotingFormData(undefined);
                setStep3RoleSettingFormData(undefined);
                setStep4MemberSettingFormData(undefined);
                setStep4TokenSettingFormData(undefined);
                setCurrentStep(0);
                setDAOAddress("");
                setLaunchingStep(0);
              }}
            />
          </View>
        </View>

        <RightSection
          steps={ORGANIZATION_DEPLOYER_STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          isLaunching={currentStep === 5}
          launchingCompleteStep={launchingStep}
        />
      </View>
    </ScreenContainer>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  row: { flexDirection: "row", flex: 1 },
  fill: { flex: 1 },
  hidden: { display: "none" },
  show: { display: "flex", flex: 1 },
});
