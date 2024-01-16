import React, { useState } from "react";
import { View } from "react-native";

import githubSVG from "../../../../assets/icons/github.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { Link } from "../../../components/Link";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { Separator } from "../../../components/separators/Separator";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { mustGetGnoNetwork } from "../../../networks";
import { adenaVMCall } from "../../../utils/gno";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral17,
  neutralA3,
  primaryColor,
  redDefault,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ProjectStatusTag } from "../components/ProjectStatusTag";
import { useProjects } from "../hooks/useProjects";
import { useUtils } from "../hooks/useUtils";
import { ContractStatus, Project } from "../types";

type RequestType = "requestsByBuilders" | "requestsByInvestors";

const RequestItem: React.FC<{
  project: Project;
  networkId: string;
  walletAddress: string;
  requestType: RequestType;
}> = ({ project, networkId, walletAddress, requestType }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [isShowModal, setIsShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const navigation = useAppNavigation();

  const { mustGetValue } = useUtils();

  const gotoProjectDetail = (project: Project) => {
    navigation.navigate("ProjectsDetail", { id: project.id });
  };

  const acceptContract = async (project: Project) => {
    setIsProcessing(true);

    const gnoNetwork = mustGetGnoNetwork(networkId);
    const caller = mustGetValue(walletAddress, "caller");
    const escrowPkgPath = mustGetValue(
      gnoNetwork.escrowPkgPath,
      "escrow pkg path",
    );

    try {
      await adenaVMCall(
        networkId,
        {
          caller,
          send: "",
          pkg_path: escrowPkgPath,
          func: "AcceptContract",
          args: ["" + project.id],
        },
        { gasWanted: 2_000_000 },
      );

      setToastSuccess({
        title: "Success",
        message: "Request has been accepted !",
      });
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectContract = async (project: Project, rejectReason: string) => {
    setIsProcessing(true);

    const gnoNetwork = mustGetGnoNetwork(networkId);
    const caller = mustGetValue(walletAddress, "caller");
    const escrowPkgPath = mustGetValue(
      gnoNetwork.escrowPkgPath,
      "escrow pkg path",
    );

    try {
      await adenaVMCall(
        networkId,
        {
          caller,
          send: "",
          pkg_path: escrowPkgPath,
          func: "RejectContract",
          args: ["" + project.id, rejectReason],
        },
        { gasWanted: 2_000_000 },
      );
      setIsShowModal(false);
      setToastSuccess({
        title: "Success",
        message: "Request has been rejected !",
      });
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsProcessing(false);
    }
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

          <Separator
            horizontal
            style={{ marginHorizontal: layout.spacing_x1_5 }}
          />

          <View style={{ flex: 2 }}>
            <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
              Grant
            </BrandText>

            <BrandText style={[fontSemibold14, { color: primaryColor }]}>
              ${project.metadata.shortDescData.budget}
            </BrandText>
          </View>

          <Separator
            horizontal
            style={{ marginHorizontal: layout.spacing_x1_5 }}
          />

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

          <Separator
            horizontal
            style={{ marginHorizontal: layout.spacing_x1_5 }}
          />

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

          <Separator
            horizontal
            style={{ marginHorizontal: layout.spacing_x1_5 }}
          />

          <View style={{ flex: 2 }}>
            <ProjectStatusTag size="XS" status={project.status} />
          </View>

          <Separator
            horizontal
            style={{ marginHorizontal: layout.spacing_x1_5 }}
          />

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
