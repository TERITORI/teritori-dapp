import {NSBIntro} from "../../components/NameServiceBooking/NSBIntro"

{/*TODO: STEP3*/}

import React, {useState} from "react"

import { ComingSoon } from "../../components/ComingSoon";
import { ScreenContainer } from "../../components/ScreenContainer";
import {NSBLanding} from "../../components/NameServiceBooking/NSBLanding"
import {ScreenContainer2} from "../../components/ScreenContainer2"
import {BacKTo} from "../../components/Footer"
import {BrandText} from "../../components/BrandText"
import {View} from "react-native"
import ModalBase from "../../components/modals/ModalBase"

export const NSBExploreScreen: React.FC = () => {
		const titleFontSize = 48

		return (
				<ScreenContainer2 footerChildren={
						<BacKTo label="home" navItemLabel="Home"/>
				}>
						<View style={{flex: 1, flexDirection: "column", alignItems: "center"}}>
								{/*<NSBIntro nsbPage="Explore"/>*/}
								<BrandText
										style={{fontSize: titleFontSize, lineHeight: 64, letterSpacing: -(titleFontSize * 0.04), marginBottom: 24, marginTop: 32}}
								>
										Find a name
								</BrandText>
						</View>

						{/*<NSBLanding/>*/}
				</ScreenContainer2>
		);
};
