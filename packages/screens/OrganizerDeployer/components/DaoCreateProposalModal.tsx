import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import ModalBase from "../../../components/modals/ModalBase";
import { BrandText } from "../../../components/BrandText";
import { layout } from "../../../utils/style/layout";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { CreateDaoProposalFormType, DaoInfo } from "../types";
import { SpacerColumn } from "../../../components/spacer";
import { neutral33, secondaryColor } from "../../../utils/style/colors";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getSigningCosmWasmClient } from "../../../utils/keplr";
import { useFeedbacks } from "../../../context/FeedbacksProvider";

export const DaoCreateProposalModal:React.FC<{
	visible?: boolean;
  	onClose: () => void;
  	daoInfo: DaoInfo;
}>= ({
	visible,
	onClose,
	daoInfo,
})=>{	
	const { setToastSuccess, setToastError } = useFeedbacks();
	const selectedWallet = useSelectedWallet();

	const {	
		control,
	    handleSubmit,
	    watch,
	    formState: { isValid },
  	} = useForm<CreateDaoProposalFormType>(
  		{
  			defaultValues:{
 				proposalName: "",
  				proposalDescription: ""
  			},
  			mode: "all",
		}
  	);  	
  	const publishProposal = async (data: CreateDaoProposalFormType)=>{
  		if (!isValid) return;
  		let proposalName = watch('proposalName');
  		let proposalDescription = watch('proposalDescription');

  		if (!selectedWallet) return;
  		let msg = {
  			propose:{
  				msg: {
  					title: proposalName,
  					description: proposalDescription
  				}
  			}
  		};
  		try{
			const walletAddress = selectedWallet.address;
	  		const signingClient = await getSigningCosmWasmClient();
		  	const createProposalRes = await signingClient.execute(
		        walletAddress,
		        daoInfo.address,
		        msg,
		        "auto"
		    );
		    if (createProposalRes){
		    	onClose();
				setToastSuccess({title: "Created proposal successfully", message: "Created proposal successfully"});
		    }else{
		    	onClose();
				setToastError({
          			title: "Failed to create proposal",
          			message: "Failed to create proposal"
        		}); 
		    } 
  		}catch(err){
  			onClose();
			setToastError({
          		title: "Failed to create proposal",
          		message: err.message
        	});  			
  		}
  	}

	return (
		<ModalBase
			onClose = {()=>{ onClose()}}
			label="New Proposal"
			visible={visible}
			width={800}
		>
			<View style={styles.container}>
				<View style={styles.body}>
					<TextInputCustom<CreateDaoProposalFormType>
						control={control}
                  		variant="noCropBorder"                  		
                  		placeHolder="Type your proposal name here"
                  		name="proposalName"                  			
                  		label="Proposal name" 
                  		rules={{ required: true }}
                  		isAsterickSign
                	/>
                	<SpacerColumn size={2.5} />
					<TextInputCustom<CreateDaoProposalFormType>
						control={control}
                  		variant="noCropBorder"                  		
                  		placeHolder="Type your proposal description here"
                  		name="proposalDescription"
                  		label="Proposal Description"                  		
                  		multiline
              			numberOfLines={3}
              			rules={{ required: true }}
              			isAsterickSign
                	/>
				</View>
				<View style={styles.footer}>
					<View style={{flexDirection: "row-reverse"}}>
						<PrimaryButton
	              			size="M"
	              			text="Publish"
	              			onPress={()=>{publishProposal()}}
	              			disabled={!isValid}
	            		/>	
					</View>
				</View>
			</View>
		</ModalBase>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		flexDirection: "column"		
	},
	body: {
		flexDirection: "column"
	},
	footer: {
		borderColor: neutral33,
		borderTopWidth: 1,
		paddingVertical: 10
	},

});
