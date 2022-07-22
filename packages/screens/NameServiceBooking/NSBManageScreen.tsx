import {ScreenContainer2} from "../../components/ScreenContainer2"
import React, {useContext, useEffect, useState} from "react"
import {BrandText} from "../../components/BrandText"
import {Image, TouchableOpacity, View, ViewStyle} from "react-native"
import flowCardPNG from "../../../assets/cards/flow-card.png"
import logoSmPNG from "../../../assets/logo-sm.png"
import {PrimaryPill} from "../../components/pills/PrimaryPill"
import {NSBContext} from "../../context/NSBProvider"
import {useAppNavigation} from "../../utils/navigation"
import {BacKTo} from "../../components/Footer"
import {getHandleNext, getHandlePrev, noTokens, useTokenList} from "../../hooks/tokens"
import {usePrimaryAlias} from "../../hooks/usePrimaryAlias"
import * as R from 'ramda'
import {useSigningClient} from "../../context/cosmwasm"
import {useSigningCosmWasmClient} from "../../hooks/cosmwasm"

const NameCard: React.FC <{
		fullName: string;
		isPrimary?: boolean;
		style: ViewStyle;
		onPress: () => void;
}> = ({fullName, isPrimary, style,	onPress}) => {
		const innerHeight = 44

		return (
				<TouchableOpacity style={style} onPress={onPress}>
						<Image
								source={flowCardPNG}
								style={{width: 392, height: 84, resizeMode: "stretch"}}
						/>

						<View style={{
								flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
								position: 'absolute',
								height: innerHeight, width: "100%",
								top: `calc(50% - ${innerHeight}px / 2)`
						}}>
								<View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
										<Image
												source={logoSmPNG}
												style={{
														width: 44,
														height: 44,
														resizeMode: "stretch",
														marginLeft: 20,
														marginRight: 12
												}}
										/>
										<BrandText style={{letterSpacing: -(20 * 0.04)}}> {fullName} </BrandText>
								</View>

								{isPrimary ? <PrimaryPill label={"Primary"} style={{marginRight: 20}}/> : null}
						</View>
				</TouchableOpacity>
		)
}



export const NSBManageScreen: React.FC = () => {
		const {setName, setSignedUserIsOwner} = useContext(NSBContext)
		const navigation = useAppNavigation()

		const titleFontSize = 48
		const subTitleFontSize = 28
		const onPressNameCard = name => {
				setName(name.fullName)
				setSignedUserIsOwner(true)
				navigation.navigate("NSBConsultName")
		}

		//////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////
		const { signingClient, walletAddress } = useSigningClient()
		const aaeaeaeae = useSigningCosmWasmClient()
		const { pathsAndTokens, tokens, paths, setStartAfter, page, setPage } = useTokenList()
		const { alias, loadingAlias } = usePrimaryAlias()
		const [pageStartTokens, setPageStartTokens] = useState<string[]>([])

		// ----- Init
		useEffect(() => {
				if (noTokens(tokens)) return

				const firstTokenOnCurrentPage = tokens[0]
				if (!R.includes(firstTokenOnCurrentPage, pageStartTokens)) {
						setPageStartTokens(R.append(firstTokenOnCurrentPage, pageStartTokens))
				}
		}, [tokens, pageStartTokens])

		// ----- Pagination
		const handlePrev = getHandlePrev(
				page,
				pageStartTokens,
				setPage,
				setStartAfter
		)
		const handleNext = getHandleNext(page, pathsAndTokens, setPage, setStartAfter)
		//////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////


		return (
				<ScreenContainer2 footerChildren={<BacKTo label="home" navItem="NSBHome"/>}>
						<View style={{flex: 1, alignItems: "center"}}>
								{/*TODO: Gradient text green-blue*/}
								<BrandText
										style={{fontSize: titleFontSize, lineHeight: 64, letterSpacing: -(titleFontSize * 0.04), marginTop: 32}}
								>
										{/*TODO: Dynamic value*/}
										Welcome back, Test !
								</BrandText>
								{/*TODO: Gradient text green-blue*/}


								{noTokens(tokens)
										? <BrandText style={{marginTop: 40}}>No token</BrandText>
										: <>
												{/*TODO: Integrate this when you own token !*/}
												{/*// ---------- Tokens*/}
												{/*<BrandText*/}
												{/*		style={{*/}
												{/*				fontSize: subTitleFontSize,*/}
												{/*				lineHeight: 32,*/}
												{/*				letterSpacing: -(subTitleFontSize * 0.04),*/}
												{/*				marginBottom: 20,*/}
												{/*				marginTop: 8*/}
												{/*		}}*/}
												{/*>*/}
												{/*		Manage your names*/}
												{/*</BrandText>*/}

												{/*{tokens.map(token => (*/}
												{/*		<NameCard*/}
												{/*				fullName={token.fullName} key={token.fullName}*/}
												{/*				style={{marginTop: 20}}*/}
												{/*				isPrimary={token.isPrimary}*/}
												{/*				onPress={() => onPressNameCard(token)}*/}
												{/*		/>*/}
												{/*))}*/}

												{/*// ---------- Paths*/}
												{/*<BrandText*/}
												{/*		style={{*/}
												{/*				fontSize: subTitleFontSize,*/}
												{/*				lineHeight: 32,*/}
												{/*				letterSpacing: -(subTitleFontSize * 0.04),*/}
												{/*				marginBottom: 20,*/}
												{/*				marginTop: 8*/}
												{/*		}}*/}
												{/*>*/}
												{/*		Manage your paths*/}
												{/*</BrandText>*/}

												{/*{!R.isEmpty(paths)*/}
												{/*		? paths.map(path => (*/}
												{/*						<NameCard*/}
												{/*								fullName={path.fullName} key={path.fullName}*/}
												{/*								style={{marginTop: 20}}*/}
												{/*								isPrimary={path.isPrimary}*/}
												{/*								onPress={() => onPressNameCard(path)}*/}
												{/*						/>*/}
												{/*				))*/}
												{/*		: null*/}
												{/*}*/}
										</>
								}

								{/*TODO: PrevNext buttons*/}
						</View>
				</ScreenContainer2>
		);
};
