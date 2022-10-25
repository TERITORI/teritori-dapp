import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";

import addIcon from "../../../assets/icons/findAJob/add.svg";
import closeIcon from "../../../assets/icons/findAJob/close.svg";
import { BrandText } from "../../components/BrandText/BrandText";
import { SVG } from "../../components/SVG/svg";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import ModalBase from "../../components/modals/ModalBase";
import { StakeFormValuesType } from "../../screens/Stake/types";
import {
  neutral44,
  neutral77,
  codGrayColor,
  mineShaftColor,
} from "../../utils/style/colors";
import { fontSemibold14, fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { Separator } from "../Separator";
import { PrimaryBox } from "../boxes/PrimaryBox";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const CreateFreelanceMissionPopup: React.FC<{
  visible?: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [displayAddTag, setDisplayAddTag] = useState(false);
  const [actualText, setActualText] = useState("");
  const [displayFreelanceMission, setDisplayFreelanceMission] =
    useState(visible);
  const [data, setData] = useState(["tag1"]);

  function handleAddTagClick() {
    if (displayAddTag === true) {
      return (
        <View style={{ width: 150, margin: layout.padding_x0_5 }}>
          <TextInputCustom<StakeFormValuesType>
            name="createATag"
            label=""
            placeHolder="Tag name"
            onChangeText={setActualText}
            onPressEnter={() => {
              setData([...data, actualText]);
              setDisplayAddTag(false);
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setDisplayAddTag(false);
              }}
            >
              <SVG source={closeIcon} width={16} height={16} />
            </TouchableOpacity>
          </TextInputCustom>
        </View>
      );
    } else return null;
  }

  return (
    <ModalBase
      onClose={() => {
        onClose();
        setDisplayFreelanceMission(false);
      }}
      label="Create a Freelance service"
      visible={displayFreelanceMission}
      width={400}
    >
      <ScrollView style={{ height: 680 }}>
        <View
          style={{
            flexDirection: "column",
            marginBottom: layout.padding_x1_5,
          }}
        >
          <View style={{ padding: layout.padding_x1 }}>
            <TextInputCustom<StakeFormValuesType>
              name="serviceName"
              label="Service name"
              placeHolder="Type service name here"
            />
          </View>
          <View style={{ padding: layout.padding_x1 }}>
            <TextInputCustom<StakeFormValuesType>
              name="minHourRate"
              label="Min hour rate"
              placeHolder="$ / hour"
            />
          </View>
        </View>

        <Separator
          style={{
            borderBottomWidth: 1,
            borderColor: neutral44,
            width: "100%",
          }}
          color={neutral44}
        />

        <BrandText
          style={[
            fontSemibold14,
            {
              marginTop: layout.padding_x1_5,
              marginBottom: layout.padding_x0_5,
              color: neutral77,
            },
          ]}
        >
          Tags
        </BrandText>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            width: "95%",
            marginBottom: layout.padding_x1_5,
          }}
        >
          {data.map((item, index) => (
            <View style={{ margin: layout.padding_x0_5 }} key={index}>
              <TertiaryBox
                mainContainerStyle={{ backgroundColor: codGrayColor }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: layout.padding_x1_5,
                    paddingBottom: layout.padding_x1_5,
                    paddingLeft: layout.padding_x1_5,
                    paddingRight: layout.padding_x1,
                  }}
                >
                  <BrandText style={fontSemibold14}>{item}</BrandText>
                  <TouchableOpacity
                    onPress={() => {
                      setData(data.filter((item) => item !== data[index]));
                    }}
                  >
                    <SVG
                      width={16}
                      height={16}
                      source={closeIcon}
                      style={{
                        paddingLeft: layout.padding_x1,
                        paddingRight: layout.padding_x0_5,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </TertiaryBox>
            </View>
          ))}
          <View style={{ margin: layout.padding_x0_5 }}>
            <TertiaryBox
              mainContainerStyle={{ backgroundColor: mineShaftColor }}
            >
              <TouchableOpacity onPress={() => setDisplayAddTag(true)}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    paddingTop: layout.padding_x1_5,
                    paddingBottom: layout.padding_x1_5,
                    paddingLeft: layout.padding_x0_25,
                    paddingRight: layout.padding_x1,
                  }}
                >
                  <SVG source={addIcon} width={16} height={16} />
                  <BrandText style={fontSemibold14}>Add</BrandText>
                </View>
              </TouchableOpacity>
            </TertiaryBox>
          </View>
          {handleAddTagClick()}
        </View>

        <Separator
          style={{
            borderBottomWidth: 1,
            borderColor: neutral44,
            width: "100%",
          }}
          color={neutral44}
        />

        <View
          style={{
            flexDirection: "column",
            marginBottom: layout.padding_x1_5,
            marginTop: layout.padding_x1_5,
          }}
        >
          <View style={{ padding: layout.padding_x1 }}>
            <TextInputCustom<StakeFormValuesType>
              name="servicesProvided"
              label="Services provided"
              placeHolder="Type description here"
            />
          </View>
          <View style={{ padding: layout.padding_x1 }}>
            <TextInputCustom<StakeFormValuesType>
              name="location"
              label="Location"
              placeHolder="Type description here"
            />
          </View>
          <View style={{ padding: layout.padding_x1 }}>
            <TextInputCustom<StakeFormValuesType>
              name="timezone"
              label="Timezone"
              placeHolder="Type description here"
            />
          </View>
        </View>

        <Separator
          style={{
            borderBottomWidth: 1,
            borderColor: neutral44,
            width: "100%",
          }}
          color={neutral44}
        />

        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            margin: layout.padding_x1_5,
          }}
        >
          <PrimaryBox width={332} height={56}>
            <BrandText style={fontSemibold13}>
              $ The mint cost for this token is 1,000 Tori
            </BrandText>
          </PrimaryBox>

          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              marginTop: layout.padding_x2,
              marginBottom: layout.padding_x2,
            }}
          >
            <PrimaryButton width={332} size="XL" text="Create mission" />
          </View>
        </View>
      </ScrollView>
    </ModalBase>
  );
};
