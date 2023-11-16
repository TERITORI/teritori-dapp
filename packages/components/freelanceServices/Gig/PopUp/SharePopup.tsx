import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import facebookIcon from "../../../../../assets/icons/facebook-icon.svg";
import googleIcon from "../../../../../assets/icons/google-icon.svg";
import shareIcon from "../../../../../assets/icons/share-white.svg";
import twitterIcon from "../../../../../assets/icons/twitter-icon.svg";
import { fontSemibold16 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText/BrandText";
import { SVG } from "../../../SVG";
import { ModalBase } from "../../../modals/ModalBase";

export const SharePopup: React.FC<{
  visible?: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [displayDescriptionReportPopUp, setDisplayDescriptionReportPopUp] =
    useState(visible);

  function handleConfirmClick() {
    onClose();
    setDisplayDescriptionReportPopUp(false);
  }

  return (
    <ModalBase
      onClose={() => {
        handleConfirmClick();
      }}
      label="Share This Gig"
      visible={displayDescriptionReportPopUp}
      width={372}
      description="  Spread the word about this Gig on Teritori"
    >
      <View
        style={{
          width: "100%",
          justifyContent: "space-around",
          flexDirection: "row",
          marginTop: 8,
          marginBottom: 24,
        }}
      >
        <TouchableOpacity>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <SVG source={facebookIcon} width={24} height={24} />
            <BrandText style={[fontSemibold16, { marginTop: 8 }]}>
              Facebook
            </BrandText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <SVG source={twitterIcon} width={24} height={24} />
            <BrandText style={[fontSemibold16, { marginTop: 8 }]}>
              Twitter
            </BrandText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <SVG source={googleIcon} width={24} height={24} />
            <BrandText style={[fontSemibold16, { marginTop: 8 }]}>
              Google
            </BrandText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <SVG source={shareIcon} width={24} height={24} />
            <BrandText style={[fontSemibold16, { marginTop: 8 }]}>
              Share
            </BrandText>
          </View>
        </TouchableOpacity>
      </View>
    </ModalBase>
  );
};
