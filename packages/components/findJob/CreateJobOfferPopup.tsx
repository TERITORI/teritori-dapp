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
  neutral00,
  neutral77,
  codGrayColor,
  mineShaftColor,
  neutral33,
  white,
} from "../../utils/style/colors";
import { fontSemibold14, fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { Separator } from "../Separator";
import { PrimaryBox } from "../boxes/PrimaryBox";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";

const dataNavBar = ["About the project", "Outcomes", "Working at NXTPOP"];

export const CreateJobOfferPopup: React.FC<{
  visible?: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [displayAddTag, setDisplayAddTag] = useState(false);
  const [actualText, setActualText] = useState("");
  const [displayJobOffer, setDisplayJobOffer] = useState(visible);
  const [data, setData] = useState(["tag1", "tag2"]);
  const [actualItem, setactualItem] = useState("About the project");

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
        setDisplayJobOffer(false);
      }}
      label="Create a job offer"
      visible={displayJobOffer}
      width={632}
    >
      <ScrollView style={{ height: 730 }}>
        <View
          style={{
            flexDirection: "column",
            marginBottom: layout.padding_x1_5,
          }}
        >
          <View style={{ padding: layout.padding_x1 }}>
            <TextInputCustom<StakeFormValuesType>
              name="jobName"
              label="Job name"
              placeHolder="Type job name here"
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: layout.padding_x1_5,
          }}
        >
          <View style={{ padding: layout.padding_x1, flexBasis: "50%" }}>
            <TextInputCustom<StakeFormValuesType>
              name="country"
              label="Country"
              placeHolder="Type Country here"
            />
          </View>
          <View style={{ padding: layout.padding_x1, flexBasis: "50%" }}>
            <TextInputCustom<StakeFormValuesType>
              name="city"
              label="City"
              placeHolder="Type City here"
            />
          </View>
          <View style={{ padding: layout.padding_x1, flexBasis: "50%" }}>
            <TextInputCustom<StakeFormValuesType>
              name="jobType"
              label="Job type"
              placeHolder="Select Job type"
            />
          </View>
          <View style={{ padding: layout.padding_x1, flexBasis: "50%" }}>
            <TextInputCustom<StakeFormValuesType>
              name="salary"
              label="Salary"
              placeHolder="Type Salary range"
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
          Tag
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
                      source={closeIcon}
                      style={{
                        paddingLeft: layout.padding_x1,
                        paddingRight: layout.padding_x0_5,
                      }}
                      width={16}
                      height={16}
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
                    paddingLeft: layout.padding_x0_5,
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
            marginTop: layout.padding_x1_5,
          }}
        >
          <TouchableOpacity>
            <View
              style={{
                flexWrap: "wrap",
                alignContent: "flex-start",
                justifyContent: "flex-start",
                flexDirection: "row",
                borderBottomColor: neutral33,
                borderBottomWidth: 1,
              }}
            >
              {dataNavBar.map((item, index) => (
                <View
                  key={index}
                  style={{
                    margin: layout.padding_x1_5,
                    marginRight: layout.padding_x2_5,
                    alignContent: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setactualItem(item.toString());
                    }}
                    key={index}
                  >
                    <BrandText
                      style={[
                        fontSemibold14,
                        {
                          color: white,
                        },
                      ]}
                    >
                      {item}
                    </BrandText>

                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor:
                          actualItem === item ? white : neutral00,
                        borderRadius: 4,
                        position: "relative",
                        top: 10,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "column",
            marginBottom: layout.padding_x2_5,
            marginTop: layout.padding_x1_5,
          }}
        >
          <View style={{ padding: layout.padding_x1, height: 200 }}>
            <TextInputCustom<StakeFormValuesType>
              name="timezone"
              label=""
              placeHolder="Type description here"
              height={200}
              style={{ height: 200 }}
              multiline
              numberOfLines={9}
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
            flexDirection: "row",
            alignContent: "center",
            margin: layout.padding_x1_5,
          }}
        >
          <PrimaryBox width={300} height={56}>
            <BrandText style={fontSemibold13}>
              $ The mint cost for this token is 1,000 Tori
            </BrandText>
          </PrimaryBox>

          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              marginLeft: layout.padding_x2_5,
            }}
          >
            <PrimaryButton width={250} size="XL" text="Create a job offer" />
          </View>
        </View>
      </ScrollView>
    </ModalBase>
  );
};
