import { Link } from "@react-navigation/native";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

import { Tag } from "./Milestone";
import { ProjectStatusTag } from "./ProjectStatusTag";
import discordSVG from "../../../../assets/icons/discord.svg";
import githubSVG from "../../../../assets/icons/github.svg";
import gnoSVG from "../../../../assets/icons/networks/gno.svg";
import shareSVG from "../../../../assets/icons/share.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import websiteSVG from "../../../../assets/icons/website.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  ContractStatus,
  Project,
  ShortDescData,
  TeamAndLinkData,
} from "../types";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { FundProjectModal } from "@/screens/Projects/components/FundProjectModal";
import { SubmitContractorCandidateModal } from "@/screens/Projects/components/SubmitContractorCandidateModal";
import {
  useEscrowContract,
  useQueryEscrow,
} from "@/screens/Projects/hooks/useEscrowContract";
import { prettyPrice } from "@/utils/coins";
import { extractGnoString } from "@/utils/gno";

export const ProjectInfo: React.FC<{
  projectStatus?: ContractStatus;
  isFunded?: boolean;
  shortDescData: ShortDescData;
  teamAndLinkData: TeamAndLinkData;
  project?: Project;
}> = ({ projectStatus, shortDescData, teamAndLinkData, isFunded, project }) => {
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();

  const [isFundModalVisible, setIsFundModalVisible] = useState(false);
  const [isSubmitContractorModalVisible, setIsSubmitContractorModalVisible] =
    useState(false);

  const { data: candidatesData } = useQueryEscrow(
    networkId,
    "GetContractorCandidates",
    [project?.id],
    !project?.contractor,
  );

  const candidates = useMemo(() => {
    if (!candidatesData) return [];
    return extractGnoString(candidatesData).split(",");
  }, [candidatesData]);

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
            <View style={{ marginHorizontal: layout.spacing_x2, flex: 1 }}>
              <BrandText
                style={[fontSemibold20, { marginTop: layout.spacing_x2 }]}
              >
                {shortDescData?.name}
              </BrandText>

              <BrandText
                style={[
                  fontSemibold13,
                  {
                    color: neutralA3,
                    marginTop: layout.spacing_x2,
                  },
                ]}
              >
                {shortDescData?.desc}
              </BrandText>

              <SpacerColumn size={2} />

              <TertiaryBox
                style={{
                  backgroundColor: neutral22,
                  borderWidth: 0,
                  padding: layout.spacing_x1_5,
                  width: 280,
                }}
              >
                <FlexRow style={{ justifyContent: "center", width: "100%" }}>
                  <SVG source={gnoSVG} width={18} height={18} />
                  <BrandText
                    style={[
                      fontSemibold13,
                      { marginLeft: layout.spacing_x1_5 },
                    ]}
                  >
                    @{shortDescData?.paymentAddr}
                  </BrandText>
                </FlexRow>
              </TertiaryBox>

              <SpacerColumn size={2} />

              {/* Actions */}
              {/* If current user is not funder, not creator of project and the project has not contractor yet then user can become contractor */}
              {project &&
                selectedWallet?.address !== project.sender &&
                selectedWallet?.address !== project.funder &&
                !project.contractor &&
                project.status === ContractStatus.CREATED &&
                (candidates.includes(selectedWallet?.address || "") ? (
                  <BrandText style={[fontSemibold14, { color: yellowDefault }]}>
                    All ready submitted candidate
                  </BrandText>
                ) : (
                  <PrimaryButton
                    text="Submit contractor candidate"
                    onPress={() => setIsSubmitContractorModalVisible(true)}
                    size="SM"
                    width={280}
                  />
                ))}
              {/* If current user is not contractor, not creator of project and the project has not funder yet then user can become funder */}
              {project &&
                selectedWallet?.address !== project.sender &&
                selectedWallet?.address !== project.contractor &&
                !project.funded &&
                project.status === ContractStatus.CREATED && (
                  <PrimaryButton
                    text="Fund this project"
                    onPress={() => setIsFundModalVisible(true)}
                    size="SM"
                    width={200}
                  />
                )}
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
                  shortDescData.paymentAddr,
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
