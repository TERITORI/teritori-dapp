import { useMemo, useState } from "react";
import { Modal, ModalProps, StyleSheet, View, Image, useWindowDimensions, ImageBackground } from "react-native";
import { BrandText } from "../../../components/BrandText";
import ModalBase from "../../../components/modals/ModalBase";
import { neutral00, orangeDefault, yellowDefault } from "../../../utils/style/colors";
import { fontMedium48 } from "../../../utils/style/fonts";
import dashedBorderSVG from '../../../../assets/game/dashed-border.svg';
import { SVG } from "../../../components/SVG";
import Carousel from 'react-native-reanimated-carousel';

type RipperSelectorModalProps = ModalProps & {
    slotId: number | undefined,
    myRippers: NSRiotGame.Ripper[],
    onClose?(): void,
}

const RipperSelectorModal: React.FC<RipperSelectorModalProps> = ({ slotId, onClose, myRippers, ...props }) => {
    // TODO: use picker
    const [selectedRipper, setSelectedRipper] = useState(myRippers[0]);

    const { width, height } = useWindowDimensions();
    const ripperImageSize = useMemo(() => Math.round(width / 3), [width]);

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

            <View style={styles.ripperImageContainer}>
                <View >
                    <Carousel
                        data={myRippers}
                        vertical
                        width={132}
                        height={132}
                        pagingEnabled
                        style={{
                            width: 300,
                        }}
                        renderItem={({ item, index }) => {
                            return <Image style={{ width: 100, height: 100 }} source={item.image} />
                        }}
                    />
                </View>


                <Image style={{ width: ripperImageSize, height: ripperImageSize }} source={selectedRipper.image} />
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
        borderColor: 'red'
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

    }
})

export default RipperSelectorModal;