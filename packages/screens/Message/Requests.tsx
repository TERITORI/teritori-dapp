import React from "react";
import { View } from "react-native";

import { Separator } from "../../components/Separator";
import RequestList from "../../components/requests/Request";
import data from "../../components/requests/data";
import { SearchInput } from "../../components/sorts/SearchInput";
import { SpacerColumn } from "../../components/spacer";
const Requests = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Separator horizontal={false} />
      <SpacerColumn size={2} />
      <SearchInput />
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
