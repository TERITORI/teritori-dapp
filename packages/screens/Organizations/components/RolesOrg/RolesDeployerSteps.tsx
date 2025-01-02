import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { View } from "react-native";

import { RolesMembersSettingsSection } from "./RolesMembersSettingsSection";
import { RolesReviewInformationSection } from "./RolesReviewInformationSection";
import { RolesSettingsSection } from "./RolesSettingsSection";
import { LaunchingOrganizationSection } from "../LaunchingOrganizationSection";

import { ConfigureVotingSection } from "@/components/dao/ConfigureVotingSection";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { nsNameInfoQueryKey } from "@/hooks/useNSNameInfo";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  getNetwork,
  getUserId,
  mustGetCosmosNetwork,
  NetworkKind,
} from "@/networks";
import { createDaoMemberBased, CreateDaoMemberBasedParams } from "@/utils/dao";
import { adenaDeployGnoDAO } from "@/utils/gnodao/deploy";
import { getDuration, getPercent } from "@/utils/gnodao/helpers";
import {
  ConfigureVotingFormType,
  CreateDaoFormType,
  LAUNCHING_PROCESS_STEPS,
  ROLES_BASED_ORGANIZATION_STEPS,
  RolesFormType,
  RolesMembersFormType,
  ZodRolesMembersObject,
  ZodRolesObject,
} from "@/utils/types/organizations";

