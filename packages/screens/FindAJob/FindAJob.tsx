import React from "react";
import { View, Image } from "react-native";

import findAJobBanner from "../../../assets/Banner/findAJobBanner.png";
import { ScreenContainer } from "../../components/ScreenContainer";
import { FirstNavBar } from "../../components/findJob/FirstNavBar";
import { SecondNavBar } from "../../components/findJob/SecondNavBar";
import { neutral33 } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { JobCard } from "./JobCard";
import data from "./test.json";

export const FindAJob: React.FC = () => {
  return (
    <ScreenContainer>
      <View
        style={{
          width: "100%",
        }}
      >
        <Image
          source={findAJobBanner}
          style={{
            width: 1092,
            height: 400,
          }}
        />
      </View>
      <View
        style={{
          marginTop: layout.padding_x1,
        }}
      >
        <View
          style={{
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
            marginTop: layout.padding_x1,
          }}
        >
          <FirstNavBar />
        </View>
      </View>

      <View
        style={{
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
        }}
      >
        <SecondNavBar />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: layout.padding_x2,
          width: "100%",
          zIndex: -1,
        }}
      >
        {data.jobs.map((item, index) => (
          <JobCard
            job_title={item.job_title}
            country={item.content.country}
            jobtype={item.content.jobtype}
            date={item.content.date}
            tags={item.tags}
            key={index}
          />
        ))}
      </View>
    </ScreenContainer>
  );
};
