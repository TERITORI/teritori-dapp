import { useEffect, useState } from "react";
import {
  Modal,
  ModalProps,
  StyleSheet,
  View,
  ImageBackground,
  FlatList,
  ScrollView,
  Pressable,
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
import { getStandardNFTInfo } from "../../../hooks/useNFTInfo";
import { getRipperTraitValue } from "../../../utils/game";
import {
  neutral00,
  neutral67,
  white,
  yellowDefault,
} from "../../../utils/style/colors";
import { flex } from "../../../utils/style/flex";
import {
  fontMedium13,
  fontMedium24,
  fontMedium32,
  fontMedium48,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { headerHeight, layout } from "../../../utils/style/layout";
import { spacing } from "../../../utils/style/spacing";
import { RipperAvatar } from "./RipperAvatar";
import { RipperStat } from "./RipperStat";
import { SimpleButton } from "./SimpleButton";

type RipperSelectorModalProps = ModalProps & {
  slotId: number | undefined;
  confirmButton: string;
  availableRippers: NSRiotGame.RipperListItem[];
  onSelectRipper?(slotId: number, ripper: NSRiotGame.RipperDetail): void;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRipper, setSelectedRipper] = useState<
    NSRiotGame.RipperListItem | undefined
  >();
  const [selectedRipperDetail, setSelectedRipperDetail] =
    useState<NSRiotGame.RipperDetail>();

  const selectRipper = async (ripper: NSRiotGame.RipperListItem) => {
    setSelectedRipper(ripper);

    const tokenId = ripper.id.split("-")[2];

    const ripperDetail: NSRiotGame.RipperDetail = await getStandardNFTInfo(
      process.env.THE_RIOT_COLLECTION_ADDRESS || "",
      tokenId
    );
    setSelectedRipperDetail(ripperDetail);
  };

  const confirmRipper = () => {
    if (!selectedRipperDetail) return;
    onSelectRipper && onSelectRipper(slotId as number, selectedRipperDetail);
  };

  useEffect(() => {
    setSelectedRipper(undefined);
    setSelectedRipperDetail(undefined);
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
          <BrandText style={[fontMedium48, spacing.mt_2]}>
            {selectedRipperDetail?.name || "Please select a Ripper"}
          </BrandText>

          <Row breakpoint={992} style={{ justifyContent: "space-around" }}>
            <Col style={flex.justifyContentAround}>
              <View>
                <BrandText style={[fontMedium32]}>Available Rippers</BrandText>

                <FlatList
                  data={availableRippers}
                  numColumns={3}
                  scrollEnabled
                  style={{ height: 329 }}
                  showsVerticalScrollIndicator={false}
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
                            source={ripper.imageUri}
                            // rarity={getRipperRarity(ripper)}
                          />
                        </TertiaryBox>
                      </TouchableOpacity>
                    );
                  }}
                />

                <BrandText style={styles.showMoreText}>
                  Scroll to show more...
                </BrandText>
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
                  source={selectedRipperDetail?.imageURL}
                  size={RIPPER_IMAGE_SIZE}
                  rounded
                  containerStyle={styles.roundedContainer}
                />
              </ImageBackground>

              <BrandText style={[fontMedium24, flex.alignCenter, spacing.mt_2]}>
                Stats
              </BrandText>

              <RipperStat
                containerStyle={spacing.mt_3}
                name="Stamina"
                value={
                  selectedRipperDetail &&
                  getRipperTraitValue(selectedRipperDetail, "Stamina")
                }
                size="MD"
              />
              <RipperStat
                containerStyle={spacing.mt_3}
                name="Protection"
                value={
                  selectedRipperDetail &&
                  getRipperTraitValue(selectedRipperDetail, "Protection")
                }
                size="MD"
              />
              <RipperStat
                containerStyle={spacing.mt_3}
                name="Luck"
                value={
                  selectedRipperDetail &&
                  getRipperTraitValue(selectedRipperDetail, "Luck")
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
    right: 10,
    top: 10,
    zIndex: 1,
  },
  showMoreText: {
    alignSelf: "center",
    marginTop: 8,
    color: neutral67,
    ...(fontMedium13 as object),
  },
});
