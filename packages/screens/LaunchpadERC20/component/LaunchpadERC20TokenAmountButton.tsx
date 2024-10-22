import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Label } from "@/components/inputs/TextInputCustom";
import { neutral17, neutralFF } from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { StyleProp, TextInput, View, ViewStyle } from "react-native";

interface LaunchpadERC20TokenAmountButtonProps {
    amount: number;
    setAmount: (amount: number) => void;
    placeholder?: string;
    buttonLabel: string;
    onPress?: () => void;
    disabled?: boolean;
    viewStyle: StyleProp<ViewStyle>;
}

export const LaunchpadERC20TokenAmountButton: React.FC<LaunchpadERC20TokenAmountButtonProps> = ({
    amount,
    setAmount,
    placeholder = "Amount",
    buttonLabel,
    onPress,
    disabled,
    viewStyle
}) => {
    return (
        <View
            style={viewStyle}
        >
            <Label style={{ marginBottom: layout.spacing_x1 }} isRequired>
                {placeholder}
            </Label>

            <TertiaryBox
                style={{
                    width: "100%",
                    height: 40,
                    flexDirection: "row",
                    paddingHorizontal: 12,
                    backgroundColor: neutral17,
                    alignItems: "center",
                }}
            >
                <TextInput
                    style={{
                        flex: 1,
                        color: neutralFF,
                        ...fontSemibold16,
                    }}
                    placeholder={placeholder}
                    placeholderTextColor={neutralFF}
                    value={amount.toString()}
                    onChangeText={(text) => setAmount(Number(text))}
                    keyboardType="numeric"
                />
                <PrimaryButton
                    onPress={onPress}
                    text={buttonLabel}
                    size="SM"
                    disabled={disabled}
                />
            </TertiaryBox>
        </View>
    );
};