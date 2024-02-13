import { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import friendGraySVG from "../../../../../assets/icons/friend-gray.svg";
import { weshServices } from "../../../../weshnet";
import { CustomButton } from "../../components/Button/CustomButton";
import MiniTextInput from "../../components/MiniTextInput";
import MobileModal from "../../components/MobileModal";
import TitleBar from "../../components/TitleBar";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { selectContactInfo } from "@/store/slices/message";
import {
  neutral33,
  neutralA3,
  redDefault,
  withAlpha,
} from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export default function FriendRequestModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const contactInfo = useSelector(selectContactInfo);
  const [contactLink, setContactLink] = useState("");
  const [addContactLoading, setAddContactLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddContact = async () => {
    setAddContactLoading(true);
    setError("");

    try {
      if (!contactLink) {
        setError("Please provide the link.");
        setAddContactLoading(false);
        return;
      }

      await weshServices.addContact(contactLink, contactInfo);
      onClose();
    } catch (err: any) {
      console.log(err);
      setError("Failed to add contact.");
    }

    setAddContactLoading(false);
  };

  return (
    <MobileModal
      visible={visible}
      onClose={onClose}
      innerContainerOptions={{ height: "40%" }}
    >
      <View
        style={{
          padding: layout.spacing_x2,
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TitleBar
          title="Add a Friend"
          subTitle="Please paste the contact link below"
          icon={friendGraySVG}
        />

        <View style={{ width: "100%" }}>
          {error && (
            <BrandText
              style={[
                fontMedium14,
                {
                  marginBottom: layout.spacing_x1,
                  color: redDefault,
                  paddingLeft: layout.spacing_x1_5,
                },
              ]}
            >
              {error}
            </BrandText>
          )}
          <MiniTextInput
            placeholder="contact link"
            style={{ backgroundColor: withAlpha(neutral33, 0.9) }}
            placeholderTextColor={neutralA3}
            value={contactLink}
            onChangeText={setContactLink}
          />
          <SpacerColumn size={1.5} />
          <CustomButton
            onPress={handleAddContact}
            title="Add"
            isDisabled={addContactLoading}
          />
        </View>
      </View>
    </MobileModal>
  );
}
