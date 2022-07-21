import * as React from "react";
import {TextStyle, TouchableOpacity, View, ViewStyle} from "react-native"

import {neutral30, primaryColor, primaryTextColor} from "../../utils/colors"
import { BrandText } from "../BrandText";
import {PrimaryButton} from "./PrimaryButton"

export const DarkButton: React.FC<{
		text: string;
		style?: ViewStyle;
		textStyle?: TextStyle;
		onPress: () => void;
		big?: boolean;
		disabled?: boolean;
}> = ({ text, style, textStyle, onPress, big, disabled }) => {
		const _textStyle = {color: primaryColor}
		return (
				<PrimaryButton
						text={text} onPress={onPress} big={big} disabled={disabled} backgroundColor={neutral30}
						textStyle={[_textStyle, textStyle]} style={style}/>
		);
};
