import React, { useState } from "react";
import {
    useWindowDimensions,
    View,
    StyleProp,
    ViewStyle,
    ImageBackground,
	TouchableOpacity
  } from "react-native";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { ScreenFC } from "../../../utils/navigation";
import { neutral44 } from "../../../utils/style/colors";

import pathwarBanner from "../../../../assets/Banner/resourcesBanner.png";
import resourceLogo from "../../../../assets/LogoPathwarOverview/ResourceLogo.png"
import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { BiSearch } from 'react-icons/bi';
import { CgSortAz, CgOptions } from 'react-icons/Cg';
import { FiChevronDown } from 'react-icons/Fi';
import { FiChevronUp, FiCheck } from 'react-icons/Fi';
import { AiOutlineHeart } from 'react-icons/ai';

import Checkbox from "react-custom-checkbox";
import { ResourceBox } from "./ResourceBox"

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
    <View
      style={[
        { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
        style,
      ]}
    />
  );

const data = ["Challenge 1", "Challenge 2", "Challenge 3", "Challenge 4", "Challenge 5"]


export const ResourceScreen: React.FC = () => {
	const [isMoreDisplayed, setIsMoreDisplayed] = useState(false);
	const [allShowSelected, setallShowSelected] = useState(false);
	const [techPostSelected, settechPostSelected] = useState(false);
	const [securitySelected, setsecuritySelected] = useState(false);
	const [cosmosSelected, setcosmosSelected] = useState(false);
	const [gnolandSelected, setgnolandSelected] = useState(false);
	const [blogPostSelected, setblogPostSelected] = useState(false);
	const [videosSelected, setvideosSelected] = useState(false);
	const [articlesSelected, setarticlesSelected] = useState(false);

  return (
    <ScreenContainer sizeScreenContaier={40}>
		{/* <img src={pathwarBanner} alt="PathwarHeader" style={{width: "100%"}}/> */}
		<View>
			<ImageBackground source={pathwarBanner} style={{ height: 400,
			width: "100%",
			justifyContent: 'center',
			alignItems: 'center',}}>

			<img src={resourceLogo} alt="ResourceLogo" style={{width: "9%"}}/>
			<View style={{marginTop: 30}}>
			</View>
			</ImageBackground>
		</View>

		<View style={{flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center", marginTop: 20}}>
			<View style={{flexDirection: "column"}}>
				<TertiaryBox 
					width={181}
					height={50}
					mainContainerStyle={{backgroundColor: "#1C1C1C", borderColor: "#3D3D3D"}}>
						<View style={{flexDirection: "row", alignItems: "center"}}>
							<CgSortAz color="white"/>
							<BrandText style={{marginLeft: 5, marginRight: 5, fontSize: 14}}>
								Content to show
							</BrandText>
							<TouchableOpacity onPress={() => setIsMoreDisplayed(!isMoreDisplayed)}>
								{isMoreDisplayed ? <FiChevronDown color="white"/> : <FiChevronUp color="white"/>}
							</TouchableOpacity>
						</View>
				
				</TertiaryBox>

				{isMoreDisplayed ? (
				<TertiaryBox width={248} height={320} mainContainerStyle={{backgroundColor: "#1C1C1C"}} style={{marginTop: 10}} center={false}>
					<View style={{flexDirection: "column", width: "100%",}}>
					<View style={{ margin: 15}}>
					<Checkbox
						icon={
							<View
								style={{
								borderRadius: 5,
								backgroundColor: "#16BBFF",
								alignSelf: "stretch",
								}}
							>
								<FiCheck color="white" size={20} />
							</View>
						}
						name="ShowAll"
						checked={allShowSelected}
						onChange={() => { settechPostSelected(!allShowSelected); setsecuritySelected(!allShowSelected); setcosmosSelected(!allShowSelected); setgnolandSelected(!allShowSelected); setblogPostSelected(!allShowSelected); setvideosSelected(!allShowSelected); setarticlesSelected(!allShowSelected); setallShowSelected(!allShowSelected)
						}}
						borderColor="#3D3D3D"
						borderWidth={0.2}
						style={{ cursor: "pointer" }}
						labelStyle={{ marginLeft: 5, userSelect: "none", color: "white", cursor: "pointer" }}
						label={<BrandText style={{marginLeft: 5, marginRight: 5, fontSize: 14}}>
									Show All
								</BrandText>}
					/>
					</View>
						<Separator/>

					<View style={{margin: 15}}>
					<Checkbox
						icon={
							<View
								style={{
								borderRadius: 5,
								backgroundColor: "#16BBFF",
								alignSelf: "stretch",
								}}
							>
								<FiCheck color="white" size={20} />
							</View>
						}
						name="TechPost"
						checked={techPostSelected}
						onChange={() => { settechPostSelected(!techPostSelected); setsecuritySelected(!techPostSelected); setcosmosSelected(!techPostSelected); setgnolandSelected(!techPostSelected);
						}}
						borderColor="#3D3D3D"
						borderWidth={0.2}
						style={{ cursor: "pointer" }}
						labelStyle={{ marginLeft: 5, userSelect: "none", color: "white", cursor: "pointer" }}
						label={<BrandText style={{marginLeft: 5, marginRight: 5, fontSize: 14}}>
									Tech Post
								</BrandText>}
					/>
					</View>

					<View style={{marginTop: 2, marginLeft: 45, marginBottom: 15, marginRight: 17}}>
					<View style={{marginBottom: 13}}>
					<Checkbox
						icon={
							<View
								style={{
								borderRadius: 5,
								backgroundColor: "#16BBFF",
								alignSelf: "stretch",
								}}
							>
								<FiCheck color="white" size={20} />
							</View>
						}
						name="security"
						checked={securitySelected}
						onChange={() => {
							setsecuritySelected(!securitySelected)
						}}
						borderColor="#3D3D3D"
						borderWidth={0.2}
						style={{ cursor: "pointer" }}
						labelStyle={{ marginLeft: 5, userSelect: "none", color: "white", cursor: "pointer" }}
						label={<BrandText style={{marginLeft: 5, marginRight: 5, fontSize: 14}}>
									Security
								</BrandText>}
					/>
					</View>

					<View style={{marginBottom: 13}}>
					<Checkbox
						icon={
							<View
								style={{
								borderRadius: 5,
								backgroundColor: "#16BBFF",
								alignSelf: "stretch",
								}}
							>
								<FiCheck color="white" size={20} />
							</View>
						}
						name="cosmos"
						checked={cosmosSelected}
						onChange={() => {
							setcosmosSelected(!cosmosSelected)
						}}
						borderColor="#3D3D3D"
						borderWidth={0.2}
						style={{ cursor: "pointer" }}
						labelStyle={{ marginLeft: 5, userSelect: "none", color: "white", cursor: "pointer" }}
						label={<BrandText style={{marginLeft: 5, marginRight: 5, fontSize: 14}}>
									Cosmos
								</BrandText>}
					/>
					</View>

					<Checkbox
						icon={
							<View
								style={{
								borderRadius: 5,
								backgroundColor: "#16BBFF",
								alignSelf: "stretch",
								}}
							>
								<FiCheck color="white" size={20} />
							</View>
						}
						name="gnoland"
						checked={gnolandSelected}
						// onChange={() => {
						// 	gnolandSelected === "nothingChecked" ? setgnolandSelected("gnoland") : setgnolandSelected("nothingChecked")
						// }}
						borderColor="#3D3D3D"
						borderWidth={0.2}
						style={{ cursor: "pointer" }}
						labelStyle={{ marginLeft: 5, userSelect: "none", color: "white", cursor: "pointer" }}
						label={<BrandText style={{marginLeft: 5, marginRight: 5, fontSize: 14}}>
									Gnoland
								</BrandText>}
					/>
					</View>
					{/* <View> */}
					<Separator/>
					{/* </View> */}
					<View style={{margin: 17}}>
						<Checkbox
							icon={
								<View
								style={{
									borderRadius: 5,
									backgroundColor: "#16BBFF",
									alignSelf: "stretch",
								}}
								>
								<FiCheck color="white" size={20} />
								</View>
							}
							name="blogPost"
							checked={blogPostSelected}
							onChange={() => { setblogPostSelected(!blogPostSelected); setvideosSelected(!blogPostSelected); setarticlesSelected(!blogPostSelected);
							}}
							borderColor="#3D3D3D"
							borderWidth={0.2}
							style={{ cursor: "pointer" }}
							labelStyle={{ marginLeft: 5, userSelect: "none", color: "white", cursor: "pointer" }}
							label={<BrandText style={{marginLeft: 5, marginRight: 5, fontSize: 14}}>
										Blog Post
									</BrandText>}
						/>
						
						<View style={{marginTop: 17, marginLeft: 27, marginBottom: 15, marginRight: 17}}>
							<View style={{marginBottom: 13}}>
								<Checkbox
									icon={
										<View
										style={{
											borderRadius: 5,
											backgroundColor: "#16BBFF",
											alignSelf: "stretch",
										}}
										>
										<FiCheck color="white" size={20} />
										</View>
									}
									name="videos"
									checked={videosSelected}
									onChange={() => { setvideosSelected(!videosSelected);
									}}
									borderColor="#3D3D3D"
									borderWidth={0.2}
									style={{ cursor: "pointer" }}
									labelStyle={{ marginLeft: 5, userSelect: "none", color: "white", cursor: "pointer" }}
									label={<BrandText style={{marginLeft: 5, marginRight: 5, fontSize: 14}}>
												Videos
											</BrandText>}
								/>
							</View>
							<View style={{marginBottom: 13}}>
								<Checkbox
									icon={
										<View
										style={{
											borderRadius: 5,
											backgroundColor: "#16BBFF",
											alignSelf: "stretch",
										}}
										>
										<FiCheck color="white" size={20} />
										</View>
									}
									name="articles"
									checked={articlesSelected}
									onChange={() => { setarticlesSelected(!articlesSelected);
									}}
									borderColor="#3D3D3D"
									borderWidth={0.2}
									style={{ cursor: "pointer" }}
									labelStyle={{ marginLeft: 5, userSelect: "none", color: "white", cursor: "pointer" }}
									label={<BrandText style={{marginLeft: 5, marginRight: 5, fontSize: 14}}>
												Articles
											</BrandText>}
								/>
							</View>
						</View>
					</View>
				</View>


				</TertiaryBox>
				) : ""}
			</View>
		</View>
			<View style={{position:"absolute", left: "40%", top: "53.5%"}}>
				<TextInputCustom 
					label=""
					name={"Search"}
					width={270}
					placeHolder="Search..."
					mainBoxBackgroundColor="#000000"
					>
					<View  style={{right: 5}}>
						<BiSearch color="white"/>
					</View>
				</TextInputCustom>
			</View>
			<View style={{position:"absolute", left: "85%", top: "53.5%"}}>
			<TouchableOpacity>
				<TertiaryBox width={172} height={50}>
					<BrandText style={{fontSize: 14}}>
					+  Suggest content
					</BrandText>
				</TertiaryBox>
			</TouchableOpacity>
			</View>

		<View style={{display: "flex", width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 20}}>
			<ResourceBox/>
			<ResourceBox/>
		</View>
    </ScreenContainer>
  );
};