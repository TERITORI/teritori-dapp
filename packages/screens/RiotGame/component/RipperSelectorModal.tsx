import { useMemo, useState } from "react";
import { Modal, ModalProps, StyleSheet, View, Image, useWindowDimensions, ImageBackground } from "react-native";
import { BrandText } from "../../../components/BrandText";
import ModalBase from "../../../components/modals/ModalBase";
import { neutral00, orangeDefault, yellowDefault, withAlpha, white } from "../../../utils/style/colors";
import { fontMedium32, fontMedium48, fontSemibold11 } from "../../../utils/style/fonts";
import dashedBorderSVG from '../../../../assets/game/dashed-border.svg';
import { SVG } from "../../../components/SVG";
import Carousel from 'react-native-reanimated-carousel';
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import RipperStat from './RipperStat';
import SimpleButton from './SimpleButton';

type RipperSelectorModalProps = ModalProps & {
    slotId: number | undefined,
    myRippers: NSRiotGame.Ripper[],
    onClose?(): void,
}

const RipperSelectorModal: React.FC<RipperSelectorModalProps> = ({ slotId, onClose, myRippers, ...props }) => {
    // TODO: use picker
    const [selectedRipper, setSelectedRipper] = useState(myRippers[0]);

    // TODO: do we need responsive on game ?
    // const { width, height } = useWindowDimensions();
    // const ripperImageSize = useMemo(() => Math.round(width / 3), [width]);
    const ripperImageSize = 580;

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
                                width={132}
                                height={600}
                                pagingEnabled
                                renderItem={({ item, index }) => {
                                    return <TertiaryBox mainContainerStyle={styles.ripperThumb} squaresBackgroundColor={'transparent'}>
                                        <BrandText style={styles.ripperThumbName}>{item.name}</BrandText>
                                        <Image style={{ width: 132, height: 132 }} source={item.image} />
                                    </TertiaryBox>
                                }}
                            />
                        </View>
                        <View style={styles.ripperImageContainer}>
                            <Image style={{ width: ripperImageSize, height: ripperImageSize }} source={selectedRipper.image} />
                        </View>
                    </View>
                </View>

                <View style={styles.rightCol}>
                    <BrandText style={fontMedium32}>Stats</BrandText>

                    <RipperStat containerStyle={styles.ripperStatContainer} name='Stamina' value={10.4} />
                    <RipperStat containerStyle={styles.ripperStatContainer} name='Protection' value={65.7} />
                    <RipperStat containerStyle={styles.ripperStatContainer} name='Luck' value={11.9} />

                    <SimpleButton size="small" title='Enroll this Ripper' />
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
        borderColor: 'red',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        minWidth: 992
    },
    rightCol: {
        flex: 1,
        paddingLeft: 40
    },
    leftCol: {
        flex: 2,
        alignItems: 'flex-end',
        position: 'relative',
    },
    leftColContent: {
        position: 'relative',
        width: 580,
    },
    ripperImageContainer: {
        marginTop: 20,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: orangeDefault,
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    selectListContainer: {
        position: 'absolute',
        zIndex: 2,
        left: -60
    },
    ripperThumb: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    ripperThumbName: {
        marginVertical: 9,
        ...(fontSemibold11 as object)
    },
    ripperStatContainer: {
        marginTop: 40,
    }
})

export default RipperSelectorModal;