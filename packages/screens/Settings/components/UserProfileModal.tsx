import React, { useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { DragSortableView } from "react-native-drag-sort";
import Hoverable from "react-native-hoverable";

import confirmSVG from "../../../../assets/icons/confirm.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TertiaryButton } from "../../../components/buttons/TertiaryButton";
import {
  neutralA3,
  neutral33,
  neutral00,
  neutral17,
  neutral55,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold28,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { initProfileData } from "./initProfile";

type toggleUserProfileProps = {
  onClose: () => void;
  visible: boolean;
};

const smallMobileWidth = 512;
const mobileWidth = 768;

export type ProfileDataType = {
  id: number;
  content: string;
};

export const UserProfileModal: React.FC<toggleUserProfileProps> = ({
  onClose,
  visible,
}) => {
  const { width, height } = useWindowDimensions();

  const calculateChildrenWidth = (): number => {
    let targetWidth = 0;

    const gapWidth = layout.padding_x1;
    const miniumWidth = 240;

    if (width < (miniumWidth + gapWidth * 2) * 8)
      targetWidth = (width - gapWidth * 2 * 7) / 7;
    if (width < (miniumWidth + gapWidth * 2) * 7)
      targetWidth = (width - gapWidth * 2 * 6) / 6;
    if (width < (miniumWidth + gapWidth * 2) * 6)
      targetWidth = (width - gapWidth * 2 * 5) / 5;
    if (width < (miniumWidth + gapWidth * 2) * 5)
      targetWidth = (width - gapWidth * 2 * 4) / 4;
    if (width < (miniumWidth + gapWidth * 2) * 4)
      targetWidth = (width - gapWidth * 2 * 3) / 3;
    if (width < (miniumWidth + gapWidth * 2) * 3)
      targetWidth = (width - gapWidth * 2 * 2) / 2;
    if (width < (miniumWidth + gapWidth * 2) * 2)
      targetWidth = width - gapWidth * 2;

    return targetWidth;
  };

  const childrenHeight = 42;
  const childrenWidth = calculateChildrenWidth();
  const parentWidth = width;
  const marginChildrenVertical = layout.padding_x1;
  const marginChildrenTop =
    width < smallMobileWidth ? layout.padding_x1 : layout.padding_x2;

  const [profileData, setProfileData] =
    useState<ProfileDataType[]>(initProfileData);
  const [confirmedData, setConfirmedData] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  const styles = StyleSheet.create({
    modalContainer: {
      width,
      height,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      textAlign: "center",
    },
    modalTitle: StyleSheet.flatten([
      fontSemibold28,
      {
        marginTop:
          width < mobileWidth
            ? width < smallMobileWidth
              ? 5 * layout.padding_x1
              : 15 * layout.padding_x1
            : 25 * layout.padding_x1,
      },
    ]),
    modalText: StyleSheet.flatten([
      fontMedium14,
      {
        marginHorizontal: "auto",
        color: neutralA3,
        marginTop: layout.padding_x1,
        width: width < smallMobileWidth ? 0.9 * width : 15 * layout.padding_x4,
      },
    ]),
    cardContainer: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      marginHorizontal: "auto",
      justifyContent: "center",
      alignItems: "center",
      gap: layout.padding_x1_5,
      marginTop:
        width < mobileWidth
          ? width < smallMobileWidth
            ? 5 * layout.padding_x0_5
            : 30 * layout.padding_x0_5
          : 45 * layout.padding_x0_5,
    },
    cardBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: childrenWidth,
      paddingVertical: layout.padding_x1_5,
      borderColor: neutral33,
      borderWidth: 1,
      borderRadius: layout.padding_x1,
      position: "relative",
    },

    unselectedCardBoxBackroundColor: {
      backgroundColor: neutral00,
    },

    selectedCardBoxBackgroundColor: {
      backgroundColor: neutral17,
    },
    confirmedCardBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: childrenWidth,
      paddingVertical: layout.padding_x1_5,
      borderColor: "rgba(0, 0, 0, 0.9)",
      borderWidth: 1,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      borderRadius: layout.padding_x1,
      position: "relative",
    },
    unconfirmedCardContent: StyleSheet.flatten([fontSemibold14]),
    confirmedCardContent: StyleSheet.flatten([
      fontMedium14,
      {
        color: neutral55,
      },
    ]),
    confirmButton: {
      position: "absolute",
      top: -50,
      left: childrenWidth / 2 - 20,
      width: 60,
      height: 60,
      zIndex: 999,
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "row",
      gap: layout.padding_x3,
      marginTop:
        width < mobileWidth
          ? width < smallMobileWidth
            ? 5 * layout.padding_x0_5
            : 30 * layout.padding_x0_5
          : 45 * layout.padding_x0_5,
    },
  });

  const updateConfirmedData = (item: ProfileDataType) => {
    if (!confirmedData.includes(item.content))
      setConfirmedData([...confirmedData, item.content]);
    else {
      const targetIndex = confirmedData.indexOf(item.content);
      const targetData = confirmedData;
      targetData.splice(targetIndex, 1);
      setConfirmedData(targetData);
    }
  };

  const renderItem = (item: ProfileDataType, index: number) => {
    return (
      <Hoverable
        style={
          confirmedData.includes(item.content)
            ? styles.confirmedCardBox
            : [styles.cardBox, styles.unselectedCardBoxBackroundColor]
        }
        onMouseEnter={() => setHoveredIndex(index + 1)}
      >
        <BrandText
          style={
            confirmedData.includes(item.content)
              ? styles.confirmedCardContent
              : styles.unconfirmedCardContent
          }
        >
          {item.content}
        </BrandText>
        {hoveredIndex === index + 1 && (
          <Pressable
            style={styles.confirmButton}
            onPress={() => updateConfirmedData(item)}
          >
            <SVG source={confirmSVG} height={60} width={60} />
          </Pressable>
        )}
      </Hoverable>
    );
  };

  return (
    <Modal
      style={{ width, height }}
      animationType="fade"
      onRequestClose={onClose}
      visible={visible}
      transparent
    >
      <View style={styles.modalContainer}>
        <BrandText style={styles.modalTitle}>User Profile</BrandText>
        <BrandText style={styles.modalText}>
          Choose the order in which sections will be displayed on your personal
          page by using drag & drop feature and hide useless for you features
        </BrandText>
        <View style={styles.cardContainer}>
          <DragSortableView
            dataSource={profileData}
            keyExtractor={(item) => item.content}
            parentWidth={parentWidth}
            childrenHeight={childrenHeight}
            childrenWidth={childrenWidth}
            marginChildrenLeft={marginChildrenVertical}
            marginChildrenRight={marginChildrenVertical}
            marginChildrenTop={marginChildrenTop}
            onDataChange={(data) => {
              if (data.length !== profileData.length) setProfileData(data);
            }}
            renderItem={(item: ProfileDataType, index) => {
              return renderItem(item, index);
            }}
          />
        </View>

        <View style={styles.buttonGroup}>
          <TertiaryButton size="M" text="Cancel" onPress={onClose} />
          {confirmedData.length === 0 && (
            <TertiaryButton size="M" text="Save" onPress={onClose} />
          )}
          {confirmedData.length > 0 && (
            <PrimaryButton size="M" text="Save" onPress={onClose} />
          )}
        </View>
      </View>
    </Modal>
  );
};
