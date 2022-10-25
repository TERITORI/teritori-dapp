import React, { useState } from "react";
import { View, ScrollView, Image } from "react-native";

import starIcon from "../../../assets/icons/findAJob/star.svg";
import { BrandText } from "../../components/BrandText/BrandText";
import { SVG } from "../../components/SVG/svg";
import ModalBase from "../../components/modals/ModalBase";
import image from "../../screens/FindAJob/ava.png";
import {
  neutral44,
  neutralA3,
  neutral22,
  neutral77,
} from "../../utils/style/colors";
import { fontSemibold12, fontSemibold20 } from "../../utils/style/fonts";
import { Separator } from "../Separator";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const JobDetails: React.FC<{
  jobTitle: string;
  jobLocation: string;
  jobType: string;
  jobDate: string;
  tags: string[];
  visible?: boolean;
  onClose: () => void;
}> = ({ visible, onClose, jobLocation, jobType, jobDate, jobTitle, tags }) => {
  const [displayJobDetails, setDisplayJobDetails] = useState(visible);

  return (
    <ModalBase
      onClose={() => {
        onClose();
        setDisplayJobDetails(false);
      }}
      label="Job Details"
      visible={displayJobDetails}
      width={800}
      childrenBottom={
        <>
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
              alignContent: "center",
              justifyContent: "center",
              margin: 10,
              alignSelf: "center",
            }}
          >
            <PrimaryButton size="SM" text="Apply to this offer" />
          </View>
        </>
      }
    >
      <ScrollView style={{ height: 650 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <BrandText>{jobTitle}</BrandText>
          <View style={{ bottom: 10, width: 60, right: "3%" }}>
            <Image source={image} />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: 300,
            right: 15,
            marginTop: 5,
          }}
        >
          <View style={{ left: 4 }}>
            <SVG source={starIcon} width={16} height={16} />
          </View>
          <View>
            <BrandText
              style={[
                fontSemibold12,
                {
                  color: neutralA3,
                },
              ]}
            >
              {jobLocation}
            </BrandText>
          </View>
          <View style={{ left: 4 }}>
            <SVG source={starIcon} width={16} height={16} />
          </View>
          <View>
            <BrandText
              style={[
                fontSemibold12,
                {
                  color: neutralA3,
                },
              ]}
            >
              {jobType}
            </BrandText>
          </View>
          <View style={{ left: 4 }}>
            <SVG source={starIcon} width={16} height={16} />
          </View>
          <View>
            <BrandText
              style={[
                fontSemibold12,
                {
                  color: neutralA3,
                },
              ]}
            >
              {jobDate}
            </BrandText>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            top: 10,
            marginBottom: 30,
          }}
        >
          {tags.map((tag, index) => (
            <View
              key={index}
              style={{
                backgroundColor: neutral22,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <BrandText
                style={[
                  fontSemibold12,
                  {
                    color: neutral77,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 4,
                    paddingBottom: 4,
                  },
                ]}
              >
                {tag}
              </BrandText>
            </View>
          ))}
        </View>

        <View
          style={{
            marginTop: 20,

            flexDirection: "column",
            marginBottom: 20,
          }}
        >
          <BrandText
            style={[
              fontSemibold20,
              {
                marginBottom: 10,
              },
            ]}
          >
            About the project
          </BrandText>
          <BrandText
            style={[
              fontSemibold12,
              {
                color: neutralA3,
              },
            ]}
          >
            Berty is a highly encrypted, distributed messenger being developed
            by people who want to take privacy and security to the next level.
            It uses cryptography, P2P, and low-level drivers to achieve having
            privacy, resilience, and simplicity. If you're a like-minded
            individual and find those challenges interesting, you're welcome to
            get in touch for a potential collaboration.
          </BrandText>
        </View>

        <View
          style={{
            marginTop: 20,

            flexDirection: "column",
            marginBottom: 20,
          }}
        >
          <BrandText
            style={[
              fontSemibold20,
              {
                marginBottom: 10,
              },
            ]}
          >
            Outcomes
          </BrandText>
          <BrandText
            style={[
              fontSemibold12,
              {
                color: neutralA3,
              },
            ]}
          >
            {"\u2022"} Participating in all development phases until delivery
            and production;
            {"\n"}
            {"\u2022"} Leading some R&D topics about cryptography;
            {"\n"}
            {"\u2022"} Auditing and reviewing cryptography implementations;
            {"\n"}
            {"\u2022"} Participating in writing guidelines and making sure the
            team is following them;
            {"\n"}
            {"\u2022"} Choosing the most appropriate pieces of technology
            regarding the needs of the product;
            {"\n"}
            {"\u2022"} Writing tests and technical documentations;
            {"\n"}
            {"\u2022"} Participating in general brainstorms, providing
            suggestions, including in strategy and internal processes.
          </BrandText>
        </View>

        <View
          style={{
            marginTop: 20,

            flexDirection: "column",
            marginBottom: 20,
          }}
        >
          <BrandText
            style={[
              fontSemibold20,
              {
                marginBottom: 10,
              },
            ]}
          >
            Working at NXTPOP
          </BrandText>
          <BrandText
            style={[
              fontSemibold12,
              {
                color: neutralA3,
              },
            ]}
          >
            {"\u2022"} A small team of 10 young & passionate people
            {"\n"}
            {"\u2022"} Full time position
            {"\n"}
            {"\u2022"} Competitive salary
            {"\n"}
            {"\u2022"} Hardware of your choice (Last generation MacBook Pro...)
            {"\n"}
            {"\u2022"} Offices based in Paris, FRANCE
            {"\n"}
            {"\u2022"} Regular events
            {"\u2022"} A small team of 10 young & passionate people
            {"\n"}
            {"\u2022"} Full time position
          </BrandText>
        </View>
      </ScrollView>
    </ModalBase>
  );
};
