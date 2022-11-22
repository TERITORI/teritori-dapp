import { useEffect, useState } from "react";
import { Modal, ModalProps, StyleSheet, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";

import dashedBorderSVG from "../../../../assets/game/dashed-border.svg";
import gamepadSVG from "../../../../assets/game/gamepad.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SpacerRow } from "../../../components/spacer/SpacerRow";
import { neutral00, white } from "../../../utils/style/colors";
import {
  fontMedium32,
  fontMedium48,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { headerHeight } from "../../../utils/style/layout";
import RipperStat from "./RipperStat";
import SimpleButton from "./SimpleButton";

type RipperSelectorModalProps = ModalProps & {
  slotId: number | undefined;
  availableRippers: NSRiotGame.Ripper[];
  onSelectRipper(slotId: number, ripper: NSRiotGame.Ripper): void;
  onClose?(): void;
};

const THUMB_CONTAINER_WIDTH = 132;
const THUMB_CONTAINER_HEIGHT = 132;

const THUMB_WIDTH = 100;
const THUMB_HEIGHT = 100;

const RIPPER_IMAGE_SIZE = 580;

const RipperSelectorModal: React.FC<RipperSelectorModalProps> = ({
  slotId,
  onClose,
  onSelectRipper,
  availableRippers,
  visible,
  ...props
}) => {
  const [selectedRipper, setSelectedRipper] = useState<
    NSRiotGame.Ripper | undefined
  >();

  const selectRipper = (ripper: NSRiotGame.Ripper) => {
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
        <BrandText style={fontMedium48}>
          {selectedRipper?.name || "Please select a Ripper"}
        </BrandText>

        <View style={styles.row}>
          <View style={styles.leftCol}>
            <View style={styles.leftColContent}>
              <View style={styles.selectListContainer}>
                <Carousel
                  data={availableRippers}
                  width={
                    THUMB_CONTAINER_WIDTH + 20 /* For displaying right arrow */
                  }
                  height={
                    THUMB_CONTAINER_HEIGHT + 20 /* For padding between items */
                  }
                  loop={false}
                  vertical
                  style={{
                    height: (THUMB_CONTAINER_HEIGHT + 20) * 4,
                  }}
                  pagingEnabled
                  renderItem={({ item, index }) => {
                    const isSelected = item.id === selectedRipper?.id;
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
                          <Image
                            style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }}
                            source={item.image}
                          />

                          {isSelected && <View style={styles.arrowRight} />}
                        </TertiaryBox>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
              <View style={styles.ripperImageContainer}>
                <SVG source={dashedBorderSVG} />

                <View style={styles.roundedContainer}>
                  <Image
                    style={styles.ripperImage}
                    source={selectedRipper?.image}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.rightCol}>
            <BrandText style={fontMedium32}>Stats</BrandText>

            <RipperStat
              containerStyle={styles.ripperStatContainer}
              name="Stamina"
              value={selectedRipper?.stamina || 0}
            />
            <RipperStat
              containerStyle={styles.ripperStatContainer}
              name="Protection"
              value={selectedRipper?.protection || 0}
            />
            <RipperStat
              containerStyle={styles.ripperStatContainer}
              name="Luck"
              value={selectedRipper?.luck || 0}
            />

            <View style={styles.btnGroup}>
              <SVG source={gamepadSVG} />
              <SpacerRow size={2} />
              <SimpleButton
                onPress={enrollRipper}
                size="small"
                title="Enroll this Ripper"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: neutral00,
    marginTop: headerHeight + 90,
    borderWidth: 1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    minWidth: 992,
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
  ripperImageContainer: {
    marginTop: 20,
    position: "relative",
  },
  roundedContainer: {
    width: RIPPER_IMAGE_SIZE - 2,
    height: RIPPER_IMAGE_SIZE - 2,
    position: "absolute",
    left: 1,
    top: 1,
    borderRadius: 999,
    overflow: "hidden",
  },
  ripperImage: {
    width: RIPPER_IMAGE_SIZE,
    height: RIPPER_IMAGE_SIZE,
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
  },
});

export default RipperSelectorModal;
