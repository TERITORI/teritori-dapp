import React from "react";
import { View } from "react-native";

import RequestList from "../../components/requests/Request";
import data from "../../components/requests/data";
const Requests = () => {
  return (
    <View>
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
