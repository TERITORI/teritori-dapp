import { BrandText } from "@/components/BrandText";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn } from "@/components/spacer";
import { errorColor, neutral77 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { View } from "react-native";
import { LaunchpadERC20TokensDropdown } from "./LaunchpadERC20TokensDropdown";


// type DropdownItemType = {
//     icon?: FC<SvgProps> | string;
//     name: string;
//     onPress?: (navigation: NavigationProp<any>) => void;
//   };

interface SelectTokenModalProps {
    isVisible: boolean;
    onClose: () => void;
    networkId: string;
    items: string[] | undefined;
}

export const SelectUserTokenModal: React.FC<SelectTokenModalProps> = ({ isVisible, onClose, networkId, items }) => {
    const props = { isVisible: isVisible, onClose: onClose };

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
                <SpacerColumn size={2.5} />
                {items && items.length !== 0 ?
                    <LaunchpadERC20TokensDropdown items={items} />
                    : <BrandText style={[{ color: errorColor }, fontSemibold14]}>
                        You don't have any ERC20 tokens
                    </BrandText>
                }
                <SpacerColumn size={2.5} />
            </ModalBase>

        </View>
    )
}