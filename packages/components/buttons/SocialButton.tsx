import React, {FC, ReactFragment} from "react"
import {
		ViewStyle,
		View,
		Image,
		TouchableOpacity,
		ImageSourcePropType,
		StyleSheet, TextStyle
} from "react-native"

import flowCardPNG from "../../../assets/cards/flow-card.png"
import {BrandText} from "../BrandText"
import {LinearGradient} from "expo-linear-gradient"
import {neutral22, neutral33, primaryColor, primaryTextColor} from "../../utils/style/colors"
import {fontMedium14, fontSemibold14} from "../../utils/style/fonts"
import {TertiaryCardTest} from "../cards/TertiaryCardTest"
import {SvgProps} from "react-native-svg"

export const SocialButton: React.FC<{
		text: string;
		iconSvg: ReactFragment;	// Ugly, but it works (Removing the fragments from parent and using the type 'Element' doesn't work)
		onPress: () => void;
		style?: ViewStyle;
}> = ({text, onPress, iconSvg, style}) => {

		return (
				<TertiaryCardTest onPress={onPress} style={style} backgroundColor={neutral22}>
						<View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
								<TertiaryCardTest backgroundColor={neutral33} width={32} height={32} squaresBckgColor={neutral22} borderRadius={6} cornerWidth={5}>
										{iconSvg}
								</TertiaryCardTest>
								<BrandText style={[fontMedium14, {marginLeft: 8, marginRight: 10}]}>
										{text}
								</BrandText>
						</View>
				</TertiaryCardTest>
		)
}