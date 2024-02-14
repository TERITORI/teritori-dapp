import { Link } from "@react-navigation/native";
import moment from "moment";
import React, { useState } from "react";
import { View } from "react-native";

import { Tag } from "./Milestone";
import { ProjectStatusTag } from "./ProjectStatusTag";
import { ResolveConflictButton } from "./ResolveConflictButton";
import discordSVG from "../../../../assets/icons/discord.svg";
import githubSVG from "../../../../assets/icons/github.svg";
import shareSVG from "../../../../assets/icons/share.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import websiteSVG from "../../../../assets/icons/website.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  errorColor,
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
  yellowDefault,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  ContractStatus,
  Project,
  ShortDescData,
  TeamAndLinkData,
} from "../types";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature, getNetworkFeature, getUserId } from "@/networks";
import { FundProjectModal } from "@/screens/Projects/components/FundProjectModal";
import { SubmitContractorCandidateModal } from "@/screens/Projects/components/SubmitContractorCandidateModal";
import { prettyPrice } from "@/utils/coins";
import { adenaVMCall } from "@/utils/gno";
import { useAppNavigation } from "@/utils/navigation";

export const ProjectInfo: React.FC<{
  projectStatus?: ContractStatus;
  isFunded?: boolean;
  shortDescData: ShortDescData;
  teamAndLinkData: TeamAndLinkData;
  project?: Project;
}> = ({ projectStatus, shortDescData, teamAndLinkData, isFunded, project }) => {
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  const navigation = useAppNavigation();

  const [isFundModalVisible, setIsFundModalVisible] = useState(false);
  const [isSubmitContractorModalVisible, setIsSubmitContractorModalVisible] =
    useState(false);

  const pmFeature = getNetworkFeature(
    networkId,
    NetworkFeature.GnoProjectManager,
  );

  const authorId = project
    ? getUserId(networkId, project.sender)
    : selectedWallet?.userId;

  return (
    <>
      <FlexRow
        style={{
          marginTop: layout.spacing_x4,
          justifyContent: "space-between",
        }}
        breakpoint={550}
      >
        {/* Left block ======================================================= */}
        <View style={{ flex: 1 }}>
          <FlexRow breakpoint={800}>
            {/* Image */}
            <RoundedGradientImage
              size="L"
              square
              sourceURI={
                shortDescData._coverImgFile?.url || shortDescData.coverImg
              }
            />

            {/* Name and Description */}
            <View
              style={{
                marginHorizontal: layout.spacing_x2,
                paddingVertical: layout.spacing_x2,
                height: 236,
                justifyContent: "space-between",
              }}
            >
              <View>
                <BrandText style={fontSemibold20}>
                  {shortDescData?.name}
                </BrandText>

                <BrandText
                  style={[
                    fontSemibold13,
                    {
                      color: neutralA3,
                      marginTop: layout.spacing_x2,
                      maxWidth: 600,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {shortDescData?.desc}
                </BrandText>
              </View>

              <SpacerColumn size={1} />

              <View>
                {!!project &&
                  (selectedWallet?.address === project.funder ||
                    selectedWallet?.address === project?.contractor) &&
                  project.status === ContractStatus.ACCEPTED && (
                    <>
                      <PrimaryButton
                        color={errorColor}
                        text="Request conflict resolution"
                        loader
                        onPress={async () => {
                          const pmFeature = getNetworkFeature(
                            networkId,
                            NetworkFeature.GnoProjectManager,
                          );
                          if (!pmFeature) {
                            throw new Error(
                              "Project Manager is not supported on this network",
                            );
                          }
                          if (!selectedWallet?.address) {
                            throw new Error("No wallet connected");
                          }
                          await adenaVMCall(networkId, {
                            send: "",
                            caller: selectedWallet.address,
                            pkg_path: pmFeature.projectsManagerPkgPath,
                            func: "RequestConflictResolution",
                            args: [
                              project.id.toString(),
                              "The other guy is not nice",
                            ],
                          });
                        }}
                        size="SM"
                        width={280}
                      />
                      <SpacerColumn size={2} />
                    </>
                  )}

                {!!project &&
                  !!selectedWallet &&
                  project.status === ContractStatus.CONFLICT &&
                  (selectedWallet.address === project.conflictHandler ||
                    selectedWallet.address === project.contractor ||
                    selectedWallet.address === project.funder) && (
                    <>
                      <ResolveConflictButton
                        userId={selectedWallet?.userId}
                        projectId={project.id}
                      />
                      <SpacerColumn size={2} />
                    </>
                  )}

                {/* Actions */}
                {/* If current user is not funder, not creator of project and the project has not contractor yet then user can become contractor */}
                {!!project &&
                  selectedWallet?.address !== project.sender &&
                  selectedWallet?.address !== project.funder &&
                  !project.contractor &&
                  project.status === ContractStatus.CREATED &&
                  (project.contractorCandidates.includes(
                    selectedWallet?.address || "",
                  ) ? (
                    <>
                      <BrandText>You are a candidate</BrandText>
                      <SpacerColumn size={2} />
                    </>
                  ) : (
                    <>
                      <PrimaryButton
                        text="Submit your candidacy as contractor"
                        onPress={() => setIsSubmitContractorModalVisible(true)}
                        size="SM"
                      />
                      <SpacerColumn size={2} />
                    </>
                  ))}
                {/* If current user is not contractor, not creator of project and the project has not funder yet then user can become funder */}
                {!!project &&
                  selectedWallet?.address !== project.sender &&
                  selectedWallet?.address !== project.contractor &&
                  !project.funded &&
                  project.status === ContractStatus.CREATED && (
                    <>
                      <PrimaryButton
                        text="Fund this project"
                        onPress={() => setIsFundModalVisible(true)}
                        size="SM"
                        width={200}
                      />
                      <SpacerColumn size={2} />
                    </>
                  )}

                {!!project &&
                  selectedWallet?.address === project.funder &&
                  project.funded &&
                  project.status === ContractStatus.CREATED && (
                    <>
                      <PrimaryButton
                        text="View candidates"
                        onPress={() =>
                          navigation.navigate("ProjectsManager", {
                            view: "requestsByBuilders",
                          })
                        }
                        size="SM"
                        width={200}
                      />
                      <SpacerColumn size={2} />
                    </>
                  )}

                <TertiaryBox
                  style={{
                    backgroundColor: neutral22,
                    borderWidth: 0,
                    padding: layout.spacing_x1_5,
                    width: 280,
                  }}
                >
                  <UsernameWithAvatar userId={authorId} addrLen={20} />
                </TertiaryBox>
              </View>
            </View>
          </FlexRow>

          <SpacerColumn size={2} />

          <FlexRow>
            {projectStatus && (
              <ProjectStatusTag status={projectStatus} size="XS" />
            )}

            <SpacerRow size={2} />

            {shortDescData?.tags.split(",").map((tag, idx) => {
              return (
                <Tag
                  key={idx}
                  text={tag}
                  color={neutral77}
                  borderColor={neutral33}
                  bgColor={neutral00}
                  containerStyle={{ marginRight: layout.spacing_x2 }}
                />
              );
            })}
          </FlexRow>
        </View>

        {/* Right block ======================================================= */}
        <View style={{ marginTop: layout.spacing_x2, width: 280 }}>
          <TertiaryBox
            style={{
              backgroundColor: neutral22,
              borderWidth: 0,
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <FlexRow style={{ justifyContent: "center", width: "100%" }}>
              <BrandText
                style={[
                  fontSemibold20,
                  { color: isFunded ? yellowDefault : neutral77 },
                ]}
              >
                {isFunded ? "Deposited:" : "Budget:"}
              </BrandText>
              <SpacerRow size={1} />
              <BrandText style={[fontSemibold20, { color: primaryColor }]}>
                {prettyPrice(
                  networkId,
                  shortDescData?.budget.toString(),
                  pmFeature?.paymentsDenom,
                )}
              </BrandText>
            </FlexRow>
          </TertiaryBox>

          <SpacerColumn size={2} />

          <TertiaryBox
            style={{
              backgroundColor: neutral22,
              borderWidth: 0,
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <FlexRow style={{ justifyContent: "center", width: "100%" }}>
              <BrandText style={[fontSemibold20, { color: neutral77 }]}>
                Expire At:
              </BrandText>
              <SpacerRow size={1} />
              <BrandText style={[fontSemibold20, { color: primaryColor }]}>
                {moment(shortDescData.duration * 1000 + Date.now()).format("L")}
              </BrandText>
            </FlexRow>
          </TertiaryBox>

          <SpacerColumn size={2} />

          <View style={{ backgroundColor: neutral22 }}>
            <Link to={teamAndLinkData?.websiteLink}>
              <SocialButton
                text="Share URL"
                iconSvg={shareSVG}
                iconColor={secondaryColor}
                textColor={neutralA3}
              />
            </Link>

            <SpacerRow size={1} />

            <Link to={teamAndLinkData?.discordLink}>
              <SocialButton
                text="Discord URL"
                iconSvg={discordSVG}
                textColor={neutralA3}
              />
            </Link>

            <SpacerRow size={1} />

            <Link to={teamAndLinkData?.websiteLink}>
              <SocialButton
                text="Website URL"
                iconSvg={websiteSVG}
                textColor={neutralA3}
              />
            </Link>

            <SpacerRow size={1} />

            <Link to={teamAndLinkData?.githubLink}>
              <SocialButton
                text="Github URL"
                iconSvg={githubSVG}
                textColor={neutralA3}
              />
            </Link>

            <SpacerRow size={1} />

            <Link to={teamAndLinkData?.discordLink}>
              <SocialButton
                text="Twitter URL"
                iconSvg={twitterSVG}
                textColor={neutralA3}
              />
            </Link>
          </View>
        </View>
      </FlexRow>
      <SpacerColumn size={2} />

      <BrandText>{JSON.stringify(project, null, 2)}</BrandText>

      {project && (
        <FundProjectModal
          project={project}
          isVisible={isFundModalVisible}
          onClose={() => setIsFundModalVisible(false)}
        />
      )}
      {project && (
        <SubmitContractorCandidateModal
          project={project}
          isVisible={isSubmitContractorModalVisible}
          onClose={() => setIsSubmitContractorModalVisible(false)}
        />
      )}
    </>
  );
};
