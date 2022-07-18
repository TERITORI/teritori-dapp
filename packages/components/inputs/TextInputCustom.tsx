import {NativeSyntheticEvent, TextInput, TextInputChangeEventData, View, ViewStyle} from "react-native"
import {neutral22, neutral33, neutral77} from "../../utils/colors"
import {BrandText} from "../BrandText"
import {NetworkIcon} from "../NetworkIcon"
import React, {useState} from "react"

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const TextInputCustom: React.FC<{
		label: string;
		value: string;
		placeHolder: string;
		style?: ViewStyle;
		onChangeText: (text: string) => void
}> = ({label, value, placeHolder, style, children, onChangeText}) => {

		return (
				<View
						style={[{
								borderColor: neutral33,	borderWidth: 1,	borderRadius: 8,
								backgroundColor: neutral22,
								flex: 1,
								height: 48, minHeight: 48, maxHeight: 48, minWidth: 332,
								paddingHorizontal: 12,
								justifyContent: "center",
						}, style]}
				>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={{ flex: 1, marginRight: children && 12 }}>
										<BrandText
												style={{ color: neutral77, fontSize: 10, fontWeight: "500", textTransform: "uppercase" }}
										>
												{label}
										</BrandText>
										<TextInput
												placeholder={placeHolder}
												value={value}
												onChangeText={onChangeText}
												placeholderTextColor="#999999"
												style={[
														{
																fontSize: 14,
																marginTop: 4,
																color: "white",
																fontFamily: "Exo_600SemiBold",
														},
														{ outlineStyle: "none" } as any,
												]}
										/>
								</View>

								<>{children}</>

						</View>
				</View>
		)
}