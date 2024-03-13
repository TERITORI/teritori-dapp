import React, { useState } from "react";
import { View } from "react-native";

import { ContractStatus, Project } from "../../types";
import { FundProjectModal } from "../FundProjectModal";
import { Tag } from "../Milestone";
import { ProjectStatusTag } from "../ProjectStatusTag";
import { ResolveConflictButton } from "../ResolveConflictButton";
import { SubmitContractorCandidateModal } from "../SubmitContractorCandidateModal";

import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getUserId } from "@/networks";
import {
  errorColor,
  neutral00,
  neutral33,
  neutral77,
  neutralA3,
  yellowDefault,
} from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type LeftBlockProps = {
  networkId: string;
  project: Project;
  candidates: string[];
};

export const LeftBlock: React.FC<LeftBlockProps> = ({
  networkId,
  project,
  candidates,
}) => {
  const navigation = useAppNavigation();
  const [isFundModalVisible, setIsFundModalVisible] = useState(false);
  const [isSubmitContractorModalVisible, setIsSubmitContractorModalVisible] =
    useState(false);

  const selectedWallet = useSelectedWallet();
  const walletAddress = selectedWallet?.address || "";

  const projectStatus = project.status;
  const shortDescData = project.metadata.shortDescData;

  const authorId = project
    ? getUserId(networkId, project.sender)
    : selectedWallet?.userId;

  return (
    <View>
      <BrandText style={fontSemibold20}>{shortDescData?.name}</BrandText>

      <FlexRow>
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          Project creator
        </BrandText>
        <UsernameWithAvatar userId={authorId} addrLen={20} />
      </FlexRow>

      <SpacerColumn size={1} />

      <FlexRow>
        {projectStatus && <ProjectStatusTag status={projectStatus} size="XS" />}

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

      <FlexRow breakpoint={800}>
        {/* Image */}
        <RoundedGradientImage
          size="L"
          square
          sourceURI={shortDescData._coverImgFile?.url || shortDescData.coverImg}
        />

        {/* Name and Description */}
        <View
          style={{
            marginHorizontal: layout.spacing_x2,
            paddingVertical: layout.spacing_x2,
            height: 300,
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View>
            <BrandText
              style={[
                fontSemibold13,
                {
                  color: neutralA3,
                  marginTop: layout.spacing_x2,
                  width: "100%",
                },
              ]}
              numberOfLines={2}
            >
              {shortDescData?.desc}
            </BrandText>
          </View>

          <SpacerColumn size={1} />

          <View>
            {project &&
              (walletAddress === project.funder ||
                walletAddress === project?.contractor) &&
              project.status === ContractStatus.ACCEPTED && (
                <>
                  <PrimaryButton
                    color={errorColor}
                    text="Request conflict resolution"
                    loader
                    onPress={() => {
                      project.id !== undefined &&
                        navigation.navigate("ProjectsConflictSolving", {
                          projectId: project.id.toString(),
                        });
                    }}
                    size="SM"
                    width={280}
                  />
                  <SpacerColumn size={2} />
                </>
              )}

            {project.id !== undefined &&
              project.status === ContractStatus.CONFLICT &&
              (walletAddress === project.conflictHandler ||
                walletAddress === project.contractor ||
                walletAddress === project.funder) && (
                <>
                  <ResolveConflictButton projectId={project.id.toString()} />
                  <SpacerColumn size={2} />
                </>
              )}

            {/* Actions */}
            {/* If current user is not funder, not creator of project and the project has not contractor yet then user can become contractor */}
            {!!project &&
              walletAddress !== project.sender &&
              walletAddress !== project.funder &&
              !project.contractor &&
              project.status === ContractStatus.CREATED &&
              (project.contractorCandidates?.includes(walletAddress) ? (
                <>
                  <BrandText style={[fontSemibold16, { color: yellowDefault }]}>
                    You are a candidate
                  </BrandText>
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
            {walletAddress !== project.sender &&
              walletAddress !== project.contractor &&
              !project.funded &&
              project.status === ContractStatus.CREATED && (
                <PrimaryButton
                  text="Fund this project"
                  onPress={() => setIsFundModalVisible(true)}
                  size="SM"
                  width={200}
                />
              )}

            {walletAddress === project.funder &&
              project.funded &&
              project.status === ContractStatus.CREATED && (
                <PrimaryButton
                  disabled={!candidates.length}
                  text={`${candidates.length} candidates`}
                  onPress={() =>
                    navigation.navigate("ProjectsManager", {
                      view: "requestsByBuilders",
                    })
                  }
                  size="SM"
                  width={200}
                />
              )}
            <SpacerColumn size={2} />
          </View>
        </View>
      </FlexRow>

      <SpacerColumn size={2} />

      {project?.id && (
        <FundProjectModal
          project={project}
          isVisible={isFundModalVisible}
          onClose={() => setIsFundModalVisible(false)}
        />
      )}

      <SubmitContractorCandidateModal
        project={project}
        isVisible={isSubmitContractorModalVisible}
        onClose={() => setIsSubmitContractorModalVisible(false)}
      />
    </View>
  );
};
