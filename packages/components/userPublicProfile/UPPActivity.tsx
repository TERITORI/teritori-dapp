import React from "react";
import { View } from "react-native";

import { fakeActivities } from "../../utils/fakeData/userPublicProfile";
import { layout } from "../../utils/style/layout";
import { ActivityCard } from "../cards/ActivityCard";
import { FilterButton } from "../sorts/FilterButton";
import { SearchInput } from "../sorts/SearchInput";

export const UPPActivity: React.FC = () => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: layout.padding_x2_5 / 2,
          marginBottom: layout.padding_x2_5,
        }}
      >
        <FilterButton style={{ marginRight: layout.padding_x2 }} />
        {/*TODO: Too long (See at right on the render)*/}
        <SearchInput />
      </View>

      {fakeActivities.map((activity, index) => (
        <ActivityCard
          activity={activity}
          style={{ marginBottom: layout.padding_x1_5 }}
          key={index}
        />
      ))}
    </>
  );
};