export const RolesDeployerSteps: React.FC<{
  currentStep: number;
  setCurrentStep: (step: number) => void;
  launchingStep: number;
  setLaunchingStep: (step: number) => void;
  organizationData: CreateDaoFormType | undefined;
  setOrganizationData: (data: CreateDaoFormType | undefined) => void;
}> = ({
  currentStep,
  setCurrentStep,
  launchingStep,
  setLaunchingStep,
  organizationData,
  setOrganizationData,
}) => {
  const selectedWallet = useSelectedWallet();
  const [daoAddress, setDAOAddress] = useState("");
  const network = getNetwork(selectedWallet?.networkId);
  const queryClient = useQueryClient();
  const { setToast } = useFeedbacks();
  const rolesMembersForm = useForm<RolesMembersFormType>({
    resolver: zodResolver(ZodRolesMembersObject),
    defaultValues: {
      members: selectedWallet?.address
        ? [
            {
              addr: selectedWallet?.address,
              weight: "0",
              roles: "",
            },
          ]
        : [],
    },
  });
  const rolesForm = useForm<RolesFormType>({
    resolver: zodResolver(ZodRolesObject),
    defaultValues: {
      roles: [],
    },
  });
  const membersField = useFieldArray({
    control: rolesMembersForm.control,
    name: "members",
  });
  const rolesField = useFieldArray({
    control: rolesForm.control,
    name: "roles",
  });

  const [configureVotingFormData, setConfigureVotingFormData] =
    useState<ConfigureVotingFormType>();
  // const [rolesSettingsFormData, setRolesSettingsFormData] =
  //   useState<RolesSettingFormType>();
  // const [memberSettingsFormData, setMemberSettingsFormData] =
  //   useState<RolesMemberSettingFormType>();

  const createDaoContract = async (): Promise<boolean> => {
    try {
      switch (network?.kind) {
        case NetworkKind.Gno: {
          const name = organizationData?.associatedHandle!;
          const roles =
            rolesField?.fields?.map((role) => ({
              name: role.name.trim(),
              color: role.color,
              resources: role.resources,
            })) || [];
          const initialMembers = (membersField?.fields || []).map((member) => ({
            address: member.addr,
            weight: parseInt(member.weight, 10),
            roles: member.roles
              ? member.roles.split(",").map((role) => role.trim())
              : [],
          }));
          const pkgPath = await adenaDeployGnoDAO(
            network.id,
            selectedWallet?.address!,
            organizationData?.structure!,
            {
              name,
              maxVotingPeriodSeconds:
                parseInt(configureVotingFormData?.days!, 10) * 24 * 60 * 60,
              roles,
              initialMembers,
              thresholdPercent:
                configureVotingFormData?.minimumApprovalPercent!,
              quorumPercent: configureVotingFormData?.supportPercent!,
              displayName: organizationData?.organizationName!,
              description: organizationData?.organizationDescription!,
              imageURI: organizationData?.imageUrl!,
            },
          );
          setLaunchingStep(1);
          setDAOAddress(pkgPath);
          return true;
        }
        case NetworkKind.Cosmos: {
          if (
            !selectedWallet ||
            !organizationData ||
            !configureVotingFormData
          ) {
            return false;
          }

          const networkId = selectedWallet.networkId;
          const network = mustGetCosmosNetwork(networkId);
          const cwAdminFactoryContractAddress =
            network.cwAdminFactoryContractAddress!;
          const walletAddress = selectedWallet.address;

          if (!membersField.fields) return false;
          const params: CreateDaoMemberBasedParams = {
            networkId,
            sender: walletAddress,
            contractAddress: cwAdminFactoryContractAddress,
            daoCoreCodeId: network.daoCoreCodeId!,
            daoPreProposeSingleCodeId: network.daoPreProposeSingleCodeId!,
            daoProposalSingleCodeId: network.daoProposalSingleCodeId!,
            cw4GroupCodeId: network.cw4GroupCodeId!,
            daoVotingCw4CodeId: network.daoVotingCw4CodeId!,
            name: organizationData.organizationName,
            description: organizationData.organizationDescription,
            tns: organizationData.associatedHandle,
            imageUrl: organizationData.imageUrl,
            members: membersField.fields.map((value) => ({
              addr: value.addr,
              weight: parseInt(value.weight, 10),
            })),
            quorum: getPercent(configureVotingFormData.supportPercent),
            threshold: getPercent(
              configureVotingFormData.minimumApprovalPercent,
            ),
            maxVotingPeriod: getDuration(
              configureVotingFormData.days,
              configureVotingFormData.hours,
              configureVotingFormData.minutes,
            ),
            onStepChange: setLaunchingStep,
          };
          const { daoAddress, executeResult } = await createDaoMemberBased(
            params,
            "auto",
          );
          const createDaoRes = executeResult;
          setDAOAddress(daoAddress);
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
  const onSubmitConfigureVoting = (data: ConfigureVotingFormType) => {
    setConfigureVotingFormData(data);
    setCurrentStep(2);
  };

  const onSubmitRolesSettings = () => {
    setCurrentStep(3);
  };

  const onSubmitMemberSettings = () => {
    setCurrentStep(4);
  };

  const onStartLaunchingProcess = async () => {
    setCurrentStep(5);
    if (!(await createDaoContract())) {
      setCurrentStep(4);
      resetForm();
    }
  };

  const resetForm = async () => {
    let tokenId = organizationData?.associatedHandle;
    const network = getNetwork(selectedWallet?.networkId);
    if (network?.kind === NetworkKind.Gno) {
      tokenId += ".gno";
    } else if (network?.kind === NetworkKind.Cosmos) {
      tokenId += network.nameServiceTLD || "";
    }
    await queryClient.invalidateQueries(
      nsNameInfoQueryKey(selectedWallet?.networkId, tokenId),
    );
    setOrganizationData(undefined);
    setConfigureVotingFormData(undefined);
    setCurrentStep(0);
    setDAOAddress("");
    setLaunchingStep(0);
  };

  return (
    <>
      <View
        style={
          currentStep === 1 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <ConfigureVotingSection
          steps={ROLES_BASED_ORGANIZATION_STEPS}
          onSubmit={onSubmitConfigureVoting}
        />
      </View>
      <View
        style={
          currentStep === 2 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <RolesSettingsSection
          remove={rolesField.remove}
          append={rolesField.append}
          roles={rolesField.fields}
          handleSubmit={rolesForm.handleSubmit(onSubmitRolesSettings)}
        />
      </View>
      <View
        style={
          currentStep === 3 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <RolesMembersSettingsSection
          members={membersField.fields}
          append={membersField.append}
          control={rolesMembersForm.control}
          remove={membersField.remove}
          handleSubmit={rolesMembersForm.handleSubmit(onSubmitMemberSettings)}
        />
      </View>
      <View
        style={
          currentStep === 4 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <RolesReviewInformationSection
          organizationData={organizationData}
          votingSettingData={configureVotingFormData}
          rolesSettingData={rolesField.fields}
          memberSettingData={membersField.fields}
          onSubmit={onStartLaunchingProcess}
        />
      </View>
      <View
        style={
          currentStep === 5 ? { display: "flex", flex: 1 } : { display: "none" }
        }
      >
        <LaunchingOrganizationSection
          id={getUserId(selectedWallet?.networkId, daoAddress)}
          isLaunched={launchingStep === LAUNCHING_PROCESS_STEPS.length}
          resetForm={resetForm}
        />
      </View>
    </>
  );
};
