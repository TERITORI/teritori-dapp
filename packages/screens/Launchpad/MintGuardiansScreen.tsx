import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import {SocialNetworks} from "../../components/Footer"
import {View} from "react-native"
import {BackToButton} from "../../components/navigation/BackToButton"
import {TertiaryBadge} from "../../components/badges/TertiaryBadge"
import {BrandText} from "../../components/BrandText"

export const MintGuardiansScreen: React.FC = () => {
		return (
				<ScreenContainer
						footerChildren={<SocialNetworks />}
						headerChildren={<BackToButton label="Guardians Collection" />}
				>
						<View
								style={{
										flex: 1, flexDirection: "row", justifyContent: "center",
										marginTop: 72,
								}}
						>
								<View style={{
										flex: 1, justifyContent: "center",
										backgroundColor: "blue",
										marginRight: 24,
								}}>
										<TertiaryBadge label="GENESIS LAUNCH"/>
										<BrandText>Genesis Guardians of Teritori</BrandText>

								</View>

								<View style={{
										flex: 1, justifyContent: "center",
										backgroundColor: "green",
								}}>

								</View>
						</View>
				</ScreenContainer>
		);
};
