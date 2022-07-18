

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
		// style?: StyleProp<ViewStyle>;
		onPress?: () => void;
}> = ({
								label,
								description,
								iconSource,
								// style,
								onPress
						}) => {

		// TODO: These variables in a parent ?
		const labelFontSize = 20
		const gridHalfGutter = 10
		const descriptionFontSize = 14
		const innerHeight = 56

		return (

				// TODO: margin here ? const declared in a parent ? margin added in the parent ?

				<TouchableOpacity style={{margin: gridHalfGutter}} onPress={onPress}>
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

								<View style={{flex: 1, flexDirection: "column", justifyContent: 'space-between'}}>
										<BrandText
												style={{
														fontSize: labelFontSize,
														letterSpacing: -(labelFontSize * 0.04)
												}}
										>
												{label}
										</BrandText>

										<BrandText
												style={{
														color: "#A3A3A3",
														fontSize: descriptionFontSize,
														// fontWeight: "500",
														letterSpacing: -(descriptionFontSize * 0.04)
												}}
										>
												{description}
										</BrandText>
								</View>


						</View>

				</TouchableOpacity>
		)
}
