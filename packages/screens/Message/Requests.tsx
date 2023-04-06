import React from "react";
import { View } from "react-native";

import { Separator } from "../../components/Separator";
import { TextInputCustomBorder } from "../../components/inputs/TextInputCustomBorder";
import RequestList from "../../components/requests/Request";
import data from "../../components/requests/data";
import { SpacerColumn } from "../../components/spacer";
const Requests = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Separator horizontal={false} />
      <SpacerColumn size={2} />
      <TextInputCustomBorder
        placeHolder="Search..."
        style={{ backgroundColor: "#000" }}
      />
      <SpacerColumn size={1} />
      {data.map((item) => (
        <RequestList
          avatar={item.avatar}
          name={item.name}
          isOnline={item.isOnline}
        />
      ))}
    </View>
  );
};

export default Requests;
