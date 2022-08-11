import React from "react"
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
import {primaryColor, primaryTextColor} from "../../utils/style/colors"
import {fontSemibold14} from "../../utils/style/fonts"

export const PrimaryButtonTest: React.FC<{
		width?: number | string;
		height?: number;
		text: string;
		onPress: () => void;
		squaresBckgColor?: string;
		style?: ViewStyle | ViewStyle[];
}> = ({
								width = "fit-content",
								height = 56,
								text,
								onPress,
								squaresBckgColor = "#000000",
								style
						}) => {

		return (
				// Touchable container
				<TouchableOpacity onPress={onPress} style={[{
						width,
						height
				}, style]}>
						{/*Main container */}
						<View style={{
								width,
								height,
								backgroundColor: primaryColor,
								borderRadius: 6,
								flex: 1, alignItems: "center", justifyContent: "center"
						}}>
								<BrandText style={[fontSemibold14, {color: primaryTextColor, textAlign: "center"}]}>
										{text}
								</BrandText>
						</View>

						{/* Left top broken corner */}
						<View style={{
								width: 20, height: 20,
								left: -10,
								top: -10,
								backgroundColor: squaresBckgColor,
								transform: [{rotate: "45deg"}],
								position: "absolute",
								zIndex: 2
						}}/>

						{/* Right bottom broken corner */}
						<View style={{
								width: 20, height: 20,
								right: -10,
								bottom: -10,
								transform: [{rotate: "225deg"}],
								backgroundColor: squaresBckgColor,
								position: "absolute",
								zIndex: 2
						}}/>

				</TouchableOpacity>
		)
}