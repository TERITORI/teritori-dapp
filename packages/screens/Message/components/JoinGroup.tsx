import React, { useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { ErrorText } from "../../../components/ErrorText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { selectContactInfo } from "../../../store/slices/message";
import { neutral00, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { weshServices } from "../../../weshnet/client";
interface CreateConversationProps {
  onClose: () => void;
}

export const JoinGroup = ({ onClose }: CreateConversationProps) => {
  const contactInfo = useSelector(selectContactInfo);
  const { setToastSuccess, setToastError } = useFeedbacks();
  const [groupLink, setGroupLink] = useState("");
  const [joinGroupLoading, setJoinGroupLoading] = useState(false);
  const [error, setError] = useState("");
  const isMobile = useIsMobile();

  const handleJoinGroup = async (link = groupLink) => {
    setJoinGroupLoading(true);
    setError("");

    try {
      await weshServices.multiMemberGroupJoin(link, contactInfo);
      setToastSuccess({
        title: "Group joined!",
        message: "Group joined successfully",
      });
      onClose();
    } catch (err: any) {
      setError(err?.message);
      setToastError({
        title: "Group join error",
        message: err?.message,
      });
    }

    setJoinGroupLoading(false);
  };

  return (
    <ModalBase
      label="Join Group"
      onClose={onClose}
      visible
      width={590}
      scrollable
    >
      <KeyboardAwareScrollView>
        <View>
          <BrandText
            style={[fontSemibold16, { marginBottom: layout.spacing_x1 }]}
          >
            Join Group
          </BrandText>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <View style={{ height: 50, width: isMobile ? "100%" : 460 }}>
              <TextInputCustom
                name="groupLink"
                label=""
                placeHolder="Paste group link here"
                height={50}
                fullWidth
                onChangeText={setGroupLink}
                value={groupLink}
                containerStyle={{
                  flex: 1,
                }}
                placeholderTextColor={secondaryColor}
                squaresBackgroundColor={neutral00}
              />
            </View>
            <SpacerRow size={2} />
            {isMobile && <SpacerColumn size={2} />}
            <PrimaryButton
              loader
              isLoading={joinGroupLoading}
              size="M"
              text="Join"
              onPress={handleJoinGroup}
              fullWidth={isMobile}
            />
          </View>
          {!!error && (
            <>
              <SpacerColumn size={2} />
              <ErrorText>{error}</ErrorText>
            </>
          )}
          <SpacerColumn size={3} />
        </View>
      </KeyboardAwareScrollView>
    </ModalBase>
  );
};
