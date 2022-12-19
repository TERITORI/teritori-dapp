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

import controllerSVG from "../../../../assets/game/controller.svg";
import dashedBorderPNG from "../../../../assets/game/dashed-border.png";
import closeSVG from "../../../../assets/icons/close.svg";
import { NFT } from "../../../api/marketplace/v1/marketplace";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import Col from "../../../components/grid/Col";
import Row from "../../../components/grid/Row";
import { SpacerRow } from "../../../components/spacer";
import { useBreeding } from "../../../hooks/riotGame/useBreeding";
import { getRipperTokenId } from "../../../utils/game";
import {
  neutral00,
  secondaryColor,
  withAlpha,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontMedium24,
  fontMedium32,
  fontMedium48,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { headerHeight, layout } from "../../../utils/style/layout";
import { AvailableRippersGrid } from "./AvailableRippersGrid";
import { RipperAvatar } from "./RipperAvatar";
import { RipperStatsSection } from "./RipperStatsSection";
import { SimpleButton } from "./SimpleButton";

type RipperSelectorModalProps = ModalProps & {
  slotId: number | undefined;
  confirmButton: string;
  availableRippers: NFT[];
  onSelectRipper?(slotId: number, ripper: NFT, breedingsLeft: number): void;
  onClose?(): void;
};

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
          <BrandText style={[fontMedium48, { marginTop: layout.padding_x2 }]}>
            {selectedRipper?.name || "Please select a Ripper"}
          </BrandText>

          <Row breakpoint={992} style={{ justifyContent: "space-around" }}>
            <Col style={{ justifyContent: "space-around" }}>
              <View>
                <BrandText style={[fontMedium32]}>Available Rippers</BrandText>

                <AvailableRippersGrid
                  availableRippers={availableRippers}
                  selectRipper={selectRipper}
                  selectedRipper={selectedRipper}
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
                  {
                    alignItems: "center",
                    alignSelf: "center",
                    marginTop: layout.padding_x2,
                  },
                ]}
              >
                Stats
              </BrandText>

              <RipperStatsSection
                ripper={selectedRipper}
                breedingsLeft={breedingsLeft}
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
    backgroundColor: withAlpha(neutral00, 0.9),
    paddingTop: headerHeight,
    borderWidth: 1,
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
  ripperThumbName: {
    marginVertical: layout.padding_x1,
    ...(fontSemibold11 as object),
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
    marginTop: layout.padding_x2_5,
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
