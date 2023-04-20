import React from "react";
import { StyleSheet, View } from "react-native";
import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { neutral33, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { tinyAddress } from "../../../utils/text";

interface MemberInfo {
  address: string;
  votingPower: string;
  votingWeight: string;
};

export const DaoMemberList: React.FC<{}> = ({}) =>{
	const members: MemberInfo[] = [{
	    address: "tori1z05qcfkt73zlg2m6jsfx72uf5r0pmy50cd5ktx",
	    votingPower: "9.091%",
	    votingWeight: "1"
	  },
	  {
	    address: "tori1z05qcfkt73zlg2m6jsfx72uf5r0pmy50cd5ktx",
	    votingPower: "9.091%",
	    votingWeight: "1"
	  },
	  {
	    address: "tori1z05qcfkt73zlg2m6jsfx72uf5r0pmy50cd5ktx",
	    votingPower: "9.091%",
	    votingWeight: "1"
	  }
  ]
	return (
		<View style={styles.container}>
			<BrandText style={[fontSemibold14,{paddingLeft: 10}]}>{members.length} members</BrandText>            
            <View style={{flexWrap: "wrap", flexDirection: "row"}}>
            	{members.map((member, index)=>
            		<View key={index} style={styles.memberItem}>
            			<View style={{flexDirection:"row", height: 50,justifyContent: "center", alignItems: "center"}}>
            				<BrandText style={[fontSemibold14]}># {tinyAddress(member.address, 16)}</BrandText>
            			</View>
            			<View style={{flexDirection: "column", margin: 20}}>
            				<View style={{flexDirection:"row", justifyContent: "space-between"}}>
            					<BrandText style={styles.textGrayStyle}>Voting power</BrandText>            					
            					<BrandText style={[fontSemibold14]}>{member.votingPower}</BrandText>
            				</View>
            				<SpacerColumn size={2} />
            				<View style={{flexDirection:"row", justifyContent: "space-between"}}>
            					<BrandText style={styles.textGrayStyle}>Voting weight</BrandText>            					
            					<BrandText style={[fontSemibold14]}>{member.votingWeight}</BrandText>
            				</View>            				
            			</View>
            		</View>
            	)}
            </View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 10,
		flexDirection: "column",
		borderTopWidth: 1,
		borderColor: neutral33
	},
	memberItem: {
		flexDirection: "column",
		borderWidth:  1,
		borderRadius: 12,
		borderColor: neutral33,
		width: 250,
		margin: 10,
		padding: 10,
	},
	textGrayStyle: StyleSheet.flatten([
    	fontSemibold14,
    	{
      		color: secondaryColor,
      		opacity: 0.5,
    	}]
  	),
});