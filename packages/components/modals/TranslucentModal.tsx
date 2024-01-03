import React, { ReactNode } from "react";
import { Modal, SafeAreaView, View } from "react-native";

import closeSVG from "../../../assets/icons/close.svg";
import { MOBILE_HEADER_HEIGHT, layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { BackButton } from "../navigation/components/BackButton";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  header?: ReactNode;
  onBackPress?: () => void;
  title?: string;
  backgroundColor?: string;
};

const TranslucentModal = ({
  children,
  header,
  isVisible,
  onBackPress,
  onClose,
  title,
  backgroundColor,
}: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: backgroundColor ?? "rgba(0, 0, 0, .9)",
          position: "relative",
          paddingTop: MOBILE_HEADER_HEIGHT,
        }}
      >
        <View
          style={{
            flex: 1,
            paddingTop: MOBILE_HEADER_HEIGHT,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: layout.spacing_x1_5,
              height: MOBILE_HEADER_HEIGHT,
              maxHeight: MOBILE_HEADER_HEIGHT,
              width: "100%",
              alignItems: "center",
              paddingHorizontal: layout.spacing_x1_5,
              position: "absolute",
              top: 0,
              zIndex: 9999,
            }}
          >
            {onBackPress && (
              <BackButton
                type="chevron"
                style={{ alignSelf: "flex-start" }}
                onPress={onClose}
              />
            )}
            {!!title && (
              <BrandText style={{ flex: 1, textAlign: "center" }}>
                {title}
              </BrandText>
            )}
            {header && header}
            <CustomPressable
              onPress={onClose}
              style={{ position: "absolute", right: 10, top: 18 }}
            >
              <SVG source={closeSVG} height={28} width={28} />
            </CustomPressable>
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            {children}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default TranslucentModal;
