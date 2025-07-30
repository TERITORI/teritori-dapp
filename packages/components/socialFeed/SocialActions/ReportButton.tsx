import React, { useState } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import { FlagModal } from "./FlagModal";
import flagSVG from "../../../../assets/icons/flag.svg";
import {
  neutral22,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SpacerRow } from "../../spacer";

type FlagButtonProps = {
  refetchFeed?: () => Promise<any>;
  postId: string;
  style?: StyleProp<ViewStyle>;
  useAltStyle?: boolean;
};

export const ReportButton: React.FC<FlagButtonProps> = ({
  refetchFeed,
  postId,
  useAltStyle,
}) => {
  const [isShowFlagModal, setIsShowFlagModal] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsShowFlagModal(true)}
        style={[
          { flexDirection: "row", alignItems: "center" },
          useAltStyle && {
            paddingVertical: layout.spacing_x0_75,
            paddingRight: layout.spacing_x1_5,
            paddingLeft: layout.spacing_x1,
            borderRadius: 999,
            backgroundColor: neutral22,
          },
        ]}
      >
        <SVG
          source={flagSVG}
          width={20}
          height={20}
          color={useAltStyle ? neutralA3 : secondaryColor}
        />
        {useAltStyle && (
          <>
            <SpacerRow size={0.75} />
            <BrandText
              style={[fontSemibold13, useAltStyle && { color: neutralA3 }]}
            >
              Report
            </BrandText>
          </>
        )}
      </TouchableOpacity>

      <FlagModal
        refetchFeed={refetchFeed}
        postId={postId}
        onClose={(nextModalName) => {
          setIsShowFlagModal(false);
        }}
        isVisible={isShowFlagModal}
      />
    </>
  );
};
