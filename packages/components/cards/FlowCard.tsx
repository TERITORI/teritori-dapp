

{/*TODO: STEP3*/
}

import React from "react"
import {ViewStyle, View, StyleProp, Image, TouchableOpacity, ImageProps, ImageSourcePropType} from "react-native"

import {neutral33} from "../../utils/colors"
import {LaunchpadItem} from "../../utils/airtable"
import flowCardPNG from "../../../assets/cards/flow-card.png"
import {BrandText} from "../BrandText"

export const FlowCard: React.FC<{
		label: string;
		description: string;
		iconSource: ImageSourcePropType;
		style?: ViewStyle;
		onPress: () => void;
}> = ({
								label,
								description,
								iconSource,
								style,
								onPress
						}) => {

		const innerHeight = 56

		return (
				<TouchableOpacity style={style} onPress={onPress}>
						{/*<TouchableOpacity style={[style, {margin: gridHalfGutter}]} onPress={onPress}>*/}
						<Image
								source={flowCardPNG}
								style={{width: 392, height: 100, resizeMode: "stretch"}}
						/>

						<View style={{
								flex: 1, flexDirection: "row",
								position: 'absolute',
								height: innerHeight,
								top: `calc(50% - ${innerHeight}px / 2)`
						}}>

								<Image
										source={iconSource}
										style={{
												width: 24,
												height: 24,
												resizeMode: "stretch",
												marginLeft: 20,
												marginRight: 8
										}}
								/>

								<View style={{flex: 1, justifyContent: 'space-between'}}>
										<BrandText>{label}</BrandText>

										<BrandText
												style={{
														color: "#A3A3A3",
														fontSize: 14
												}}
										>
												{description}
										</BrandText>
								</View>


						</View>

				</TouchableOpacity>
		)
}
