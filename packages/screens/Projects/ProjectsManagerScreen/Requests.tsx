import React, { useState } from "react";
import { View } from "react-native";

import githubSVG from "../../../../assets/icons/github.svg";
import FlexRow from "../../../components/FlexRow";
import ModalBase from "../../../components/modals/ModalBase";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { ProjectStatusTag } from "../components/ProjectStatusTag";
import { useProjects } from "../hooks/useProjects";
import { ContractStatus, Project } from "../types";

import { BrandText } from "@/components/BrandText";
import { Link } from "@/components/Link";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { PrimaryButtonOutline } from "@/components/buttons/PrimaryButtonOutline";
import { SocialButton } from "@/components/buttons/SocialButton";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { Separator } from "@/components/separators/Separator";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { useEscrowContract } from "../hooks/useEscrowContract";
import { useAppNavigation } from "@/utils/navigation";
import {
  neutral17,
  neutralA3,
  primaryColor,
  redDefault,
} from "@/utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type RequestType = "requestsByBuilders" | "requestsByInvestors";

const Spacing = () => {
  return (
    <Separator horizontal style={{ marginHorizontal: layout.spacing_x1_5 }} />
  );
};

const RequestItem: React.FC<{
  project: Project;
  networkId: string;
  walletAddress: string;
  requestType: RequestType;
}> = ({ project, networkId, walletAddress, requestType }) => {
  const navigation = useAppNavigation();

  const { execEscrowMethod } = useEscrowContract(networkId, walletAddress);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const gotoProjectDetail = (project: Project) => {
    navigation.navigate("ProjectsDetail", { id: project.id });
  };

  const acceptContract = async (project: Project) => {
    setIsProcessing(true);
    await execEscrowMethod("AcceptContract", [project.id.toString()]);
    setIsProcessing(false);
  };

  const rejectContract = async (project: Project, rejectReason: string) => {
    setIsProcessing(true);
    await execEscrowMethod("RejectContract", [
      project.id.toString(),
      rejectReason,
    ]);
    setIsProcessing(false);
  };

  return (
    <>
      <TertiaryBox
        style={{
          backgroundColor: neutral17,
          marginTop: layout.spacing_x1_5,
          paddingVertical: layout.spacing_x1_5,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <FlexRow>
          <View style={{ flexGrow: 1, flex: 5 }}>
            <BrandText
              onPress={() => gotoProjectDetail(project)}
              style={fontSemibold14}
            >
              {project.metadata.shortDescData.name}
            </BrandText>

            <BrandText
              onPress={() => gotoProjectDetail(project)}
              style={[fontSemibold14, { color: neutralA3 }]}
            >
              {project.metadata.shortDescData.desc}
            </BrandText>
          </View>

          <Spacing />

          <View style={{ flex: 2 }}>
            <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
              Grant
            </BrandText>

            <BrandText style={[fontSemibold14, { color: primaryColor }]}>
              ${project.metadata.shortDescData.budget}
            </BrandText>
          </View>

          <Spacing />

          <View style={{ flex: 4 }}>
            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              {requestType === "requestsByBuilders" && "Builder"}
              {requestType === "requestsByInvestors" && "Investor"}
            </BrandText>

            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              {requestType === "requestsByBuilders" && project.contractor}
              {requestType === "requestsByInvestors" && project.funder}
            </BrandText>
          </View>

          <Spacing />

          <View style={{ flex: 2 }}>
            <BrandText
              style={[
                fontSemibold13,
                { color: neutralA3, textAlign: "center" },
              ]}
            >
              Milestones
            </BrandText>

            <BrandText
              style={[
                fontSemibold13,
                { color: neutralA3, textAlign: "center" },
              ]}
            >
              {project.milestones.length}
            </BrandText>
          </View>

          <Spacing />

          <View style={{ flex: 2 }}>
            <ProjectStatusTag size="XS" status={project.status} />
          </View>

          <Spacing />

          <View style={{ flex: 1 }}>
            <Link to={project.metadata.teamAndLinkData.githubLink}>
              <SocialButton
                iconSvg={githubSVG}
                style={{
                  marginRight: layout.spacing_x2,
                }}
                bgColor={neutral17}
              />
            </Link>
          </View>

          <FlexRow style={{ flex: 4 }}>
            {project.status === ContractStatus.CREATED && (
              <>
                <PrimaryButtonOutline
                  disabled={isProcessing}
                  noBrokenCorners
                  color={redDefault}
                  size="SM"
                  text="Reject"
                  style={{ marginRight: layout.spacing_x1_5 }}
                  onPress={() => setIsShowModal(true)}
                />

                <PrimaryButtonOutline
                  disabled={isProcessing}
                  noBrokenCorners
                  color={primaryColor}
                  size="SM"
                  text="Accept"
                  onPress={() => acceptContract(project)}
                />
              </>
            )}

            {project.status === ContractStatus.REJECTED && (
              <BrandText style={[fontSemibold14, { color: redDefault }]}>
                {project.rejectReason}
              </BrandText>
            )}
          </FlexRow>
        </FlexRow>
      </TertiaryBox>

      <ModalBase
        onClose={() => setIsShowModal(false)}
        label="Reason for rejection"
        visible={isShowModal}
        width={480}
      >
        <TextInputCustom
          label=""
          hideLabel
          name="rejectReason"
          fullWidth
          multiline
          placeholder="Type your reason for rejection here..."
          textInputStyle={{ height: 40 }}
          noBrokenCorners
          onChangeText={setRejectReason}
          value={rejectReason}
        />

        <PrimaryButton
          fullWidth
          text="Reject"
          color={redDefault}
          size="SM"
          boxStyle={{ marginVertical: layout.spacing_x2 }}
          onPress={() => rejectContract(project, rejectReason)}
        />
      </ModalBase>
    </>
  );
};

export const Requests: React.FC<{
  type: RequestType;
}> = ({ type }) => {
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  const funder =
    type === "requestsByBuilders" ? selectedWallet?.address : "ALL";
  const contractor =
    type === "requestsByInvestors" ? selectedWallet?.address : "ALL";

  const { data: projects } = useProjects(
    networkId,
    0,
    100, // TODO: hardcoded to 100 projects for now, make it dynamic later
    funder,
    contractor,
  );

  if (!selectedWallet?.address) {
    return null;
  }

  const adjustedProjects =
    type === "requestsByBuilders"
      ? projects.filter((p) => p.sender === p.contractor)
      : projects.filter((p) => p.sender === p.funder);

  return (
    <>
      {adjustedProjects.map((project: Project) => {
        return (
          <RequestItem
            key={project.id}
            project={project}
            networkId={networkId}
            walletAddress={selectedWallet?.address}
            requestType={type}
          />
        );
      })}
    </>
  );
};
