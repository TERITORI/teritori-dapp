import Clipboard from "@react-native-clipboard/clipboard";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

import avatar from "../../../../assets/icons/avatar.svg";
import copy from "../../../../assets/icons/copy.svg";
// import deleteicon from "../../../../assets/icons/delete.svg";
// import select from "../../../../assets/icons/select.svg";
// import forwardToSVG from "../../../assets/icons/forward-to.svg";
// import { AudioView } from "../../../components/FilePreview/AudioView";
import nullIcon from "../../../../assets/icons/illustration.svg";
import reply from "../../../../assets/icons/reply.svg";
import searchSVG from "../../../../assets/icons/search.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";

const data = [
  {
    icon: avatar,
    name: "John  Robert ",
  },
  {
    icon: avatar,
    name: "Afan Asja",
  },
  {
    icon: avatar,
    name: "Liam",
  },
  {
    icon: avatar,
    name: "Olivia",
  },
  {
    icon: avatar,
    name: "Noah",
  },
  {
    icon: avatar,
    name: "Elijah",
  },
  {
    icon: avatar,
    name: "Amelia",
  },
];

interface MessagePopupProps {
  message: string;
  isForwarding: boolean;
  setIsForwarding: Dispatch<SetStateAction<boolean>>;
  onReply: () => void;
  onClose: () => void;
}

export const MessagePopup = ({
  isForwarding,
  setIsForwarding,
  onReply,
  message,
  onClose,
}: MessagePopupProps) => {
  const { setToastSuccess } = useFeedbacks();

  const handleSearch = () => {
    // setIsForwarding(false);
  };
  const ITEM_HEIGHT = 50;
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          onReply();
          onClose();
        }}
      >
        <FlexRow>
          <SVG source={reply} height={16} width={16} color={neutralA3} />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            Reply
          </BrandText>
        </FlexRow>
      </TouchableOpacity>

      <SpacerColumn size={1} />

      {/* <TouchableOpacity onPress={handleForwardClick}>
        <FlexRow>
          <SVG source={forwardToSVG} height={16} width={16} color={neutralA3} />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            Forward to
          </BrandText>
          <SpacerRow size={2} />
          <SVG
            source={farward}
            height={16}
            width={16}
            color={neutralA3}
            style={{ marginTop: 4 }}
          />
        </FlexRow>
      </TouchableOpacity> */}

      <SpacerColumn size={1} />
      <Separator />
      <SpacerColumn size={1} />
      <TouchableOpacity
        onPress={() => {
          Clipboard.setString(message);
          setToastSuccess({
            title: "Copied",
            message: "",
          });
          onClose();
        }}
      >
        <FlexRow>
          <SVG source={copy} height={20} width={20} color={neutralA3} />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            Copy text
          </BrandText>
        </FlexRow>
      </TouchableOpacity>
      <SpacerColumn size={1} />
      {/* <TouchableOpacity>
        <FlexRow>
          <SVG source={select} height={16} width={16} color={neutralA3} />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            Select
          </BrandText>
        </FlexRow>
      </TouchableOpacity> */}
      {/* <SpacerColumn size={1} />
      <Separator />
      <SpacerColumn size={1} />
      <TouchableOpacity>
        <FlexRow>
          <SVG source={deleteicon} height={16} width={16} color={neutralA3} />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            Delete
          </BrandText>
        </FlexRow>
      </TouchableOpacity> */}
      {isForwarding && (
        <View style={[styles.forwardContainer, { maxHeight: 5 * ITEM_HEIGHT }]}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <SVG source={searchSVG} width={16} height={16} />
            <TextInput
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
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
            {filteredData.length > 0 ? (
              filteredData?.map((item, index) => (
                <TouchableOpacity onPress={handleSearch}>
                  <View style={{ maxHeight: ITEM_HEIGHT }}>
                    <FlexRow key={index}>
                      <SVG source={item.icon} height={24} width={24} />
                      <SpacerRow size={2} />
                      <BrandText style={fontSemibold13}>{item.name}</BrandText>
                    </FlexRow>
                    <SpacerColumn size={2} />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <>
                <SVG
                  source={nullIcon}
                  height={100}
                  width={100}
                  style={{ alignSelf: "center", borderRadius: 10 }}
                />
              </>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  forwardContainer: {
    backgroundColor: "rgba(41, 41, 41, 0.8)",

    padding: 20,

    borderRadius: 16,
    width: 170,
    zIndex: 11111,
    position: "absolute",
    right: -170,
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
