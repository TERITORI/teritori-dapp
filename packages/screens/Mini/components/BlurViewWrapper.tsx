import { BlurView, BlurViewProps } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { CustomButton } from "./Button/CustomButton";
import eyeClosedSVG from "../../../../assets/icons/eye-closed.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../components/spacer";
import { neutral09 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface BlurViewWrapperProps extends BlurViewProps {
  blurContainerStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  icon?: React.FC<SvgProps> | string;
  showIcon?: boolean;
  iconSize?: number;
  copy?: any;
  hideButton?: boolean;
}

export default function BlurViewWrapper({
  wrapperStyle,
  blurContainerStyle,
  label,
  labelStyle,
  icon,
  showIcon = true,
  iconSize,
  copy,
  hideButton = false,
  children,
  ...rest
}: PropsWithChildren<BlurViewWrapperProps>) {
  const ICON_SIZE = iconSize ?? 20;
  const [show, setShow] = useState(false);

  function onPressHandler() {
    if (hideButton) {
      setShow(true);
    }
  }

  return (
    <>
      <CustomPressable onPress={onPressHandler}>
        <View
          style={[
            {
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.20)",
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: layout.borderRadius,
              paddingHorizontal: layout.spacing_x5,
              paddingVertical: layout.spacing_x4,
              backgroundColor: neutral09,
            },
            wrapperStyle,
          ]}
        >
          {children}

          {hideButton && (
            <View
              style={{
                height: 60,
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {show && (
                <ButtonGroups show={show} setShow={setShow} copy={copy} />
              )}
            </View>
          )}

          {!show && (
            <BlurView
              intensity={30}
              style={[
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: layout.borderRadius,
                  overflow: "hidden",
                },
                blurContainerStyle,
              ]}
              {...rest}
            >
              {showIcon && (
                <SVG
                  source={icon ?? eyeClosedSVG}
                  height={ICON_SIZE}
                  width={ICON_SIZE}
                />
              )}

              <SpacerColumn size={1.5} />

              <BrandText style={[fontSemibold13, labelStyle]}>
                {label ?? "Make sure no one is watching your screen"}
              </BrandText>

              {hideButton && <SpacerColumn size={3} />}
            </BlurView>
          )}
        </View>
      </CustomPressable>

      {!hideButton && (
        <>
          <SpacerColumn size={1.5} />
          <ButtonGroups show={show} setShow={setShow} copy={copy} />
        </>
      )}
    </>
  );
}

type ButtonGroupsProps = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  copy?: any;
};

function ButtonGroups({ show, copy, setShow }: ButtonGroupsProps) {
  const onCopySeedPhrasesPress = async () => {
    await Clipboard.setStringAsync(JSON.stringify(copy));
    alert("Copied");
  };

  const onToggleSeedPhrasesPress = async () => {
    setShow((prev) => !prev);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: layout.spacing_x2,
      }}
    >
      <CustomButton
        title={show ? "Hide" : "View"}
        onPress={onToggleSeedPhrasesPress}
        type="gray"
        size="small"
        width={75}
      />
      {copy && (
        <CustomButton
          title="Copy"
          onPress={onCopySeedPhrasesPress}
          type="gray"
          size="small"
          width={75}
        />
      )}
    </View>
  );
}
