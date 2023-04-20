import React from "react";
import { StyleSheet, View } from "react-native";
import ModalBase from "../../../components/modals/ModalBase";
import { neutral33, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { ProposalInfo } from "../types";
import { DaoInfo } from "../types";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { BrandText } from "../../../components/BrandText";
import { tinyAddress } from "../../../utils/text";
import { SpacerColumn } from "../../../components/spacer";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getSigningCosmWasmClient } from "../../../utils/keplr";
import { useFeedbacks } from "../../../context/FeedbacksProvider";

interface VotingStatus {
	yes: number; 
	no: number;
	abstain: number;
}
interface QuorumStatus{
	total: number;
	voted: number;
}

interface ProposalDetailInfo{
	name: string;
	description: string;
	status: string;
	creator: string;
	votingStatus: VotingStatus;
	quorumStatus: QuorumStatus;
}

enum VoteType {
	YES = 0,
	NO = 1,
	ABSTRAIN = 2
}

export const DaoProposalModal:React.FC<{
	visible?: boolean;
  	onClose: () => void;
  	daoInfo: DaoInfo;
  	proposalInfo: ProposalInfo;
}>= ({
	visible,
	onClose,
	daoInfo,
	proposalInfo
})=>{
	const { setToastSuccess, setToastError } = useFeedbacks();
	const selectedWallet = useSelectedWallet();
	const vote = async(v: VoteType)=>{
		if (!selectedWallet || proposalInfo.status !== "Open") return;
		let vs = "yes";
		if (v === VoteType.NO){
			vs = "no";
		}else if (v === VoteType.ABSTRAIN){
			vs = "abstrain";
		}
		let msg = {
  			vote: {
    			proposal_id: proposalInfo.id,
    			vote: vs
  			}
  		};
  		try{
			const walletAddress = selectedWallet.address;
	  		const signingClient = await getSigningCosmWasmClient();
		  	const createVoteRes = await signingClient.execute(
		        walletAddress,
		        daoInfo.address,
		        msg,
		        "auto"
		    );
		    if (createVoteRes){
		    	onClose();
				setToastSuccess({title: "Success Vote", message: "Success Vote"});
		    }else{
		    	onClose();
				setToastError({
          			title: "Failed to vote",
          			message: "Failed to vote"
        		}); 
		    } 
  		}catch(err){
  			onClose();
			setToastError({
          		title: "Failed to vote",
          		message: "Failed to vote"
        	});  			
  		}
	}
	return (
		<ModalBase
			onClose = {()=>{ onClose()}}
			label={`${daoInfo.name} - ${proposalInfo.id}`}
			visible={visible}
			width={800}
		>
			<View style={styles.container}>
				<View style={styles.body}>
					<View style={styles.row}>
						<BrandText style={fontSemibold14}>Name: </BrandText>
						<BrandText style={styles.textGray}>{proposalInfo.title}</BrandText>
					</View>
					<SpacerColumn size={2.5} />
					<View style={styles.row}>
						<BrandText style={fontSemibold14}>Status: </BrandText>
						<BrandText style={styles.textGray}>{proposalInfo.status}</BrandText>
					</View>
					<SpacerColumn size={2.5} />
					<View style={styles.row}>
						<BrandText style={fontSemibold14}>Creator: </BrandText>
						<BrandText style={styles.textGray}>{tinyAddress(proposalInfo.creator)}</BrandText>
					</View>
					<SpacerColumn size={2.5} />
					<View style={styles.row}>
						<BrandText style={styles.textGray}>{proposalInfo.description}</BrandText>
					</View>
				</View>
				{proposalInfo.status === "Open" && <View style={styles.footer}>
					<View style={{flexDirection: "row-reverse"}}>
						<PrimaryButton
	              			size="M"
	              			text="Abstrain"
	              			onPress={()=>{vote(VoteType.ABSTRAIN)}}
	              			style={{marginLeft: 10}}
	            		/>
	            		<PrimaryButton
	              			size="M"
	              			text="No"
	              			onPress={()=>{vote(VoteType.NO)}}
	              			style={{marginLeft: 10}}
	            		/>
						<PrimaryButton
	              			size="M"
	              			text="Yes"
	              			onPress={()=>{vote(VoteType.YES)}}	              			
	            		/>	            		
					</View>
				</View>}
			</View>
		</ModalBase>
	)
}

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		flexDirection: "column"		
	},
	body: {
		flexDirection: "column",
		marginBottom: 10
	},
	row :{
		flexDirection: "row",
		alignItems: "center"
	},

	textGray: StyleSheet.flatten([
    	fontSemibold14,
    	{
      		color: secondaryColor,
      		opacity: 0.5,
    	},
  	]),
	footer: {
		borderColor: neutral33,
		borderTopWidth: 1,
		paddingVertical: 10

	}
});