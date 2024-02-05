import { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import friendGraySVG from "../../../../../assets/icons/friend-gray.svg";
import { SpacerColumn } from "../../../../components/spacer";
import { selectContactInfo } from "../../../../store/slices/message";
import {
  neutral33,
  neutralA3,
  withAlpha,
} from "../../../../utils/style/colors";
import { MOBILE_HEADER_HEIGHT, layout } from "../../../../utils/style/layout";
import { weshServices } from "../../../../weshnet";
import { Spinner } from "../../Feed/components/Spinner";
import { CustomButton } from "../../components/Button/CustomButton";
import MiniTextInput from "../../components/MiniTextInput";
import MiniToast from "../../components/MiniToast";
import MobileModal from "../../components/MobileModal";
import TitleBar from "../../components/TitleBar";
import { ToastType } from "../MiniFriendScreen";

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
  const [openToast, setOpenToast] = useState<ToastType>({
    type: undefined,
    message: "",
  });

  const handleAddContact = async () => {
    //TODO: error handling and adding loading UI
    setAddContactLoading(true);

    try {
      await weshServices.addContact(contactLink, contactInfo);
      onClose();
    } catch (err: any) {
      console.log(err);
      setOpenToast({ type: "error", message: "Error Adding contact" });
    }

    setAddContactLoading(false);
  };

  return (
    <MobileModal
      visible={visible}
      onClose={onClose}
      innerContainerOptions={{ height: "40%" }}
    >
      {openToast.type && (
        <>
          <MiniToast
            message={openToast.message}
            type={openToast.type ?? "info"}
            onClose={() => setOpenToast({ type: undefined, message: "" })}
            style={{ position: "absolute", top: -MOBILE_HEADER_HEIGHT }}
          />
          <SpacerColumn size={1.5} />
        </>
      )}
      <View
        style={{
          padding: layout.spacing_x2,
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        {addContactLoading ? (
          <View>
            <Spinner />
          </View>
        ) : (
          <>
            <TitleBar
              title="Add a Friend"
              subTitle="Please paste the contact link below"
              icon={friendGraySVG}
            />

            <View style={{ width: "100%" }}>
              <MiniTextInput
                placeholder="contact link"
                style={{ backgroundColor: withAlpha(neutral33, 0.9) }}
                placeholderTextColor={neutralA3}
                value={contactLink}
                onChangeText={setContactLink}
              />
              <SpacerColumn size={1.5} />
              <CustomButton onPress={handleAddContact} title="Add" />
            </View>
          </>
        )}
      </View>
    </MobileModal>
  );
}
