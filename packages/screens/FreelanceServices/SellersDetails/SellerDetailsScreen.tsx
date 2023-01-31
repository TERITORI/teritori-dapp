import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

import heart from "../../../../assets/icons/heart.svg";
import behanceIcon from "../../../../assets/icons/social-network/behance-grey.svg";
import dribbleIcon from "../../../../assets/icons/social-network/dribble-grey.svg";
import facebookIcon from "../../../../assets/icons/social-network/facebook-grey.svg";
import githubIcon from "../../../../assets/icons/social-network/github-grey.svg";
import googleIcon from "../../../../assets/icons/social-network/google-grey.svg";
import twitterIcon from "../../../../assets/icons/social-network/twitter-grey.svg";
import youtubeIcon from "../../../../assets/icons/social-network/youtube-grey.svg";
import star from "../../../../assets/icons/yellow-star.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { SecondaryCard } from "../../../components/freelanceServices/LogoDesign/LogoDesignDetails/SecondaryCard";
import {
  neutral44,
  neutral00,
  neutral77,
  yellowDefault,
  successColor,
  neutralA3,
  secondaryColor,
  neutral17,
  neutral67,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold16,
  fontSemibold20,
  fontSemibold14,
} from "../../../utils/style/fonts";
import boredApe from "./bored-ape.png";

const data = [
  "minimalist",
  "logo",
  "business",
  "vector",
  "text logo",
  "logo-with-effect",
];

const dataEducation = [
  {
    school: "B.Cs -  Information Technology",
    description: "Gujarat Technological University, India, Graduated 2014",
  },
];

const dataCertifications = [
  {
    certification: "IELTS English Language Proficiency Examination",
    description: "British Council 2014",
  },
  { certification: "Logo Design Mastery", description: "UXAcademy 2020" },
  {
    certification: "UX Designers and Branding Strategy",
    description: "Google 2021",
  },
  { certification: "Adobe Certified Expert", description: "Adobe 2015" },
];

