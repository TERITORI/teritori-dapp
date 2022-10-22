import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";

import KeplrLogo from "../../../assets/keplrLogo.png";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText/BrandText";
import { ModalBase } from "../modals/ModalBase";

export const RegisterScreen: React.FC<{
  visible?: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [displayConfirmation, setDisplayConfirmation] = useState(visible);

  function handleConfirmClick() {
    onClose();
    setDisplayConfirmation(false);
  }

  return (
    <ModalBase
      onClose={() => {
        handleConfirmClick();
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
          marginBottom: layout.padding_x2,
        }}
      >
        <TouchableOpacity>
          <TertiaryBox
            width={440}
            height={50}
            mainContainerStyle={{ borderColor: secondaryColor, borderWidth: 1 }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Image source={KeplrLogo} />
              <BrandText style={fontSemibold14}>
                Sign with Keplr to prove your ownership of this account
              </BrandText>
            </View>
          </TertiaryBox>
        </TouchableOpacity>
      </View>
    </ModalBase>
  );
};
