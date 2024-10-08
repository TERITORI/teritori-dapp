import { errorColor, neutral17, neutral77, warningColor } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { SVG } from "@/components/SVG";
import { FC } from "react";
import { View } from "react-native";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { BrandText } from "@/components/BrandText";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { fontSemibold13 } from "@/utils/style/fonts";
import crossSVG from "@/assets/icons/cross.svg";
import warningTriangleSVG from "@/assets/icons/warning-triangle.svg";

export interface AssetsAndMetadataIssueObject {
    title: string;
    message: string;
    type: "error" | "warning";
}

export const AssetsAndMetadataIssue: FC<{
    issue: AssetsAndMetadataIssueObject
    removeIssue: () => void
}> = ({issue, 
    removeIssue}) => {
    return (
        <CustomPressable
              onPress={removeIssue}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: neutral17,
                padding: layout.spacing_x2,
                borderRadius: 16,
                marginTop: layout.spacing_x1,
                marginBottom: layout.spacing_x1
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <SVG
                    source={warningTriangleSVG}
                    color={issue.type === "error" ? errorColor : warningColor}
                    height={16}
                    width={16}
                  />
                  <SpacerRow size={1} />
                  <BrandText
                    style={[
                      fontSemibold13,
                      {
                        color:
                          issue.type === "error" ? errorColor : warningColor,
                      },
                    ]}
                  >
                    {issue.title}
                  </BrandText>
                </View>
                <SpacerColumn size={0.5} />
                <BrandText style={[fontSemibold13, { color: neutral77 }]}>
                  {issue.message}
                </BrandText>
              </View>

              <SVG source={crossSVG} color={neutral77} height={16} width={16} />
            </CustomPressable>
    )
}