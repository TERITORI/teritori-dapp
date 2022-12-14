import { useEffect, useState } from "react";
import {
  Modal,
  ModalProps,
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  Pressable,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";

import controllerSVG from "../../../../assets/game/controller.svg";
import dashedBorderPNG from "../../../../assets/game/dashed-border.png";
import closeSVG from "../../../../assets/icons/close.svg";
import { NFT } from "../../../api/marketplace/v1/marketplace";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import Row from "../../../components/grid/Row";
import { SpacerRow } from "../../../components/spacer/SpacerRow";
import { getRipperRarity, getRipperTraitValue } from "../../../utils/game";
import { neutral00, white, yellowDefault } from "../../../utils/style/colors";
import {
  fontMedium32,
  fontMedium48,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { headerHeight } from "../../../utils/style/layout";
import { RipperAvatar } from "./RipperAvatar";
import { RipperStat } from "./RipperStat";
import { SimpleButton } from "./SimpleButton";

type RipperSelectorModalProps = ModalProps & {
  slotId: number | undefined;
  confirmButton: string;
  availableRippers: NFT[];
  onSelectRipper(slotId: number, ripper: NFT): void;
  onClose?(): void;
};

const THUMB_CONTAINER_WIDTH = 132;
const THUMB_CONTAINER_HEIGHT = 132;

const THUMB_SIZE = 100;

const RIPPER_IMAGE_SIZE = 580;

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
          <Row breakpoint={992}>
            <View style={styles.leftCol}>
              <View style={styles.leftColContent}>
                <View style={styles.selectListContainer}>
                  <Carousel
                    data={availableRippers}
                    width={
                      THUMB_CONTAINER_WIDTH +
                      20 /* For displaying right arrow */
                    }
                    height={
                      THUMB_CONTAINER_HEIGHT +
                      20 /* For padding between items */
                    }
                    loop={false}
                    vertical
                    style={{
                      height: (THUMB_CONTAINER_HEIGHT + 20) * 4,
                    }}
                    pagingEnabled
                    renderItem={({ item, index }) => {
                      const isSelected = item.name === selectedRipper?.name;
                      return (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => selectRipper(item)}
                        >
                          <TertiaryBox
                            noBrokenCorners
                            mainContainerStyle={[
                              styles.ripperThumb,
                              isSelected && {
                                borderColor: white,
                                borderWidth: 1,
                              },
                            ]}
                          >
                            <BrandText style={styles.ripperThumbName}>
                              {item.name}
                            </BrandText>

                            <RipperAvatar
                              size={THUMB_SIZE}
                              source={item.imageUri}
                              rarity={getRipperRarity(item)}
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
                  />
                </ImageBackground>
              </View>
            </View>

            <View style={styles.rightCol}>
              <BrandText style={fontMedium32}>Stats</BrandText>

              <RipperStat
                containerStyle={styles.ripperStatContainer}
                name="Stamina"
                value={
                  selectedRipper &&
                  getRipperTraitValue(selectedRipper, "Stamina")
                }
                size="LG"
              />
              <RipperStat
                containerStyle={styles.ripperStatContainer}
                name="Protection"
                value={
                  selectedRipper &&
                  getRipperTraitValue(selectedRipper, "Protection")
                }
                size="LG"
              />
              <RipperStat
                containerStyle={styles.ripperStatContainer}
                name="Luck"
                value={
                  selectedRipper && getRipperTraitValue(selectedRipper, "Luck")
                }
                size="LG"
              />

              <View style={styles.btnGroup}>
                <SVG color={yellowDefault} source={controllerSVG} />
                <SpacerRow size={2} />
                <SimpleButton
                  disabled={!selectedRipper}
                  onPress={enrollRipper}
                  size="small"
                  title={confirmButton}
                />
              </View>
            </View>
          </Row>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: neutral00,
    marginTop: headerHeight + 80,
    borderWidth: 1,
    position: "relative",
  },
  rightCol: {
    flex: 1,
    paddingLeft: 40,
    paddingTop: 40,
  },
  leftCol: {
    flex: 2,
    alignItems: "flex-end",
    position: "relative",
  },
  leftColContent: {
    position: "relative",
  },
  dashedBorder: {
    width: RIPPER_IMAGE_SIZE,
    height: RIPPER_IMAGE_SIZE,
    marginTop: 20,
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
    width: THUMB_CONTAINER_HEIGHT,
    borderWidth: 0,
  },
  ripperThumbName: {
    marginVertical: 9,
    ...(fontSemibold11 as object),
  },
  ripperStatContainer: {
    marginTop: 40,
  },
  arrowRight: {
    position: "absolute",
    borderWidth: 10,
    borderRightWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    borderLeftColor: white,
    right: -16,
  },
  btnGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 100,
    marginLeft: 40,
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
});
