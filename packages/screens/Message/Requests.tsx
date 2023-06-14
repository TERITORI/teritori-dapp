import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";

import nullIcon from "../../../assets/icons/illustration.svg";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import { TextInputCustomBorder } from "../../components/inputs/TextInputCustomBorder";
import RequestList from "../../components/requests/Request";
import { SpacerColumn } from "../../components/spacer";
import { selectContactRequestList } from "../../store/slices/message";
import { neutral33 } from "../../utils/style/colors";

export const Requests = ({ items }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const contactRequestList = useSelector(selectContactRequestList);
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <View>
      {/* FIXME: remaining in web */}
      {/* <Separator horizontal={false} />
      <SpacerColumn size={1} /> */}
      <TextInputCustomBorder
        placeHolder="Search..."
        style={{ backgroundColor: "#000" }}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <SpacerColumn size={2} />
      {/* <Separator horizontal={false} color={neutral33} /> */}
      <SpacerColumn size={1} />
      {filteredItems?.length > 0 ? (
        contactRequestList?.map((item) => (
          <View key={items[0].id}>
            <ScrollView>
              <RequestList
                avatar={items[0].avatar}
                name={items[0].name}
                isOnline={items[0].isOnline}
                data={item}
              />
            </ScrollView>
          </View>
        ))
      ) : (
        <>
          <SpacerColumn size={12} />

          <SVG source={nullIcon} style={{ alignSelf: "center" }} />
        </>
      )}
    </View>
  );
};
