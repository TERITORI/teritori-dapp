import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Modal } from "react-native";

import ShareScreen from "./ShareScreen";
import audio from "../../../../assets/chat/audiocall.svg";
import callend from "../../../../assets/chat/callend.svg";
import screenshare from "../../../../assets/chat/screenshare.svg";
import videocall from "../../../../assets/chat/videocall.svg";
import audioperson from "../../../../assets/icons/audioperson.svg";
import audiopersonsecond from "../../../../assets/icons/audiopersonsecond.svg";
import avator from "../../../../assets/icons/avatar.svg";
import dots from "../../../../assets/icons/dots.svg";
import search from "../../../../assets/icons/search.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutralA3,
  secondaryColor,
  successColor,
} from "../../../utils/style/colors";
import { fontSemibold11, fontSemibold13 } from "../../../utils/style/fonts";
interface AudioCallProps {
  setAudioCall: (value: boolean) => void;
  audioCall: boolean;
}
export const AudioCall: React.FC<AudioCallProps> = ({ setAudioCall }) => {
  const [showTertiaryBox, setShowTertiaryBox] = useState(false);
  return (
    <View>
      <FlexRow justifyContent="space-between">
        <View>
          <FlexRow>
            <SVG source={avator} />

            <SpacerRow size={1} />
            <View>
              <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
                John David
              </BrandText>
              <FlexRow>
                <View>
                  <FlexRow>
                    <View style={styles.badge} />
                    <SpacerRow size={1} />
                    <BrandText style={[fontSemibold11, { color: neutralA3 }]}>
                      Online
                    </BrandText>
                  </FlexRow>
                </View>
              </FlexRow>
            </View>
          </FlexRow>
        </View>
        <View>
          <FlexRow>
            <SpacerRow size={4} />
            <TouchableOpacity>
              <SVG
                source={search}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            </TouchableOpacity>
            <SpacerRow size={1} />
            <SVG source={dots} />

            <SpacerRow size={1} />
          </FlexRow>
        </View>
      </FlexRow>

      <SpacerColumn size={1} />

      <View style={styles.container}>
        <View>
          <View style={styles.iconRow}>
            <FlexRow>
              <SVG source={audioperson} />
              <SpacerRow size={2} />
              <SVG source={audiopersonsecond} />
            </FlexRow>
          </View>
          <SpacerColumn size={1} />
          <FlexRow style={styles.iconRow}>
            <TouchableOpacity>
              <SVG source={videocall} />
            </TouchableOpacity>
            <SpacerRow size={1.5} />
            <TouchableOpacity onPress={() => setShowTertiaryBox(true)}>
              <SVG source={screenshare} />
            </TouchableOpacity>
            <SpacerRow size={1.5} />
            <TouchableOpacity>
              <SVG source={audio} />
            </TouchableOpacity>
            <SpacerRow size={1.5} />
            <TouchableOpacity onPress={() => setAudioCall(false)}>
              <SVG source={callend} />
            </TouchableOpacity>
          </FlexRow>
        </View>
      </View>
      {/* {screenShare && <ShareScreen />} */}
      <Modal visible={showTertiaryBox} animationType="none" transparent>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.0)",
          }}
        >
          <ShareScreen setShowTertiaryBox={setShowTertiaryBox} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconRow: {
    alignSelf: "center",
  },
  badge: {
    backgroundColor: successColor,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 12,
    width: 2,
  },
});
