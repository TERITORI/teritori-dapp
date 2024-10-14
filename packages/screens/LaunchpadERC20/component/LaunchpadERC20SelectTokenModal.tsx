import { BrandText } from "@/components/BrandText";
import ModalBase from "@/components/modals/ModalBase";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { useAppNavigation } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { View } from "react-native";


interface SelectTokenModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const SelectTokenModal: React.FC<SelectTokenModalProps> = ({ isVisible, onClose }) => {
    const props = { isVisible: isVisible, onClose: onClose };
    const navigation = useAppNavigation();
    const networkId = useSelectedNetworkId();

    return (
        <View
            style={{
                width: "100%",
                alignItems: "center",
            }}
        >
            <ModalBase
                onClose={props.onClose}
                label="Select your ERC20 Token"
                visible={props.isVisible}
                width={480}
            >
                <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
                    Select your ERC20 Token
                </BrandText>
            </ModalBase>

        </View>
    )
}