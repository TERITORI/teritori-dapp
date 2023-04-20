import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { neutral33, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { DaoCreateProposalModal } from "./DaoCreateProposalModal";
import { DaoProposalModal } from "./DaoProposalModal";
import { ProposalInfo } from "../types";
import { DaoInfo } from "../types";

export const DaoProposalList: React.FC<{
	daoInfo: DaoInfo
}> = ({
	daoInfo
}) =>{
	const proposals: ProposalInfo[] = [{
	    id: 1,
	    status: "Passed",
	    title: "Remove inactive, non-contributing member",
	    date: "Apirl 12",
	    creator: "tori1z05qcfkt73zlg2m6jsfx72uf5r0pmy50cd5ktx",
	    description: "test proposal description1"
	  },
	  {
	    id: 2,
	    status: "Open",
	    title: "Remove inactive, non-contributing member",
	    date: "Apirl 12",
	    creator: "tori1z05qcfkt73zlg2m6jsfx72uf5r0pmy50cd5ktx",
	    description: "test proposal description2",
	  },
	  {
	    id: 3,
	    status: "Passed",
	    title: "Remove inactive, non-contributing member",
	    date: "Apirl 12",
	    creator: "tori1z05qcfkt73zlg2m6jsfx72uf5r0pmy50cd5ktx",
	    description: "test proposal description3"
	  }
  	];
  	const [displayCreateProposalModal, setDisplayCreateProposalModal] = useState<boolean>(false);
  	const [displayProposalModal, setDisplayProposalModal] = useState<boolean>(false);
  	const [selectedProposal, setSelectedProposal] = useState<ProposalInfo | null>(null);

	const onCreateProposal = async()=>{
		setDisplayCreateProposalModal(true);
	}
	const showProposal = () =>{
		setDisplayProposalModal(true);
	}

	return (
		<View style={styles.container}>
			{displayCreateProposalModal && 
				<DaoCreateProposalModal 
					visible={displayCreateProposalModal}
					onClose={() => setDisplayCreateProposalModal(false)}
					daoInfo={daoInfo}
				/>
			}
			{displayProposalModal && selectedProposal &&
				<DaoProposalModal 
					visible={displayProposalModal}
					onClose={() => setDisplayProposalModal(false)}
					proposalInfo = {selectedProposal}
					daoInfo = {daoInfo}
				/>
			}

			<View style={styles.row}>
				<BrandText style={styles.titleStyle}>Create a proposal</BrandText>
				<PrimaryButton
	              size="M"
	              text="New proposal"
	              onPress={()=>{onCreateProposal()}}
	            />	
            </View>
            <View style={styles.proposals}>
            	<View style={{flexDirection: "row"}}>
            		<BrandText style={styles.titleStyle}>Proposals</BrandText>
            	</View>
            	<View style={{flexDirection: "column"}}>
            	{
            		proposals.map((proposal, index)=>
            			<Pressable key={`proposal-${index}`} onPress={()=>{
            				setSelectedProposal(proposal);
            				showProposal();
            			}}>
	            			<View 
	            			key={index}
	            			style={{flexDirection: "row", paddingVertical: 10}}>

	            				<View style={{flexShrink: 0, width: "5rem"}}>
	            					<BrandText style={styles.textStyle}>{proposal.id}</BrandText>
	            				</View>
	            				<View style={{flexShrink: 0, width: "5rem"}}>
	            					<BrandText style={styles.textStyle}>{proposal.status}</BrandText>
	            				</View>
	            				<View style={{flexGrow: 1}}><BrandText style={styles.textStyle}>{proposal.title}</BrandText></View>
	            				<View style={{flexShrink: 0}}><BrandText style={styles.textStyle}>{proposal.date}</BrandText></View>
	            			</View>
            			</Pressable>
            		)
            	}
            	</View>
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
	row:{
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	proposals: {
		paddingTop: 10,
		borderTopWidth: 1,
		borderColor: neutral33,
		flexDirection: "column",
		marginTop: 10
	},
	titleStyle: StyleSheet.flatten([
		fontSemibold14,
		{
			color: secondaryColor
		}]
	),
	textStyle: StyleSheet.flatten([
		fontSemibold13,
		{
			color: secondaryColor
		}]
	)
});