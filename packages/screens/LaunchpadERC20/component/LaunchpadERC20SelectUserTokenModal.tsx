import { BrandText } from "@/components/BrandText";
import { DropdownWithListItem } from "@/components/mini/DropdownWithListItem";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn } from "@/components/spacer";
import { errorColor, neutral77 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { useState } from "react";
import { View } from "react-native";
import { useUserTokens } from "../hooks/useUserTokens";


// type DropdownItemType = {
//     icon?: FC<SvgProps> | string;
//     name: string;
//     onPress?: (navigation: NavigationProp<any>) => void;
//   };

interface SelectTokenModalProps {
    isVisible: boolean;
    onClose: () => void;
    networkId: string;
}

export const SelectUserTokenModal: React.FC<SelectTokenModalProps> = ({ isVisible, onClose, networkId }) => {
    const [error, setError] = useState<string | null>(null);
    const { data: userTokens } = useUserTokens(networkId);
    const dropdownItems = userTokens?.map((token) => {
        return {
            name: token.name,
            onPress: () => console.log("Token selected"),
        }
    });

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
                {dropdownItems && dropdownItems.length === 0 ?
                    <DropdownWithListItem items={dropdownItems} />
                    : <BrandText style={[{ color: errorColor }, fontSemibold14]}>
                        You don't have any ERC20 tokens
                    </BrandText>
                }
                <SpacerColumn size={2.5} />
            </ModalBase>

        </View>
    )
}