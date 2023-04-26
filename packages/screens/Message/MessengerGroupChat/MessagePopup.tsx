import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

import avatar from "../../../../assets/icons/avatar.svg";
import copy from "../../../../assets/icons/copy.svg";
import deleteicon from "../../../../assets/icons/delete.svg";
import farward from "../../../../assets/icons/farward.svg";
import farwardto from "../../../../assets/icons/farwardto.svg";
import reply from "../../../../assets/icons/reply.svg";
import searchSVG from "../../../../assets/icons/search.svg";
import select from "../../../../assets/icons/select.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
const data = [
  {
    icon: avatar,
    name: "John  Robert ",
  },
  {
    icon: avatar,
    name: "John  Robert",
  },
  {
    icon: avatar,
    name: "John  Robert",
  },
  {
    icon: avatar,
    name: "John  Robert",
  },
  {
    icon: avatar,
    name: "John  Robert",
  },
];
const MessagePopup = () => {
  const [isForwarding, setIsForwarding] = useState(false);
  const handleForwardClick = () => {
    setIsForwarding(true);
  };
  const ITEM_HEIGHT = 50;
  return (
    <View>
      <TouchableOpacity>
        <FlexRow>
          <SVG source={reply} height={16} width={16} color={neutralA3} />
          <SpacerRow size={1} />
          <Text style={[fontSemibold13, { color: neutralA3 }]}>Reply</Text>
        </FlexRow>
      </TouchableOpacity>

      <SpacerColumn size={1} />

      <TouchableOpacity onPress={handleForwardClick}>
        <FlexRow>
          <SVG source={farwardto} height={16} width={16} color={neutralA3} />
          <SpacerRow size={1} />
          <Text style={[fontSemibold13, { color: neutralA3 }]}>Forward to</Text>
          <SpacerRow size={2} />
          <SVG
            source={farward}
            height={16}
            width={16}
            color={neutralA3}
            style={{ marginTop: 4 }}
          />
        </FlexRow>
      </TouchableOpacity>
      {isForwarding && (
        <View style={[styles.forwardContainer, { maxHeight: 4 * ITEM_HEIGHT }]}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <SVG source={searchSVG} width={16} height={16} />
            <TextInput
              placeholder="Search"
              // value={value}
              // onChangeText={handleChangeText}
              // onKeyPress={(event) =>
              //   handleKeyPress({ event, onPressEnter })
              // }

              placeholderTextColor="#999999"
              style={{
                fontSize: 14,
                color: "white",
                fontFamily: "Exo_600SemiBold",
                marginLeft: 11,
              }}
            />
          </View>
          <SpacerColumn size={2} />
          <Separator />
          <SpacerColumn size={2} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {data.map((item, index) => (
              <View style={{ maxHeight: ITEM_HEIGHT }}>
                <FlexRow key={index}>
                  <SVG source={item.icon} height={24} width={24} />
                  <SpacerRow size={2} />
                  <BrandText style={fontSemibold13}>{item.name}</BrandText>
                </FlexRow>
                <SpacerColumn size={2} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      <SpacerColumn size={1} />
      <Separator />
      <SpacerColumn size={1} />
      <TouchableOpacity>
        <FlexRow>
          <SVG source={copy} height={20} width={20} color={neutralA3} />
          <SpacerRow size={1} />
          <Text style={[fontSemibold13, { color: neutralA3 }]}>Copy text</Text>
        </FlexRow>
      </TouchableOpacity>
      <SpacerColumn size={1} />
      <TouchableOpacity>
        <FlexRow>
          <SVG source={select} height={16} width={16} color={neutralA3} />
          <SpacerRow size={1} />
          <Text style={[fontSemibold13, { color: neutralA3 }]}>Select</Text>
        </FlexRow>
      </TouchableOpacity>
      <SpacerColumn size={1} />
      <Separator />
      <SpacerColumn size={1} />
      <TouchableOpacity>
        <FlexRow>
          <SVG source={deleteicon} height={16} width={16} color={neutralA3} />
          <SpacerRow size={1} />
          <Text style={[fontSemibold13, { color: neutralA3 }]}>Delete</Text>
        </FlexRow>
      </TouchableOpacity>
    </View>
  );
};
export default MessagePopup;
const styles = StyleSheet.create({
  forwardContainer: {
    backgroundColor: "rgba(41, 41, 41, 0.8)",
    padding: 20,

    borderRadius: 16,
    // width: "auto",
    zIndex: 11111,
    position: "absolute",
    right: -225,
  },
  forwardText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  receiverText: {
    fontSize: 14,
  },
});
