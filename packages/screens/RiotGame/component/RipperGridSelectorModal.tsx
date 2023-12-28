import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalProps,
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
import { useIsMobile } from "../../../hooks/useIsMobile";
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
import {
  headerHeight,
  layout,
  MOBILE_MAX_WIDTH,
} from "../../../utils/style/layout";

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

export const RipperSelectorModal: React.FC<RipperSelectorModalProps> = ({
  slotId,
  onClose,
  onSelectRipper,
  availableRippers,
  visible,
  confirmButton,
  ...props
}) => {
  const isMobile = useIsMobile();
  const [selectedRipper, setSelectedRipper] = useState<NFT | undefined>();
  const { width: currentWidth } = useWindowDimensions();

  const breakPoint = isMobile ? MOBILE_MAX_WIDTH : 1200;
  const ripperImageSize = isMobile ? 280 : 540;

  const centerFlex = useMemo(
    () => (currentWidth > breakPoint ? 2 : 1),
    [breakPoint, currentWidth],
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
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: withAlpha(neutral00, 0.95),
          paddingTop: headerHeight,
          borderWidth: 1,
          position: "relative",
        }}
      >
        <Pressable
          style={{
            position: "absolute",
            right: layout.spacing_x1_5,
            top: layout.spacing_x1_5,
            zIndex: 1,
          }}
          onPress={onClose}
        >
          <SVG width={40} height={40} source={closeSVG} />
        </Pressable>

        <BrandText style={isMobile ? fontMedium32 : fontMedium48}>
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
              <View
                style={{
                  position: "relative",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    zIndex: 2,
                    left: -60,
                  }}
                >
                  <FlatList
                    data={availableRippers}
                    numColumns={1}
                    style={{
                      height:
                        (THUMB_CONTAINER_SIZE + layout.spacing_x1_5) *
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
                            style={[
                              {
                                alignItems: "center",
                                width: THUMB_CONTAINER_SIZE,
                                borderWidth: 0,
                                margin: layout.spacing_x1,
                                marginRight: layout.spacing_x3,
                              },
                              isSelected && {
                                borderColor: secondaryColor,
                                borderWidth: 1,
                              },
                            ]}
                          >
                            <BrandText
                              style={[
                                fontSemibold11,
                                { marginVertical: layout.spacing_x1 },
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

                            {isSelected && (
                              <View
                                style={{
                                  position: "absolute",
                                  borderWidth: 10,
                                  borderRightWidth: 0,
                                  borderStyle: "solid",
                                  borderColor: "transparent",
                                  borderLeftColor: secondaryColor,
                                  right: -16,
                                }}
                              />
                            )}
                          </TertiaryBox>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>

                <ImageBackground
                  style={{
                    width: ripperImageSize,
                    height: ripperImageSize,
                    marginTop: layout.spacing_x2_5,
                  }}
                  source={dashedBorderPNG}
                >
                  <RipperAvatar
                    source={selectedRipper?.imageUri || ""}
                    size={ripperImageSize}
                    rounded
                    containerStyle={{
                      width: ripperImageSize - 4,
                      height: ripperImageSize - 4,
                      position: "absolute",
                      left: 2,
                      top: 2,
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                    isStaked={isNFTStaked(selectedRipper)}
                  />
                </ImageBackground>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: layout.spacing_x4,
                marginTop: 2 * layout.spacing_x4,
              }}
            >
              <BrandText style={fontMedium32}>Stats</BrandText>

              <RipperStatsSection ripper={selectedRipper} size="LG" />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 2 * layout.spacing_x4,
                  marginLeft: layout.spacing_x4,
                }}
              >
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
