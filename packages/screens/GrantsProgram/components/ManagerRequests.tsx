import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Tag } from "./Tag";
import githubSVG from "../../../../assets/icons/github.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { Separator } from "../../../components/Separator";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral00,
  neutral17,
  neutral77,
  neutralA3,
  neutralFF,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const ManagerRequests: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7].map((id) => {
        return (
          <TertiaryBox
            fullWidth
            noBrokenCorners
            mainContainerStyle={{
              backgroundColor: neutral17,
              marginTop: layout.spacing_x1_5,
              paddingVertical: layout.spacing_x1_5,
              paddingHorizontal: layout.spacing_x2,
            }}
          >
            <FlexRow>
              <BrandText style={[fontSemibold14, { flexGrow: 1 }]}>
                🔎 Community Docs Platform
              </BrandText>

              <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                @0x123123123
              </BrandText>

              <Separator
                horizontal
                style={{ marginHorizontal: layout.spacing_x1_5 }}
              />

              <BrandText
                style={[
                  fontSemibold13,
                  { color: neutral77, marginRight: layout.spacing_x1_5 },
                ]}
              >
                Status
              </BrandText>

              <Tag text="In Progress" color={neutralFF} bgColor="#693CB1" />

              <BrandText
                style={[
                  fontSemibold16,
                  {
                    color: neutral77,
                    marginHorizontal: layout.spacing_x1_5,
                  },
                ]}
              >
                {">"}
              </BrandText>

              <Tag text="Completed" color={neutralFF} bgColor="#2B673D" />

              <Separator
                horizontal
                style={{ marginHorizontal: layout.spacing_x1_5 }}
              />

              <BrandText
                style={[
                  fontSemibold13,
                  { color: neutral77, marginRight: layout.spacing_x1_5 },
                ]}
              >
                Priority
              </BrandText>

              <Tag text="High 🔥" color={neutralFF} bgColor="#673932" />

              <Separator
                horizontal
                style={{ marginHorizontal: layout.spacing_x1_5 }}
              />

              <SocialButton
                iconSvg={githubSVG}
                style={{
                  marginRight: layout.spacing_x2,
                }}
                bgColor={neutral17}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate("GrantsProgramPayment")}
              >
                <BrandText
                  style={[
                    fontSemibold14,
                    {
                      color: neutral00,
                      backgroundColor: neutralFF,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 4,
                    },
                  ]}
                >
                  Approve
                </BrandText>
              </TouchableOpacity>
            </FlexRow>
          </TertiaryBox>
        );
      })}
    </>
  );
};
