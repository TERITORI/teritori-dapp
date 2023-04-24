import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import copy from "../../../../assets/icons/copy.svg";
import deleteicon from "../../../../assets/icons/delete.svg";
import farward from "../../../../assets/icons/farward.svg";
import farwardto from "../../../../assets/icons/farwardto.svg";
import reply from "../../../../assets/icons/reply.svg";
import select from "../../../../assets/icons/select.svg";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";

const MessagePopup = () => {
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

      <TouchableOpacity>
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
