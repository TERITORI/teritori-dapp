import React, { useState } from "react";
import { View, Image } from "react-native";

import starIcon from "../../../assets/icons/findAJob/star.svg";
import { BrandText } from "../../components/BrandText/BrandText";
import { SVG } from "../../components/SVG/svg";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { JobDetails } from "../../components/findJob/JobDetails";
import { neutralA3, neutral22, neutral77 } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import image from "./ava.png";

export const JobCard: React.FC<{
  job_title: string;
  country: string;
  jobtype: string;
  date: string;
  tags: string[];
}> = ({ job_title, country, jobtype, date, tags }) => {
  const [displayViewOffer, setDisplayViewOffer] = useState(false);

  function displayJobDetails() {
    if (displayViewOffer === true) {
      return (
        <JobDetails
          visible
          onClose={() => setDisplayViewOffer(false)}
          jobDate={date}
          jobLocation={country}
          jobTitle={job_title}
          jobType={jobtype}
          tags={tags}
        />
      );
    } else return null;
  }

  return (
    <View style={{ zIndex: -1 }}>
      <TertiaryBox width={520} style={{ margin: layout.padding_x1_5 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "90%",
            paddingBottom: layout.padding_x1_5,
            paddingTop: layout.padding_x1_5,
          }}
        >
          <View>
            <Image
              source={image}
              style={{ width: 60, height: 60, right: 10 }}
            />
          </View>

          <View
            style={{ flexDirection: "column", justifyContent: "space-between" }}
          >
            <View style={{ display: "flex" }}>
              <BrandText style={fontSemibold14}>{job_title}</BrandText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: layout.padding_x1,
                marginBottom: layout.padding_x1_5,
              }}
            >
              <View style={{ marginRight: layout.padding_x0_5 }}>
                <SVG source={starIcon} width={16} height={16} />
              </View>
              <View>
                <BrandText
                  style={[
                    fontSemibold12,
                    {
                      marginRight: layout.padding_x1_5,
                      color: neutralA3,
                    },
                  ]}
                >
                  {country}
                </BrandText>
              </View>
              <View style={{ marginRight: layout.padding_x0_5 }}>
                <SVG source={starIcon} width={16} height={16} />
              </View>
              <View>
                <BrandText
                  style={[
                    fontSemibold12,
                    {
                      marginRight: layout.padding_x1_5,
                      color: neutralA3,
                    },
                  ]}
                >
                  {jobtype}
                </BrandText>
              </View>
              <View style={{ marginRight: layout.padding_x0_5 }}>
                <SVG source={starIcon} width={16} height={16} />
              </View>
              <View>
                <BrandText
                  style={[
                    fontSemibold12,
                    {
                      marginRight: layout.padding_x1_5,
                      color: neutralA3,
                    },
                  ]}
                >
                  {date}
                </BrandText>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignContent: "flex-start",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                width: 275,
                marginTop: layout.padding_x0_5,
                height: "100%",
              }}
            >
              {tags.map((tag, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: neutral22,
                    borderRadius: 100,
                    width: "fit-content",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: layout.padding_x1_5,
                    marginBottom: layout.padding_x0_5,
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold12,
                      {
                        paddingLeft: layout.padding_x1_5,
                        paddingRight: layout.padding_x1_5,
                        paddingTop: layout.padding_x0_5,
                        paddingBottom: layout.padding_x0_5,
                        color: neutral77,
                      },
                    ]}
                  >
                    {tag}
                  </BrandText>
                </View>
              ))}
            </View>
          </View>

          <SecondaryButton
            size="SM"
            style={{
              left: 20,
            }}
            text="View offer"
            onPress={() => {
              setDisplayViewOffer(true);
            }}
          />
        </View>
      </TertiaryBox>
      {displayJobDetails()}
    </View>
  );
};
