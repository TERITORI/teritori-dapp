import { useMemo, useState } from "react";
import { Modal, ModalProps, StyleSheet, View, Image, useWindowDimensions, ImageBackground } from "react-native";
import { BrandText } from "../../../components/BrandText";
import ModalBase from "../../../components/modals/ModalBase";
import { neutral00, orangeDefault, yellowDefault, withAlpha, white } from "../../../utils/style/colors";
import { fontMedium32, fontMedium48, fontSemibold11 } from "../../../utils/style/fonts";
import dashedBorderSVG from '../../../../assets/game/dashed-border.svg';
import gamepadSVG from '../../../../assets/game/gamepad.svg';
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer/SpacerRow";
import Carousel from 'react-native-reanimated-carousel';
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import RipperStat from './RipperStat';
import SimpleButton from './SimpleButton';
import { TouchableOpacity } from "react-native-gesture-handler";

type RipperSelectorModalProps = ModalProps & {
    slotId: number | undefined,
    myRippers: NSRiotGame.Ripper[],
    onClose?(): void,
}

const THUMB_CONTAINER_WIDTH = 132;
const THUMB_CONTAINER_HEIGHT = 132;

const THUMB_WIDTH = 100;
const THUMB_HEIGHT = 100;

const RIPPER_IMAGE_SIZE = 580;

const RipperSelectorModal: React.FC<RipperSelectorModalProps> = ({ slotId, onClose, myRippers, ...props }) => {
    // TODO: use picker
    const [selectedRipper, setSelectedRipper] = useState(myRippers[0]);

    // TODO: do we need responsive on game ?
    // const { width, height } = useWindowDimensions();
    // const ripperImageSize = useMemo(() => Math.round(width / 3), [width]);
    const ripperImageSize = RIPPER_IMAGE_SIZE;

    const selectRipper = (ripper: NSRiotGame.Ripper) => {
        setSelectedRipper(ripper);
    }

    // Normally this will never be visible
    if (props.visible && !slotId) {
        return <BrandText>Please select a slot</BrandText>
    }

    return <Modal
        animationType="fade"
        onRequestClose={onClose}
        transparent
        {...props}
        visible
    >
        <View style={styles.container}>
            <BrandText style={fontMedium48}>{selectedRipper.name}</BrandText>

            <View style={styles.row}>
                <View style={styles.leftCol}>
                    <View style={styles.leftColContent}>
                        <View style={styles.selectListContainer} >
                            <Carousel
                                data={myRippers}
                                width={THUMB_CONTAINER_WIDTH + 20 /* For displaying right arrow */}
                                height={THUMB_CONTAINER_HEIGHT + 20 /* For padding between items */}
                                loop={false}
                                vertical
                                style={{
                                    height: (THUMB_CONTAINER_HEIGHT + 20) * 4,
                                }}
                                pagingEnabled
                                renderItem={({ item, index }) => {
                                    const isSelected = item.id === selectedRipper.id;
                                    return <TouchableOpacity activeOpacity={0.6} onPress={() => selectRipper(item)}>
                                        <TertiaryBox noBrokenCorners mainContainerStyle={[
                                            styles.ripperThumb,
                                            isSelected && { borderColor: white, borderWidth: 1 },
                                        ]}>
                                            <BrandText style={styles.ripperThumbName}>{item.name}</BrandText>
                                            <Image style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }} source={item.image} />

                                            {isSelected && <View style={styles.arrowRight} />}
                                        </TertiaryBox>
                                    </TouchableOpacity>
                                }}
                            />
                        </View>
                        <View style={styles.ripperImageContainer}>
                            <SVG source={dashedBorderSVG} />

                            <View style={styles.roundedContainer}>
                                <Image style={styles.ripperImage} source={selectedRipper.image} />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.rightCol}>
                    <BrandText style={fontMedium32}>Stats</BrandText>

                    <RipperStat containerStyle={styles.ripperStatContainer} name='Stamina' value={selectedRipper.stamina} />
                    <RipperStat containerStyle={styles.ripperStatContainer} name='Protection' value={selectedRipper.protection} />
                    <RipperStat containerStyle={styles.ripperStatContainer} name='Luck' value={selectedRipper.luck} />

                    <View style={styles.btnGroup}>
                        <SVG source={gamepadSVG} />
                        <SpacerRow size={2} />
                        <SimpleButton size="small" title='Enroll this Ripper' />
                    </View>
                </View>
            </View>
        </View>
    </Modal >
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: neutral00,
        marginTop: 100,
        borderWidth: 1,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        minWidth: 992
    },
    rightCol: {
        flex: 1,
        paddingLeft: 40,
        paddingTop: 40,
    },
    leftCol: {
        flex: 2,
        alignItems: 'flex-end',
        position: 'relative',
    },
    leftColContent: {
        position: 'relative',
    },
    ripperImageContainer: {
        marginTop: 20,
        position: 'relative',
    },
    roundedContainer: {
        width: RIPPER_IMAGE_SIZE -2,
        height: RIPPER_IMAGE_SIZE -2,
        position: 'absolute',
        left: 1,
        top: 1,
        borderRadius: 999,
        overflow: 'hidden',
    },
    ripperImage: {
        width: RIPPER_IMAGE_SIZE,
        height: RIPPER_IMAGE_SIZE,
    },
    selectListContainer: {
        position: 'absolute',
        zIndex: 2,
        left: -60
    },
    ripperThumb: {
        alignItems: 'center',
        width: THUMB_CONTAINER_HEIGHT,
        borderWidth: 0,
    },
    ripperThumbName: {
        marginVertical: 9,
        ...(fontSemibold11 as object)
    },
    ripperStatContainer: {
        marginTop: 40,
    },
    arrowRight: {
        position: 'absolute',
        borderWidth: 10,
        borderRightWidth: 0,
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderLeftColor: white,
        right: -16,
    },
    btnGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 100,
    },
})

export default RipperSelectorModal;