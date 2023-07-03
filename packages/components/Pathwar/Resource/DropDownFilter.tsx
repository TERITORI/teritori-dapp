import Checkbox from "expo-checkbox";
import React, { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import SortIcon from "../../../../assets/icons/Pathwar/sortIcon.svg";
import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../../context/DropdownsProvider";
import {
  codGrayColor,
  neutral11,
  neutral44,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText/BrandText";
import { SVG } from "../../SVG";
import { Separator } from "../../Separator";
import { SecondaryBox } from "../../boxes/SecondaryBox";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const DropDownButton: React.FC<object> = () => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);
  const [allShowSelected, setAllShowSelected] = useState(false);
  const [techPostSelected, setTechPostSelected] = useState(false);
  const [securitySelected, setSecuritySelected] = useState(false);
  const [cosmosSelected, setCosmosSelected] = useState(false);
  const [gnolandSelected, setGnolandSelected] = useState(false);
  const [blogPostSelected, setBlogPostSelected] = useState(false);
  const [videosSelected, setVideosSelected] = useState(false);
  const [articlesSelected, setArticlesSelected] = useState(false);

  return (
    <View style={{ flexDirection: "column" }}>
      <TertiaryBox
        width={181}
        height={50}
        mainContainerStyle={{
          backgroundColor: neutral11,
          borderColor: secondaryColor,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVG source={SortIcon} />
          <BrandText
            style={[
              {
                marginLeft: layout.padding_x0_5,
                marginRight: layout.padding_x0_5,
              },
              fontSemibold14,
            ]}
          >
            Content to Show
          </BrandText>
          <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
            <SVG
              source={
                isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG
              }
              width={16}
              height={16}
              color={secondaryColor}
            />
          </TouchableOpacity>
        </View>
      </TertiaryBox>

      {/* DropDown Menu */}

      {isDropdownOpen(dropdownRef) && (
        <SecondaryBox
          width={185}
          height={350}
          style={{
            position: "absolute",
            top: 42,
            marginTop: layout.padding_x1_5,
          }}
          mainContainerStyle={{ backgroundColor: codGrayColor }}
        >
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              height: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                marginLeft: layout.padding_x4,
                marginTop: layout.padding_x1_5,
                flexDirection: "row",
              }}
            >
              <Checkbox
                value={allShowSelected}
                onValueChange={() => {
                  setTechPostSelected(!allShowSelected);
                  setSecuritySelected(!allShowSelected);
                  setCosmosSelected(!allShowSelected);
                  setGnolandSelected(!allShowSelected);
                  setBlogPostSelected(!allShowSelected);
                  setVideosSelected(!allShowSelected);
                  setArticlesSelected(!allShowSelected);
                  setAllShowSelected(!allShowSelected);
                }}
                color={allShowSelected ? primaryColor : secondaryColor}
              />
              <BrandText
                style={[
                  {
                    marginLeft: layout.padding_x1_5,
                    marginRight: layout.padding_x0_5,
                  },
                  fontSemibold14,
                ]}
              >
                Show All
              </BrandText>
            </View>

            <Separator
              style={{
                borderBottomWidth: 1,
                borderColor: neutral44,
                width: "100%",
                marginTop: layout.padding_x0_5,
                marginBottom: layout.padding_x0_5,
              }}
              color={neutral44}
            />

            <View
              style={{
                marginLeft: layout.padding_x4,
                flexDirection: "row",
              }}
            >
              <Checkbox
                value={techPostSelected}
                onValueChange={() => {
                  setTechPostSelected(!techPostSelected);
                  setSecuritySelected(!techPostSelected);
                  setCosmosSelected(!techPostSelected);
                  setGnolandSelected(!techPostSelected);
                }}
                color={techPostSelected ? primaryColor : secondaryColor}
              />
              <BrandText
                style={[
                  {
                    marginLeft: layout.padding_x1_5,
                    marginRight: layout.padding_x0_5,
                  },
                  fontSemibold14,
                ]}
              >
                Tech Post
              </BrandText>
            </View>

            <View
              style={{
                marginLeft: 65,
                marginRight: layout.padding_x2,
              }}
            >
              <View
                style={{
                  marginTop: layout.padding_x2,
                  flexDirection: "row",
                }}
              >
                <Checkbox
                  value={securitySelected}
                  onValueChange={() => {
                    setSecuritySelected(!securitySelected);
                  }}
                  color={securitySelected ? primaryColor : secondaryColor}
                />
                <BrandText
                  style={[
                    {
                      marginLeft: layout.padding_x1_5,
                      marginRight: layout.padding_x0_5,
                    },
                    fontSemibold14,
                  ]}
                >
                  Security
                </BrandText>
              </View>

              <View
                style={{
                  marginTop: layout.padding_x2,
                  flexDirection: "row",
                }}
              >
                <Checkbox
                  value={cosmosSelected}
                  onValueChange={() => {
                    setCosmosSelected(!cosmosSelected);
                  }}
                  color={cosmosSelected ? primaryColor : secondaryColor}
                />
                <BrandText
                  style={[
                    {
                      marginLeft: layout.padding_x1_5,
                      marginRight: layout.padding_x0_5,
                    },
                    fontSemibold14,
                  ]}
                >
                  Cosmos
                </BrandText>
              </View>

              <View
                style={{
                  marginTop: layout.padding_x2,
                  flexDirection: "row",
                }}
              >
                <Checkbox
                  value={gnolandSelected}
                  onValueChange={() => {
                    setGnolandSelected(!gnolandSelected);
                  }}
                  color={gnolandSelected ? primaryColor : secondaryColor}
                />
                <BrandText
                  style={[
                    {
                      marginLeft: layout.padding_x1_5,
                      marginRight: layout.padding_x0_5,
                    },
                    fontSemibold14,
                  ]}
                >
                  Gnoland
                </BrandText>
              </View>
            </View>

            <Separator
              style={{
                borderBottomWidth: 1,
                borderColor: neutral44,
                width: "100%",
                marginTop: layout.padding_x0_5,
                marginBottom: layout.padding_x0_5,
              }}
              color={neutral44}
            />

            <View style={{ marginLeft: layout.padding_x4 }}>
              <View style={{ flexDirection: "row" }}>
                <Checkbox
                  value={blogPostSelected}
                  onValueChange={() => {
                    setBlogPostSelected(!blogPostSelected);
                    setVideosSelected(!blogPostSelected);
                    setArticlesSelected(!blogPostSelected);
                  }}
                  color={blogPostSelected ? primaryColor : secondaryColor}
                />
                <BrandText
                  style={[
                    {
                      marginLeft: layout.padding_x1_5,
                      marginRight: layout.padding_x0_5,
                    },
                    fontSemibold14,
                  ]}
                >
                  Blog Post
                </BrandText>
              </View>

              <View
                style={{
                  marginTop: layout.padding_x2_5,
                  marginLeft: layout.padding_x4,
                  marginBottom: layout.padding_x0_5,
                  marginRight: layout.padding_x2,
                }}
              >
                <View
                  style={{
                    marginBottom: layout.padding_x2,
                    flexDirection: "row",
                  }}
                >
                  <Checkbox
                    value={videosSelected}
                    onValueChange={() => {
                      setVideosSelected(!videosSelected);
                    }}
                    color={videosSelected ? primaryColor : secondaryColor}
                  />
                  <BrandText
                    style={[
                      {
                        marginLeft: layout.padding_x1_5,
                        marginRight: layout.padding_x0_5,
                      },
                      fontSemibold14,
                    ]}
                  >
                    Videos
                  </BrandText>
                </View>
                <View
                  style={{
                    marginBottom: layout.padding_x2,
                    flexDirection: "row",
                  }}
                >
                  <Checkbox
                    value={articlesSelected}
                    onValueChange={() => {
                      setArticlesSelected(!articlesSelected);
                    }}
                    color={articlesSelected ? primaryColor : secondaryColor}
                  />
                  <BrandText
                    style={[
                      {
                        marginLeft: layout.padding_x1_5,
                        marginRight: layout.padding_x0_5,
                      },
                      fontSemibold14,
                    ]}
                  >
                    Articles
                  </BrandText>
                </View>
              </View>
            </View>
          </View>
        </SecondaryBox>
      )}
    </View>
  );
};
