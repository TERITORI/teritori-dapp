import { useLinkBuilder } from "@react-navigation/native";
import React, { memo, useMemo } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { Tag } from "./Milestone";
import { ProjectStatusTag } from "./ProjectStatusTag";
import { Project } from "../../../utils/projects/types";

import shareSVG from "@/assets/icons/share.svg";
import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { ProgressLine } from "@/components/ProgressLine";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { SocialButton } from "@/components/buttons/SocialButton";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import Clipboard from "@/modules/Clipboard";
import { getNetworkObjectId, getUserId } from "@/networks";
import { prettyPrice } from "@/utils/coins";
import { useAppNavigation } from "@/utils/navigation";
import { joinElements } from "@/utils/react";
import {
  neutral17,
  neutral77,
  neutralA3,
  secondaryColor,
} from "@/utils/style/colors";
import {
  fontSemibold10,
  fontSemibold13,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const ProjectBox: React.FC<{
  project: Project;
  width: number;
}> = memo(({ project, width }) => {
  const stats = useMemo(() => {
    if (!project.milestones)
      return { completed: 0, total: 0, percentCompleted: 0 };
    const completed = project.milestones.filter(
      (ms) => ms.status === "MS_COMPLETED",
    ).length;
    const total = project.milestones.length;
    const percentCompleted = Math.floor((completed / total) * 100);
    return { completed, total, percentCompleted };
  }, [project.milestones]);
  const { setToast } = useFeedbacks();
  const buildLink = useLinkBuilder();

  const networkId = useSelectedNetworkId();

  const navigation = useAppNavigation();

  const gotoProjectsDetail = (localId: string | undefined) => {
    if (!localId) {
      return;
    }
    navigation.navigate("ProjectsDetail", {
      id: getNetworkObjectId(networkId, localId),
    });
  };

  const onPress = () => gotoProjectsDetail(project.id);

  const bottomElems = [
    <SocialButton
      iconSvg={shareSVG}
      iconColor={secondaryColor}
      onPress={async () => {
        const pathname = buildLink("ProjectsDetail", {
          id: getNetworkObjectId(networkId, project.id),
        });
        if (!pathname) return;

        const link = new URL(window.location.href);
        link.pathname = pathname;
        await Clipboard.setStringAsync(link.href);

        setToast({
          title: "Copied permanent link",
          message: "",
          type: "success",
          mode: "normal",
        });
      }}
    />,
  ];

  const nameAndTagsWidth = width - (32 + 56 + layout.spacing_x2);

  return (
    <TertiaryBox style={{ width }}>
      {/* Body ============================================================== */}
      <View style={{ margin: layout.spacing_x2 }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={onPress}>
            <RoundedGradientImage
              size="S"
              square
              sourceURI={project.metadata?.shortDescData?.coverImg}
            />
          </TouchableOpacity>

          <View
            style={{
              marginLeft: layout.spacing_x2,
              justifyContent: "space-between",
              height: 56,
            }}
          >
            <TouchableOpacity onPress={onPress}>
              <BrandText
                style={[fontSemibold20, { width: nameAndTagsWidth }]}
                numberOfLines={1}
              >
                {project.metadata?.shortDescData?.name}
              </BrandText>
            </TouchableOpacity>
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ width: nameAndTagsWidth }}
              >
                {project.metadata?.shortDescData?.tags
                  ?.split(",")
                  .map((tag, idx) => (
                    <Tag
                      key={idx}
                      text={tag}
                      containerStyle={[
                        idx !== 0 && { marginLeft: layout.spacing_x1 },
                      ]}
                    />
                  ))}
              </ScrollView>
            </View>
          </View>
        </View>

        <BrandText
          numberOfLines={2}
          style={[
            fontSemibold13,
            { color: neutral77, marginTop: layout.spacing_x2 },
          ]}
        >
          {project.metadata?.shortDescData?.desc}
        </BrandText>

        <SpacerColumn size={1} />

        <View>
          <FlexRow style={{ justifyContent: "space-between" }}>
            <BrandText style={[fontSemibold10, { color: neutralA3 }]}>
              Milestones
            </BrandText>
            <BrandText style={[fontSemibold10, { color: neutralA3 }]}>
              {stats.completed}/{stats.total}
            </BrandText>
          </FlexRow>

          <ProgressLine
            gain={stats.percentCompleted}
            style={{ width: width - 32 }}
          />
        </View>
      </View>

      {/* Footer ============================================================== */}
      <TertiaryBox
        style={{
          width: "100%",
          backgroundColor: neutral17,
          padding: layout.spacing_x2,
          borderWidth: 0,
        }}
      >
        <FlexRow style={{ justifyContent: "space-between" }}>
          <UsernameWithAvatar
            userId={getUserId(networkId, project.sender)}
            addrLen={14}
          />

          <FlexRow style={{ width: "auto" }}>
            <BrandText style={[fontSemibold13, { color: neutral77 }]}>
              Grant:{" "}
            </BrandText>
            <BrandText style={fontSemibold13}>
              {prettyPrice(
                networkId,
                project.budget || "0",
                project.paymentDenom,
              )}
            </BrandText>
          </FlexRow>
        </FlexRow>

        <Separator style={{ marginVertical: layout.spacing_x2 }} />

        <FlexRow>
          <FlexRow style={{ flexGrow: 1, width: "auto" }}>
            {joinElements(bottomElems, <SpacerRow size={1} />)}
          </FlexRow>

          <ProjectStatusTag status={project.status} size="SM" />
        </FlexRow>
      </TertiaryBox>
    </TertiaryBox>
  );
});
