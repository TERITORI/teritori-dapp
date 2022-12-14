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
import { NFT } from "../../../api/marketplace/v1/marketplace";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import Col from "../../../components/grid/Col";
import Row from "../../../components/grid/Row";
import { SpacerRow } from "../../../components/spacer/SpacerRow";
import { useBreeding } from "../../../hooks/riotGame/useBreeding";
import { getRipperRarity, getRipperTokenId, getRipperTraitValue } from "../../../utils/game";
import { neutral00, white, yellowDefault } from "../../../utils/style/colors";
import {
  fontMedium24,
  fontMedium32,
  fontMedium48,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { headerHeight } from "../../../utils/style/layout";
import { spacing } from "../../../utils/style/spacing";
import { RipperAvatar } from "./RipperAvatar";
import { RipperStat } from "./RipperStat";
import { SimpleButton } from "./SimpleButton";

type RipperSelectorModalProps = ModalProps & {
  slotId: number | undefined;
  confirmButton: string;
  availableRippers: NFT[];
  onSelectRipper?(slotId: number, ripper: NFT, breedingsLeft: number): void;
  onClose?(): void;
};

const THUMB_CONTAINER_WIDTH = 120;
const THUMB_CONTAINER_HEIGHT = 120;

const THUMB_SIZE = 100;

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
  const [selectedRipper, setSelectedRipper] = useState<NFT | undefined>();
  const [breedingsLeft, setBreedingsLeft] = useState<number>(0);
  const { getBreedingsLefts } = useBreeding();

  const selectRipper = async (ripper: NFT) => {
    setSelectedRipper(ripper);

    const tokenId = getRipperTokenId(ripper);

    setBreedingsLeft(0);
    const breedingsLeft = await getBreedingsLefts(tokenId);
    setBreedingsLeft(breedingsLeft);
  };

  const confirmRipper = () => {
    if (!selectedRipper) return;
    onSelectRipper &&
      onSelectRipper(slotId as number, selectedRipper, breedingsLeft);
    setBreedingsLeft(0);
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
          style={{ width: "100%" }}
          contentContainerStyle={{ alignItems: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <BrandText style={[fontMedium48, spacing.mt_2]}>
            {selectedRipper?.name || "Please select a Ripper"}
          </BrandText>

          <Row breakpoint={992} style={{ justifyContent: "space-around" }}>
            <Col style={{ justifyContent: "space-around" }}>
              <View>
                <BrandText style={[fontMedium32]}>Available Rippers</BrandText>

                <FlatList
                  data={availableRippers}
                  numColumns={3}
                  scrollEnabled
                  style={{ height: 329 }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item: ripper, index }) => {
                    const isSelected = ripper.id === selectedRipper?.id;

                    return (
                      <TouchableOpacity
                        key={ripper.id}
                        activeOpacity={0.6}
                        onPress={() => selectRipper(ripper)}
                      >
                        <TertiaryBox
                          style={{ margin: 10 }}
                          width={THUMB_CONTAINER_WIDTH}
                          height={THUMB_CONTAINER_HEIGHT}
                          mainContainerStyle={[
                            isSelected && {
                              borderColor: white,
                              borderWidth: 1,
                            },
                          ]}
                        >
                          <RipperAvatar
                            size={THUMB_SIZE}
                            source={ripper.imageUri}
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
                  disabled={!selectedRipper}
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
                  source={selectedRipper?.imageUri || ""}
                  size={RIPPER_IMAGE_SIZE}
                  rounded
                  containerStyle={styles.roundedContainer}
                />
              </ImageBackground>

              <BrandText
                style={[
                  fontMedium24,
                  spacing.mt_2,
                  { alignItems: "center", alignSelf: "center" },
                ]}
              >
                Stats
              </BrandText>

              <RipperStat
                containerStyle={spacing.mt_3}
                name="Stamina"
                value={
                  selectedRipper &&
                  getRipperTraitValue(selectedRipper, "Stamina")
                }
                size="MD"
              />
              <RipperStat
                containerStyle={spacing.mt_3}
                name="Protection"
                value={
                  selectedRipper &&
                  getRipperTraitValue(selectedRipper, "Protection")
                }
                size="MD"
              />
              <RipperStat
                containerStyle={spacing.mt_3}
                name="Luck"
                value={
                  selectedRipper && getRipperTraitValue(selectedRipper, "Luck")
                }
                size="MD"
              />

              <RipperStat
                containerStyle={spacing.mt_3}
                name="Breedings left"
                showProgress={false}
                value={breedingsLeft}
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
});
