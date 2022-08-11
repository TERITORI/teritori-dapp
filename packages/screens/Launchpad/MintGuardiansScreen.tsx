import React from "react"

import {ScreenContainer} from "../../components/ScreenContainer"
import {SocialNetworks} from "../../components/Footer"
import {View} from "react-native"
import {BackTo} from "../../components/navigation/BackTo"
import {TertiaryBadge} from "../../components/badges/TertiaryBadge"
import {BrandText} from "../../components/BrandText"
import {AttributesCardTest} from "../../components/cards/AttributesCardTest"
import {fontSemibold14} from "../../utils/style/fonts"
import {ProgressionCard} from "../../components/cards/ProgressionCard"
import {PrimaryButtonTest} from "../../components/buttons/PrimaryButtonTest"
import {SecondaryCardTest} from "../../components/cards/SecondaryCardTest"
import {SocialButton} from "../../components/buttons/SocialButton"
import DiscordSVG from "../../../assets/icons/discord.svg"
import WebsiteSVG from "../../../assets/icons/website.svg"
import TwitterSVG from "../../../assets/icons/twitter.svg"

//TODO: Dynamic data

export const MintGuardiansScreen: React.FC = () => {
		return (
				<ScreenContainer
						footerChildren={<SocialNetworks/>}
						headerChildren={<BackTo label="Guardians Collection"/>}
				>
						<View
								style={{
										flex: 1, flexDirection: "row", justifyContent: "center",
										marginTop: 72
								}}
						>
								<View style={{
										flex: 1, justifyContent: "center",
										backgroundColor: "blue",
										marginRight: 24
								}}>
										<TertiaryBadge label="GENESIS LAUNCH"/>

										<BrandText>Genesis Guardians of Teritori</BrandText>

										<View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
												<AttributesCardTest label="Supply" value="5000"/>
												<AttributesCardTest label="Price" value="5 SOL"/>
												<AttributesCardTest label="Limit Buy" value="5 by address"/>
										</View>

										<BrandText style={[fontSemibold14]}>

												{/*TODO: Allow to use \n to make new lines directly on text (And remove <br/>*/}
												For decades, the destruction of ecosystems and social relations has turned people into soulless robots. At
												the same time, inequality explodes every year and misery becomes the norm for the silent majority.<br/>
												<br/>
												A minority of powerful & wealthy leaders, called the “The Legion'', have set up a technological & political
												system allowing them to continue to develop their wealth and safety.<br/>
												Of course this system only serves the happy few elite members of the society while the majority survives in
												an increasingly uncertain world.<br/>
												<br/>
												Small groups start to gather in the shadows to take action.<br/>
												They go by the name of “Guardians” and believe that everyone should be able to live autonomously without the
												need to rely on “The Legion”. Their solution for a better world is to offer a decentralized ecosystem open
												to anyone, rich or poor.
										</BrandText>

										<ProgressionCard label="Tokens Minted" valueCurrent={1343} valueMax={1999}/>

										<PrimaryButtonTest text="Mint now" onPress={() => {/*TODO:*/
										}} width={160}/>

										<View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
												<SocialButton
														text="Discord" iconSvg={<><DiscordSVG/></>} onPress={() => {/*TODO:*/
												}}
														style={{marginRight: 12}}/>
												<SocialButton text="Website" iconSvg={<><WebsiteSVG/></>} onPress={() => {/*TODO:*/
												}} style={{marginRight: 12}}/>
												<SocialButton text="Twitter" iconSvg={<><TwitterSVG/></>} onPress={() => {/*TODO:*/
												}}/>
										</View>
								</View>

								<View style={{
										flex: 1, justifyContent: "center",
										backgroundColor: "green"
								}}>

								</View>
						</View>
				</ScreenContainer>
		)
}