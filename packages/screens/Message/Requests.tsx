import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";

import nullIcon from "../../../assets/icons/illustration.svg";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import { MessageBlankFiller } from "../../components/blankFiller/MessageBlankFiller";
import { TextInputCustomBorder } from "../../components/inputs/TextInputCustomBorder";
import RequestList from "../../components/requests/Request";
import { SpacerColumn } from "../../components/spacer";
import { selectContactRequestList } from "../../store/slices/message";
import { neutral33 } from "../../utils/style/colors";
import { ContactRequest } from "../../utils/types/message";

interface RequestProps {
  items: ContactRequest[];
}

export const Requests = ({ items }: RequestProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const contactRequestList = useSelector(selectContactRequestList);
  const filteredItems = items;
  // .filter((item) =>
  //   item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  return (
    <View>
      <TextInputCustomBorder
        placeHolder="Search..."
        style={{ backgroundColor: "#000" }}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <SpacerColumn size={2} />

      <SpacerColumn size={1} />
      {filteredItems?.length > 0 ? (
        contactRequestList?.map((item) => (
          <View key={item.id}>
            <ScrollView>
              <RequestList data={item} />
            </ScrollView>
          </View>
        ))
      ) : (
        <MessageBlankFiller />
      )}
    </View>
  );
};
