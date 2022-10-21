import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { CgSortAz } from "react-icons/cg";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { View, StyleProp, ViewStyle, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";

import pathwarBanner from "../../../../assets/Banner/resourcesBanner.svg";
import resourceLogo from "../../../../assets/LogoPathwarOverview/ResourceLogo.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { neutral44 } from "../../../utils/style/colors";
import { ResourceBox } from "./ResourceBox";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
      style,
    ]}
  />
);

export const ResourceScreen: React.FC = () => {
  const [isMoreDisplayed, setIsMoreDisplayed] = useState(true);
  const [allShowSelected, setAllShowSelected] = useState(false);
  const [techPostSelected, setTechPostSelected] = useState(false);
  const [securitySelected, setSecuritySelected] = useState(false);
  const [cosmosSelected, setCosmosSelected] = useState(false);
  const [gnolandSelected, setGnolandSelected] = useState(false);
  const [blogPostSelected, setBlogPostSelected] = useState(false);
  const [videosSelected, setVideosSelected] = useState(false);
  const [articlesSelected, setArticlesSelected] = useState(false);

  return (
    <ScreenContainer sizeScreenContaier={40}>
      <View>
        <SVG
          source={pathwarBanner}
          style={{
            height: 400,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SVG source={resourceLogo} style={{ width: "9%" }} />
          <View style={{ marginTop: 30 }} />
        </SVG>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: -10,
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <TertiaryBox
            width={181}
            height={50}
            mainContainerStyle={{
              backgroundColor: "#1C1C1C",
              borderColor: "#3D3D3D",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CgSortAz color="white" />
              <BrandText
                style={{ marginLeft: 5, marginRight: 5, fontSize: 14 }}
              >
                Content to show
              </BrandText>
              <TouchableOpacity
                onPress={() => setIsMoreDisplayed(!isMoreDisplayed)}
              >
                {isMoreDisplayed ? (
                  <FiChevronDown color="white" />
                ) : (
                  <FiChevronUp color="white" />
                )}
              </TouchableOpacity>
            </View>
          </TertiaryBox>

          {/* DropDown Menu */}

          {isMoreDisplayed && (
            <TertiaryBox
              width={230}
              height={350}
              mainContainerStyle={{ backgroundColor: "#1C1C1C" }}
              style={{ marginTop: 10 }}
            >
              <View
                style={{
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <View style={{}}>
                  <CheckBox
                    title={
                      <BrandText
                        style={{ marginLeft: 10, marginRight: 5, fontSize: 14 }}
                      >
                        Show All
                      </BrandText>
                    }
                    checked={allShowSelected}
                    onPress={() => {
                      setTechPostSelected(!allShowSelected);
                      setSecuritySelected(!allShowSelected);
                      setCosmosSelected(!allShowSelected);
                      setGnolandSelected(!allShowSelected);
                      setBlogPostSelected(!allShowSelected);
                      setVideosSelected(!allShowSelected);
                      setArticlesSelected(!allShowSelected);
                      setAllShowSelected(!allShowSelected);
                    }}
                    size={20}
                    containerStyle={{
                      height: 20,
                      marginTop: 5,
                      backgroundColor: "#1C1C1C",
                      borderColor: "#1C1C1C",
                      alignContent: "center",
                    }}
                  />
                </View>
                <Separator style={{ marginTop: 20 }} />

                <View style={{ margin: 1 }}>
                  <CheckBox
                    title={
                      <BrandText
                        style={{ marginLeft: 10, marginRight: 5, fontSize: 14 }}
                      >
                        Tech Post
                      </BrandText>
                    }
                    size={20}
                    checked={techPostSelected}
                    onPress={() => {
                      setTechPostSelected(!techPostSelected);
                      setSecuritySelected(!techPostSelected);
                      setCosmosSelected(!techPostSelected);
                      setGnolandSelected(!techPostSelected);
                    }}
                    containerStyle={{
                      height: 10,
                      backgroundColor: "#1C1C1C",
                      borderColor: "#1C1C1C",
                      alignContent: "center",
                    }}
                  />
                </View>

                <View
                  style={{
                    marginLeft: 35,
                    marginRight: 17,
                  }}
                >
                  <View style={{ marginBottom: 7 }}>
                    <CheckBox
                      title={
                        <BrandText
                          style={{
                            marginLeft: 10,
                            marginRight: 5,
                            fontSize: 14,
                          }}
                        >
                          Security
                        </BrandText>
                      }
                      size={20}
                      checked={securitySelected}
                      onPress={() => {
                        setSecuritySelected(!securitySelected);
                      }}
                      containerStyle={{
                        height: 10,
                        backgroundColor: "#1C1C1C",
                        borderColor: "#1C1C1C",
                        alignContent: "center",
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: 7 }}>
                    <CheckBox
                      title={
                        <BrandText
                          style={{
                            marginLeft: 10,
                            marginRight: 5,
                            fontSize: 14,
                          }}
                        >
                          Cosmos
                        </BrandText>
                      }
                      size={20}
                      checked={cosmosSelected}
                      onPress={() => {
                        setCosmosSelected(!cosmosSelected);
                      }}
                      containerStyle={{
                        height: 10,
                        backgroundColor: "#1C1C1C",
                        borderColor: "#1C1C1C",
                        alignContent: "center",
                      }}
                    />
                  </View>

                  <CheckBox
                    title={
                      <BrandText
                        style={{ marginLeft: 10, marginRight: 5, fontSize: 14 }}
                      >
                        Gnoland
                      </BrandText>
                    }
                    size={20}
                    checked={gnolandSelected}
                    onPress={() => {
                      setGnolandSelected(!gnolandSelected);
                    }}
                    containerStyle={{
                      height: 10,
                      backgroundColor: "#1C1C1C",
                      borderColor: "#1C1C1C",
                      alignContent: "center",
                    }}
                  />
                </View>
                {/* <View> */}
                <Separator style={{ marginTop: 20 }} />
                {/* </View> */}
                <View style={{}}>
                  <CheckBox
                    title={
                      <BrandText
                        style={{ marginLeft: 10, marginRight: 5, fontSize: 14 }}
                      >
                        Blog Post
                      </BrandText>
                    }
                    size={20}
                    checked={blogPostSelected}
                    onPress={() => {
                      setBlogPostSelected(!blogPostSelected);
                      setVideosSelected(!blogPostSelected);
                      setArticlesSelected(!blogPostSelected);
                    }}
                    containerStyle={{
                      height: 10,
                      backgroundColor: "#1C1C1C",
                      borderColor: "#1C1C1C",
                      alignContent: "center",
                    }}
                  />

                  <View
                    style={{
                      marginTop: 2,
                      marginLeft: 27,
                      marginBottom: 5,
                      marginRight: 17,
                    }}
                  >
                    <View style={{ marginBottom: 7 }}>
                      <CheckBox
                        title={
                          <BrandText
                            style={{
                              marginLeft: 10,
                              marginRight: 5,
                              fontSize: 14,
                            }}
                          >
                            Videos
                          </BrandText>
                        }
                        size={20}
                        checked={videosSelected}
                        onPress={() => {
                          setVideosSelected(!videosSelected);
                        }}
                        containerStyle={{
                          height: 10,
                          backgroundColor: "#1C1C1C",
                          borderColor: "#1C1C1C",
                          alignContent: "center",
                        }}
                      />
                    </View>
                    <View style={{ marginBottom: 7 }}>
                      <CheckBox
                        title={
                          <BrandText
                            style={{
                              marginLeft: 10,
                              marginRight: 5,
                              fontSize: 14,
                            }}
                          >
                            Articles
                          </BrandText>
                        }
                        size={20}
                        checked={articlesSelected}
                        onPress={() => {
                          setArticlesSelected(!articlesSelected);
                        }}
                        containerStyle={{
                          height: 10,
                          backgroundColor: "#1C1C1C",
                          borderColor: "#1C1C1C",
                          alignContent: "center",
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TertiaryBox>
          )}
        </View>

        <View style={{ alignItems: "flex-start" }}>
          <TextInputCustom<{ Search: string }>
            label=""
            name="Search"
            width={270}
            placeHolder="Search..."
            mainBoxBackgroundColor="#000000"
          >
            <View style={{ right: 5 }}>
              <BiSearch color="white" />
            </View>
          </TextInputCustom>
        </View>
        <View>
          <TouchableOpacity style={{ alignItems: "flex-start" }}>
            <TertiaryBox width={172} height={50}>
              <BrandText style={{ fontSize: 14 }}>+ Suggest content</BrandText>
            </TertiaryBox>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          display: "flex",
          width: "119%",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          right: 90,
          marginTop: 20,
        }}
      >
        <ResourceBox />
        <ResourceBox />
      </View>
    </ScreenContainer>
  );
};