export const SellerDetailsScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <View
        style={{ flexDirection: "column", width: 1280, alignSelf: "center" }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: 400, marginTop: 24 }}>
            <TertiaryBox fullWidth>
              <View
                style={{
                  width: 355,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: 16,
                    marginBottom: 8,
                  }}
                >
                  <SVG
                    source={heart}
                    width={24}
                    height={24}
                    style={{ marginRight: 80 }}
                  />
                  <Image
                    source={boredApe}
                    style={{ width: 104, height: 104 }}
                  />
                  <View
                    style={{
                      width: "fit-content",
                      height: "fit-content",
                      backgroundColor: neutral00,
                      borderColor: neutral44,
                      borderWidth: 0.5,
                      borderRadius: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 12,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingRight: 16,
                        paddingBottom: 8,
                        paddingLeft: 16,
                        paddingTop: 8,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: successColor,
                          width: 6,
                          height: 6,
                          borderRadius: 24,
                        }}
                      />
                      <BrandText
                        style={[
                          fontSemibold16,
                          { color: successColor, marginLeft: 4 },
                        ]}
                      >
                        {" "}
                        online
                      </BrandText>
                    </View>
                  </View>
                </View>
                <BrandText style={fontSemibold20}>username</BrandText>
                <BrandText
                  style={[
                    { color: neutralA3, marginTop: 8, marginBottom: 8 },
                    fontSemibold14,
                  ]}
                >
                  Nothing Beats the Experience!
                </BrandText>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <SVG source={star} width={24} height={24} />
                  <SVG source={star} width={24} height={24} />
                  <SVG source={star} width={24} height={24} />
                  <SVG source={star} width={24} height={24} />
                  <SVG source={star} width={24} height={24} />
                  <BrandText
                    style={[
                      { color: yellowDefault, marginRight: 12 },
                      fontMedium14,
                    ]}
                  >
                    4.9
                  </BrandText>
                  <BrandText style={[{ color: neutral77 }, fontMedium14]}>
                    (40,543)
                  </BrandText>
                </View>
                <Separator
                  style={{ width: "100%", marginTop: 12, marginBottom: 12 }}
                />
                <SecondaryButton
                  fullWidth
                  size="SM"
                  text="Contact Me"
                  backgroundColor={secondaryColor}
                  color={neutral00}
                />
                <Separator style={{ width: "100%", marginTop: 12 }} />

                <View style={{ flexDirection: "row", marginTop: 24 }}>
                  <View style={{ flexDirection: "column", width: 195 }}>
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: neutral77, marginBottom: 8 },
                      ]}
                    >
                      From
                    </BrandText>
                    <BrandText style={fontSemibold14}>India</BrandText>
                  </View>
                  <View style={{ flexDirection: "column", width: 160 }}>
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: neutral77, marginBottom: 8 },
                      ]}
                    >
                      Member Since
                    </BrandText>
                    <BrandText style={fontSemibold14}>Dec 2022</BrandText>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 8,
                    marginBottom: 16,
                  }}
                >
                  <View style={{ flexDirection: "column", width: 195 }}>
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: neutral77, marginBottom: 8 },
                      ]}
                    >
                      Avg. response time
                    </BrandText>
                    <BrandText style={fontSemibold14}>2 hours</BrandText>
                  </View>
                  <View style={{ flexDirection: "column", width: 160 }}>
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: neutral77, marginBottom: 8 },
                      ]}
                    >
                      Last delivery
                    </BrandText>
                    <BrandText style={fontSemibold14}>
                      about 11 minutes
                    </BrandText>
                  </View>
                </View>
              </View>
            </TertiaryBox>

            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BrandText style={fontSemibold20}>My Portfolio</BrandText>
              <SecondaryButton size="SM" text="See Project (7)" />
            </View>

            <View
              style={{
                width: "100%",
                justifyContent: "space-between",
                flexDirection: "row",
                marginTop: 20,
              }}
            >
              <TertiaryBox width={191} height={191} />
              <TertiaryBox width={191} height={191} />
            </View>

            <Separator
              style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
            />

            <BrandText style={fontSemibold20}>Description</BrandText>
            <BrandText
              style={[fontSemibold16, { color: neutral77, marginTop: 12 }]}
            >
              ‘We’ ‘Perfectionist’ is a highly talented and dedicated team,
              focused on providing unique logo design absolutely from scratch. A
              Logo is the face of your brand which is as equally important as
              the success of your business and we make sure to dig the pillars
              of your success from depth.
            </BrandText>

            <Separator
              style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
            />

            <BrandText style={fontSemibold20}>Languages</BrandText>
            <BrandText
              style={[fontSemibold16, { color: neutral77, marginTop: 16 }]}
            >
              English - Native/Bilingual
            </BrandText>
            <BrandText
              style={[fontSemibold16, { color: neutral77, marginTop: 16 }]}
            >
              German - Intermediate
            </BrandText>

            <Separator
              style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
            />

            <BrandText style={fontSemibold20}>Linked Accounts</BrandText>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  marginTop: 16,
                }}
              >
                <SVG
                  source={twitterIcon}
                  width={16}
                  height={16}
                  style={{ marginTop: 2 }}
                />
                <BrandText
                  style={[
                    fontSemibold16,
                    { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                  ]}
                >
                  Twitter
                </BrandText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: "row", alignContent: "center" }}>
                <SVG
                  source={behanceIcon}
                  width={16}
                  height={16}
                  style={{ marginTop: 2 }}
                />
                <BrandText
                  style={[
                    fontSemibold16,
                    { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                  ]}
                >
                  Behance
                </BrandText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: "row", alignContent: "center" }}>
                <SVG
                  source={dribbleIcon}
                  width={16}
                  height={16}
                  style={{ marginTop: 2 }}
                />
                <BrandText
                  style={[
                    fontSemibold16,
                    { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                  ]}
                >
                  Dribble
                </BrandText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: "row", alignContent: "center" }}>
                <SVG
                  source={facebookIcon}
                  width={16}
                  height={16}
                  style={{ marginTop: 2 }}
                />
                <BrandText
                  style={[
                    fontSemibold16,
                    { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                  ]}
                >
                  Facebook
                </BrandText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: "row", alignContent: "center" }}>
                <SVG
                  source={githubIcon}
                  width={16}
                  height={16}
                  style={{ marginTop: 2 }}
                />
                <BrandText
                  style={[
                    fontSemibold16,
                    { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                  ]}
                >
                  Github
                </BrandText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: "row", alignContent: "center" }}>
                <SVG
                  source={googleIcon}
                  width={16}
                  height={16}
                  style={{ marginTop: 2 }}
                />
                <BrandText
                  style={[
                    fontSemibold16,
                    { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                  ]}
                >
                  Google
                </BrandText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: "row", alignContent: "center" }}>
                <SVG
                  source={youtubeIcon}
                  width={16}
                  height={16}
                  style={{ marginTop: 2 }}
                />
                <BrandText
                  style={[
                    fontSemibold16,
                    { marginLeft: 12, color: neutralA3, marginBottom: 12 },
                  ]}
                >
                  Youtube
                </BrandText>
              </View>
            </TouchableOpacity>

            <Separator
              style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
            />

            <BrandText style={fontSemibold20}>Skills</BrandText>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              {data.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginRight: 12,
                    marginBottom: 12,
                    backgroundColor: neutral17,
                    borderRadius: 8,
                    borderColor: neutral44,
                    borderWidth: 0.5,
                  }}
                >
                  <BrandText style={[fontMedium14, { margin: 12 }]}>
                    {item}
                  </BrandText>
                </View>
              ))}
            </View>

            <Separator
              style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
            />

            <BrandText style={[fontSemibold20, { marginBottom: 16 }]}>
              Education
            </BrandText>

            {dataEducation.map((item, index) => (
              <View
                style={{ flexDirection: "column", marginBottom: 8 }}
                key={index}
              >
                <BrandText style={[fontSemibold16, { color: neutral77 }]}>
                  {item.school}
                </BrandText>
                <BrandText
                  style={[fontSemibold14, { color: neutral67, marginTop: 8 }]}
                >
                  {item.description}
                </BrandText>
              </View>
            ))}

            <Separator
              style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
            />

            <BrandText style={[fontSemibold20, { marginBottom: 16 }]}>
              Certifications
            </BrandText>

            {dataCertifications.map((item, index) => (
              <View
                style={{ flexDirection: "column", marginBottom: 12 }}
                key={index}
              >
                <BrandText style={[fontSemibold16, { color: neutral77 }]}>
                  {item.certification}
                </BrandText>
                <BrandText
                  style={[fontMedium14, { color: neutral67, marginTop: 8 }]}
                >
                  {item.description}
                </BrandText>
              </View>
            ))}
          </View>

          <SecondaryCard />
        </View>
      </View>
    </ScreenContainer>
  );
};
