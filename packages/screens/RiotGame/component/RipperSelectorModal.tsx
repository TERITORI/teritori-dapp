import { useEffect, useState } from "react";
import {
  Modal,
  ModalProps,
  StyleSheet,
  View,
  ImageBackground,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import controllerSVG from "../../../../assets/game/controller.svg";
import dashedBorderPNG from "../../../../assets/game/dashed-border.png";
import closeSVG from "../../../../assets/icons/close.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import Col from "../../../components/grid/Col";
import Row from "../../../components/grid/Row";
import { SpacerRow } from "../../../components/spacer/SpacerRow";
import { getRipperRarity, getRipperTraitValue } from "../../../utils/game";
import { neutral00, white, yellowDefault } from "../../../utils/style/colors";
import { flex } from "../../../utils/style/flex";
import {
  fontMedium16,
  fontMedium32,
  fontMedium48,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { headerHeight, layout } from "../../../utils/style/layout";
import { RipperAvatar } from "./RipperAvatar";
import { RipperStat } from "./RipperStat";
import { SimpleButton } from "./SimpleButton";

type RipperSelectorModalProps = ModalProps & {
  slotId: number | undefined;
  confirmButton: string;
  availableRippers: NSRiotGame.Ripper[];
  onSelectRipper?(slotId: number, ripper: NSRiotGame.Ripper): void;
  onClose?(): void;
};

const THUMB_CONTAINER_WIDTH = 100;
const THUMB_CONTAINER_HEIGHT = 88;

const THUMB_SIZE = 72;

const RIPPER_IMAGE_SIZE = 300;

export const RipperSelectorModal: React.FC<RipperSelectorModalProps> = ({
  slotId,
  onClose,
  onSelectRipper,
  availableRippers,
  visible,
  confirmButton,
  ...props
}) => {
  const [selectedRipper, setSelectedRipper] = useState<
    NSRiotGame.Ripper | undefined
  >();

  const selectRipper = (ripper: NSRiotGame.Ripper) => {
    setSelectedRipper(ripper);
  };

  const confirmRipper = () => {
    if (!selectedRipper) return;
    onSelectRipper && onSelectRipper(slotId as number, selectedRipper);
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

        <ScrollView
          style={layout.w_100}
          contentContainerStyle={flex.alignItemsCenter}
          showsVerticalScrollIndicator={false}
        >
          <BrandText style={[fontMedium48, layout.mt_2]}>
            {selectedRipper?.name || "Please select a Ripper"}
          </BrandText>

          <Row breakpoint={992} style={{ justifyContent: "space-around" }}>
            <Col style={flex.justifyContentAround}>
              <View>
                <BrandText style={[fontMedium32]}>Available Rippers</BrandText>

                <FlatList
                  data={availableRippers}
                  numColumns={3}
                  renderItem={({ item: ripper, index }) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => selectRipper(ripper)}
                      >
                        <TertiaryBox
                          style={{ margin: 10 }}
                          width={THUMB_CONTAINER_WIDTH}
                          height={THUMB_CONTAINER_HEIGHT}
                        >
                          <RipperAvatar
                            size={THUMB_SIZE}
                            source={ripper.image}
                            rarity={getRipperRarity(ripper)}
                          />
                        </TertiaryBox>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              <View style={styles.btnGroup}>
                <SVG color={yellowDefault} source={controllerSVG} />
                <SpacerRow size={2} />
                <SimpleButton
                  onPress={confirmRipper}
                  size="small"
                  title={confirmButton}
                />
              </View>
            </Col>

            <Col>
              <ImageBackground
                style={styles.dashedBorder}
                source={dashedBorderPNG}
              >
                <RipperAvatar
                  source={selectedRipper?.image}
                  size={RIPPER_IMAGE_SIZE}
                  rounded
                  containerStyle={styles.roundedContainer}
                />
              </ImageBackground>

              <BrandText style={fontMedium16}>Stats</BrandText>

              <RipperStat
                containerStyle={layout.mt_5}
                name="Stamina"
                value={
                  selectedRipper &&
                  getRipperTraitValue(selectedRipper, "Stamina")
                }
                size="MD"
              />
              <RipperStat
                containerStyle={layout.mt_5}
                name="Protection"
                value={
                  selectedRipper &&
                  getRipperTraitValue(selectedRipper, "Protection")
                }
                size="MD"
              />
              <RipperStat
                containerStyle={layout.mt_5}
                name="Luck"
                value={
                  selectedRipper && getRipperTraitValue(selectedRipper, "Luck")
                }
                size="MD"
              />
            </Col>
          </Row>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral00,
    marginTop: headerHeight,
    borderWidth: 1,
  },
  dashedBorder: {
    width: RIPPER_IMAGE_SIZE,
    height: RIPPER_IMAGE_SIZE,
    marginTop: 20,
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
  selectListContainer: {
    position: "absolute",
    zIndex: 2,
    left: -60,
  },
  ripperThumbName: {
    marginVertical: 9,
    ...(fontSemibold11 as object),
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
    marginTop: 20,
    flexDirection: "row",
    alignSelf: "center",
  },
  closeIcon: {
    position: "absolute",
    right: 0,
    top: 10,
  },
});
