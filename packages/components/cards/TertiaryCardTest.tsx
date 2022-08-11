import React from "react"
import {
		View,
		TouchableOpacity, TextStyle, ViewStyle
} from "react-native"

import {BrandText} from "../BrandText"
import {neutral22} from "../../utils/style/colors"
import {fontMedium14} from "../../utils/style/fonts"


// A card with solid background color, no border, children
export const TertiaryCardTest: React.FC<{
		width?: number | string;
		height?: number;
		paddingH?: number;
		paddingV?: number;
		borderRadius?: number;
		backgroundColor?: string;
		onPress?: () => void;
		disabled?: boolean;
		squaresBckgColor?: string;
		// Less or more big "broken" corner
		cornerWidth?: number;
		style?: ViewStyle | ViewStyle[];
}> = ({
								width = "fit-content",
								height = 44,
								children,
								backgroundColor = neutral22,
								borderRadius = 8,
								onPress,
																																							paddingH = 6,
																																							paddingV = 6,
								squaresBckgColor = "#000000",
																																							cornerWidth = 8,
								style
						}) => {

		return (
				// Touchable container
				<TouchableOpacity onPress={onPress} style={[{
						width,
						height: height
				}, style]}>
						{/*Main container */}
						<View style={{
								width,
								height: height - paddingV * 2,
								backgroundColor,
								borderRadius,
								paddingVertical: paddingV,
								paddingHorizontal: paddingH,
								flex: 1, alignItems: "center", justifyContent: "center"
						}}>
								<>{children}</>
						</View>

						{/* Left top broken corner */}
						<View style={{
								width: cornerWidth, height: 20,
								left: 0,
								top: -6,
								backgroundColor: squaresBckgColor,
								transform: [{rotate: "45deg"}],
								position: "absolute",
								zIndex: 2
						}}/>

						{/* Right bottom broken corner */}
						<View style={{
								width: cornerWidth, height: 20,
								right: 0,
								bottom: -6,
								transform: [{rotate: "225deg"}],
								backgroundColor: squaresBckgColor,
								position: "absolute",
								zIndex: 2
						}}/>

				</TouchableOpacity>
		)
}