import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import KeplrLogo from "../../../assets/keplrLogo.png";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { BrandText } from "../BrandText/BrandText";
import ModalBase from "../modals/ModalBase";

export const RegisterScreen: React.FC<{
  visible?: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [displayConfirmation, setDisplayConfirmation] = useState(visible);

  function handleConfirmClick() {
    onClose();
    console.log(displayConfirmation);
    setDisplayConfirmation(false);
  }

  return (
    <ModalBase
      onClose={() => {
        handleConfirmClick();
        console.log(displayConfirmation);
      }}
      label="Sign Up"
      visible={displayConfirmation}
      width={480}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <TouchableOpacity>
          <TertiaryBox
            width={440}
            height={50}
            mainContainerStyle={{ borderColor: "#FFFFFF", borderWidth: 1 }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <img src={KeplrLogo} />
              <BrandText style={{ fontSize: 14 }}>
                Sign with Keplr to prove your ownership of this account
              </BrandText>
            </View>
          </TertiaryBox>
        </TouchableOpacity>
      </View>
    </ModalBase>
  );
};
