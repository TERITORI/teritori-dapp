import React, {
  ComponentType,
  ReactNode,
  useEffect,
  PropsWithChildren,
} from "react";
import {
  Modal,
  View,
  ScrollView,
  ViewStyle,
  useWindowDimensions,
  StyleProp,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import chevronLeft from "../../../assets/icons/chevron-left.svg";
import closeSVG from "../../../assets/icons/hamburger-button-cross.svg";
import { useAppNavigation } from "../../utils/navigation";
import { neutral77, neutral22 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout, RESPONSIVE_BREAKPOINT_S } from "../../utils/style/layout";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { BoxStyle } from "../boxes/Box";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SeparatorGradient } from "../separators/SeparatorGradient";
import { SpacerColumn } from "../spacer";

// TODO: Simplify this component (Useless childrenBottom ?. Better to let the parent totally decides which children to use ? Used in WalletManager.tsx, be careful !)

type ModalBaseProps = {
  label?: string;
  labelComponent?: ReactNode;
  onClose?: () => void;
  onBackPress?: () => void;
  width?: number;
  visible?: boolean;
  Header?: ComponentType;
  childrenBottom?: JSX.Element | JSX.Element[];
  hideMainSeparator?: boolean;
  description?: string;
  scrollable?: boolean;
  boxStyle?: StyleProp<BoxStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  childrenContainerStyle?: StyleProp<ViewStyle>;
  closeButtonStyle?: StyleProp<ViewStyle>;
  verticalPosition?: "center" | "top" | "bottom";
  closeOnBlur?: boolean;
  children: ReactNode;
};

const ScrollableComponent = ({
  scrollable,
  ...props
}: PropsWithChildren<{
  scrollable?: boolean;
  style: StyleProp<ViewStyle>;
  contentContainerStyle: StyleProp<ViewStyle>;
}>) => {
  if (scrollable) {
    return <ScrollView {...props} />;
  } else {
    return <View {...props} />;
  }
};

// The base components for modals. You can provide children (Modal's content) and childrenBottom (Optional Modal's bottom content)
const ModalBase: React.FC<ModalBaseProps> = ({
  label,
  labelComponent,
  visible,
  width,
  onClose,
  childrenBottom,
  children,
  Header,
  hideMainSeparator,
  description,
  scrollable,
  boxStyle,
  containerStyle,
  childrenContainerStyle,
  onBackPress,
  closeButtonStyle,
  verticalPosition = "center",
  closeOnBlur,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const navigation = useAppNavigation();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (closeOnBlur !== true) return;
    const unsubscribe = navigation.addListener("blur", () => {
      onClose?.();
    });

    return unsubscribe;
  }, [onClose, navigation, closeOnBlur]);

  return (
    <Modal
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
      }}
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      {/*------ Modal background */}
      <ScrollableComponent
        scrollable={scrollable}
        style={[
          {
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, .8)",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            maxHeight: windowHeight,
          },
          containerStyle,
          !scrollable && {
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
        contentContainerStyle={[
          {
            padding: layout.spacing_x0_5,
            flex: 1,
            height: windowHeight,
          },
          !scrollable && {
            height: "100%",
            width: "100%",
          },
        ]}
      >
        {/*------ Modal main container */}
        <TertiaryBox
          style={[
            {
              margin: "auto",
              width: windowWidth < RESPONSIVE_BREAKPOINT_S ? "100%" : width,
              alignItems: "flex-start",
            },
            verticalPosition === "top" && { marginTop: 0 },
            verticalPosition === "bottom" && { marginBottom: 0 },
            boxStyle,
          ]}
        >
          {/*------ Modal header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: modalMarginPadding,
              paddingVertical: layout.spacing_x2,
            }}
          >
            {(label || labelComponent || description) && (
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                {onBackPress && (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={{
                      height: 32,
                      width: 32,
                      backgroundColor: neutral22,
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                    onPress={onBackPress}
                  >
                    <SVG source={chevronLeft} height={12} width={12} />
                  </TouchableOpacity>
                )}

                <View style={{ flex: 1, width: "100%" }}>
                  {label && (
                    <BrandText style={{ color: "white", lineHeight: 24 }}>
                      {label}
                    </BrandText>
                  )}

                  {labelComponent}

                  {description && (
                    <>
                      <SpacerColumn size={1} />
                      <BrandText
                        style={[
                          fontSemibold14,
                          {
                            color: neutral77,
                            width: "100%",
                            lineHeight: 20,
                            flexWrap: "wrap",
                          },
                        ]}
                      >
                        {description}
                      </BrandText>
                    </>
                  )}
                </View>
              </View>
            )}

            {Header && <Header />}

            <TouchableOpacity
              containerStyle={[
                { marginLeft: modalMarginPadding },
                closeButtonStyle,
              ]}
              style={{ justifyContent: "center" }}
              onPress={onClose}
            >
              <SVG width={32} height={32} source={closeSVG} />
            </TouchableOpacity>
          </View>
          {children && (
            <View
              style={[
                { width: "100%", paddingHorizontal: modalMarginPadding },
                childrenContainerStyle,
              ]}
            >
              {/*------- Modal main content */}
              {hideMainSeparator !== true && (
                <SeparatorGradient
                  style={{ marginBottom: modalMarginPadding }}
                />
              )}
              {children}
            </View>
          )}
          {/*------- Modal bottom content */}
          {childrenBottom}
        </TertiaryBox>
      </ScrollableComponent>
    </Modal>
  );
};

export default ModalBase;
