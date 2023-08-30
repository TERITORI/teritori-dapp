import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalProps,
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  Pressable,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { RipperAvatar } from "./RipperAvatar";
import { RipperStatsSection } from "./RipperStatsSection";
import { SimpleButton } from "./SimpleButton";
import controllerSVG from "../../../../assets/game/controller.svg";
import dashedBorderPNG from "../../../../assets/game/dashed-border.png";
import closeSVG from "../../../../assets/icons/close.svg";
import { NFT } from "../../../api/marketplace/v1/marketplace";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SpacerRow } from "../../../components/spacer";
import { getRipperRarity, isNFTStaked } from "../../../utils/game";
import {
  neutral00,
  secondaryColor,
  withAlpha,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontMedium32,
  fontMedium48,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { headerHeight, layout } from "../../../utils/style/layout";

type RipperSelectorModalProps = ModalProps & {
  slotId: number | undefined;
  confirmButton: string;
  availableRippers: NFT[];
  onSelectRipper(slotId: number, ripper: NFT): void;
  onClose?(): void;
};

const THUMB_CONTAINER_SIZE = 132;
const TOTAL_VISIBLE = 4;

const THUMB_SIZE = 100;

const RIPPER_IMAGE_SIZE = 540;

export const RipperSelectorModal: React.FC<RipperSelectorModalProps> = ({
  slotId,
  onClose,
  onSelectRipper,
  availableRippers,
  visible,
  confirmButton,
  ...props
}) => {
  const [selectedRipper, setSelectedRipper] = useState<NFT | undefined>();
  const { width: currentWidth } = useWindowDimensions();

  const breakPoint = 1200;

  const centerFlex = useMemo(
    () => (currentWidth > breakPoint ? 2 : 1),
    [currentWidth]
  );

  const selectRipper = async (ripper: NFT) => {
    setSelectedRipper(ripper);
  };

  const enrollRipper = () => {
    if (!selectedRipper) return;
    onSelectRipper(slotId as number, selectedRipper);
  };

  useEffect(() => {
    setSelectedRipper(undefined);
  }, [visible]);

  // Normally this will never be visible
  if (visible && slotId === undefined) {
    return <BrandText>Please select a slot</BrandText>;
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
      {...props}
    >
      <View style={styles.container}>
        <Pressable style={styles.closeIcon} onPress={onClose}>
          <SVG width={40} height={40} source={closeSVG} />
        </Pressable>

        <BrandText style={fontMedium48}>
          {selectedRipper?.name || "Please select a Ripper"}
        </BrandText>

        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <FlexRow breakpoint={breakPoint}>
            {currentWidth > breakPoint && <View style={{ flex: 1 }} />}
            <View
              style={{
                flex: centerFlex,
                alignItems: "center",
                position: "relative",
              }}
            >
              <View style={{ position: "relative" }}>
                <View style={styles.selectListContainer}>
                  <FlatList
                    data={availableRippers}
                    numColumns={1}
                    style={{
                      height:
                        (THUMB_CONTAINER_SIZE + layout.padding_x1_5) *
                        TOTAL_VISIBLE,
                    }}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                      const isSelected = item.name === selectedRipper?.name;
                      return (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => selectRipper(item)}
                        >
                          <TertiaryBox
                            noBrokenCorners
                            mainContainerStyle={[
                              styles.ripperThumb,
                              isSelected && {
                                borderColor: secondaryColor,
                                borderWidth: 1,
                              },
                            ]}
                          >
                            <BrandText
                              style={[
                                fontSemibold11,
                                { marginVertical: layout.padding_x1 },
                              ]}
                            >
                              {item.name}
                            </BrandText>

                            <RipperAvatar
                              size={THUMB_SIZE}
                              source={item.imageUri}
                              rarity={getRipperRarity(item)}
                              isStaked={isNFTStaked(item)}
                            />

                            {isSelected && <View style={styles.arrowRight} />}
                          </TertiaryBox>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>

                <ImageBackground
                  style={styles.dashedBorder}
                  source={dashedBorderPNG}
                >
                  <RipperAvatar
                    source={selectedRipper?.imageUri || ""}
                    size={RIPPER_IMAGE_SIZE}
                    rounded
                    containerStyle={styles.roundedContainer}
                    isStaked={isNFTStaked(selectedRipper)}
                  />
                </ImageBackground>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: layout.padding_x4,
                marginTop: 2 * layout.padding_x4,
              }}
            >
              <BrandText style={fontMedium32}>Stats</BrandText>

              <RipperStatsSection ripper={selectedRipper} size="LG" />

              <View style={styles.btnGroup}>
                <SVG color={yellowDefault} source={controllerSVG} />
                <SpacerRow size={2} />
                <SimpleButton
                  disabled={!selectedRipper}
                  onPress={enrollRipper}
                  size="SM"
                  text={confirmButton}
                />
              </View>
            </View>
          </FlexRow>
        </ScrollView>
      </View>
    </Modal>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: withAlpha(neutral00, 0.95),
    paddingTop: headerHeight,
    borderWidth: 1,
    position: "relative",
  },
  dashedBorder: {
    width: RIPPER_IMAGE_SIZE,
    height: RIPPER_IMAGE_SIZE,
    marginTop: layout.padding_x2_5,
  },
  roundedContainer: {
    width: RIPPER_IMAGE_SIZE - 4,
    height: RIPPER_IMAGE_SIZE - 4,
    position: "absolute",
    left: 2,
    top: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  selectListContainer: {
    position: "absolute",
    zIndex: 2,
    left: -60,
  },
  ripperThumb: {
    alignItems: "center",
    width: THUMB_CONTAINER_SIZE,
    borderWidth: 0,
    margin: layout.padding_x1,
    marginRight: layout.padding_x3,
  },
  arrowRight: {
    position: "absolute",
    borderWidth: 10,
    borderRightWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    borderLeftColor: secondaryColor,
    right: -16,
  },
  btnGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2 * layout.padding_x4,
    marginLeft: layout.padding_x4,
  },
  closeIcon: {
    position: "absolute",
    right: layout.padding_x1_5,
    top: layout.padding_x1_5,
    zIndex: 1,
  },
});
