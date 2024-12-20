import { Dispatch, FC, SetStateAction, useState } from "react";

import eyeSVG from "@/assets/icons/eye.svg";
import penSVG from "@/assets/icons/pen.svg";
import splittedSquareSVG from "@/assets/icons/splitted-square.svg";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerRow } from "@/components/spacer";
import { ContentMode } from "@/utils/feed/markdown";
import { neutral11, neutral33, neutralFF } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

interface Props {
  setMode: Dispatch<SetStateAction<ContentMode>>;
  mode: ContentMode;
}

export const ModeButtons: FC<Props> = ({ setMode, mode }) => {
  const [hoveredButton, setHoveredButton] = useState<ContentMode | null>(null);

  return (
    <>
      <CustomPressable
        onPress={() => setMode("EDITION")}
        style={{
          backgroundColor: mode === "EDITION" ? neutral33 : neutral11,
          padding: layout.spacing_x0_5,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: hoveredButton === "EDITION" ? neutralFF : neutral11,
        }}
        onHoverIn={() => setHoveredButton("EDITION")}
        onHoverOut={() => setHoveredButton(null)}
      >
        <SVG source={penSVG} height={24} width={24} color={neutralFF} />
      </CustomPressable>
      <SpacerRow size={0.5} />
      <CustomPressable
        onPress={() => setMode("BOTH")}
        style={{
          backgroundColor: mode === "BOTH" ? neutral33 : neutral11,
          padding: layout.spacing_x0_5,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: hoveredButton === "BOTH" ? neutralFF : neutral11,
        }}
        onHoverIn={() => setHoveredButton("BOTH")}
        onHoverOut={() => setHoveredButton(null)}
      >
        <SVG
          source={splittedSquareSVG}
          height={24}
          width={24}
          color={neutralFF}
        />
      </CustomPressable>
      <SpacerRow size={0.5} />
      <CustomPressable
        onPress={() => setMode("PREVIEW")}
        style={{
          backgroundColor: mode === "PREVIEW" ? neutral33 : neutral11,
          padding: layout.spacing_x0_5,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: hoveredButton === "PREVIEW" ? neutralFF : neutral11,
        }}
        onHoverIn={() => setHoveredButton("PREVIEW")}
        onHoverOut={() => setHoveredButton(null)}
      >
        <SVG source={eyeSVG} height={24} width={24} color={neutralFF} />
      </CustomPressable>
    </>
  );
};
