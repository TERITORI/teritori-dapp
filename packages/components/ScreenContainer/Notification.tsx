import React, { useRef } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import notificationIcon from "../../../assets/icons/badge.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import {
  getNetwork,
  NetworkInfo,
  NetworkKind,
  selectableNetworks,
} from "../../networks";
import { selectNotification } from "../../store/slices/notification";
import {
  setSelectedWalletId,
  setSelectedNetworkId,
  selectAreTestnetsEnabled,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { neutral17, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { WalletProvider } from "../../utils/walletProvider";
import { BrandText } from "../BrandText";
import { NetworkIcon } from "../NetworkIcon";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerRow } from "../spacer";

export const Notification: React.FC<{
  style?: StyleProp<ViewStyle>;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  hideDropdown?: string;
  iconHide?: string;
}> = ({ style, forceNetworkId, forceNetworkKind, hideDropdown, iconHide }) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
  const dispatch = useAppDispatch();
  const notifications = useSelector(selectNotification);

  const onPressNetwork = (networkId: string) => {
    closeOpenedDropdown();
  };

  const fontSize = 14;

  return (
    <View style={style} ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <SVG
          source={notificationIcon}
          width={16}
          height={16}
          color={secondaryColor}
        />
      </TouchableOpacity>

      {isDropdownOpen(dropdownRef) && (
        <TertiaryBox
          width={172}
          style={{ position: "absolute", top: 44 }}
          mainContainerStyle={{
            paddingHorizontal: layout.padding_x2,
            paddingVertical: layout.padding_x2,
            backgroundColor: neutral17,
            alignItems: "flex-start",
          }}
        >
          {!notifications.length && (
            <BrandText
              style={[fontSemibold12, { marginLeft: layout.padding_x1_5 }]}
            >
              All caught up.
            </BrandText>
          )}
          {notifications.map((notification, index) => {
            return (
              <TouchableOpacity
                style={{
                  marginBottom: layout.padding_x2,
                }}
                key={index}
                onPress={() => {}}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BrandText
                    style={[
                      fontSemibold12,
                      { marginLeft: layout.padding_x1_5 },
                    ]}
                  >
                    {notification.title}
                  </BrandText>
                </View>
              </TouchableOpacity>
            );
          })}
        </TertiaryBox>
      )}
    </View>
  );
};
