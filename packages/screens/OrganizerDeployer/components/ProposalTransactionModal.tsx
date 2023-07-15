import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

import { ProposalTransactionItemProps } from "./ProposalTransactionItem";
import { BrandText } from "../../../components/BrandText";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useNSPrimaryAlias } from "../../../hooks/useNSPrimaryAlias";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { getUserId } from "../../../networks";
import {
  neutral33,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { tinyAddress } from "../../../utils/text";

//TODO: Something like DAOProposalModal.tsx

export const ProposalTransactionModal: FC<{
  visible?: boolean;
  onClose: () => void;
  transaction: ProposalTransactionItemProps;
}> = ({ visible, onClose, transaction }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { primaryAlias } = useNSPrimaryAlias(
    getUserId(selectedNetworkId, transaction.createdBy)
  );
  return (
    <ModalBase
      onClose={onClose}
      label={`Transaction ${transaction._id}`}
      visible={visible}
      width={800}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <BrandText style={fontSemibold14}>TITLE ?</BrandText>
          <SpacerColumn size={2.5} />

          <View style={styles.row}>
            <BrandText style={fontSemibold14}>Creator: </BrandText>
            <BrandText style={styles.textGray}>
              {primaryAlias
                ? `@${primaryAlias}`
                : tinyAddress(transaction.createdBy, 24)}
            </BrandText>
          </View>

          <SpacerColumn size={2.5} />

          {/*  */}
          {/*  {!!proposalInfo.proposal.description && (*/}
          {/*    <>*/}
          {/*      <SpacerColumn size={2.5} />*/}
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            {/*{proposalInfo.proposal.description}*/}
            CONTENT ?
          </BrandText>
          {/*    </>*/}
          {/*  )}*/}
          {/*  <BrandText style={fontSemibold14}>Actions:</BrandText>*/}
          {/*  <SpacerColumn size={2.5} />*/}
          {/*  <ProposalMessagesList proposal={proposalInfo} />*/}
          {/*</View>*/}

          {/*<SpacerColumn size={2.5} />*/}
          {/*<View style={{ marginBottom: modalMarginPadding }}>*/}
          {/*  <ProposalActions daoId={daoId} proposal={proposalInfo} />*/}
        </View>
      </View>
    </ModalBase>
  );
};

// const ProposalMessagesList: React.FC<{ proposal: ProposalResponse }> = ({
//   proposal,
// }) => {
//   return (
//     <>
//       {proposal.proposal.msgs.map((message, index) => {
//         return (
//           <>
//             {index !== 0 && <SpacerColumn size={2.5} />}
//             <View
//               style={{
//                 borderWidth: 1,
//                 borderColor: neutral77,
//                 borderRadius: 8,
//                 padding: 8,
//               }}
//             >
//               <MessagePreview message={message} key={index} />
//             </View>
//           </>
//         );
//       })}
//     </>
//   );
// };

// const MessagePreview: React.FC<{ message: CosmosMsgForEmpty }> = ({
//   message,
// }) => {
//   const socialFeedContractAddress =
//     getCosmosNetwork("teritori-testnet")?.socialFeedContractAddress; // FIXME
//   const m = cloneDeep(message);
//   if ("wasm" in m && "execute" in m.wasm) {
//     const msg = JSON.parse(
//       Buffer.from(m.wasm.execute.msg, "base64").toString()
//     );
//     const action = Object.keys(msg)[0];
//     const payload = msg[action];
//
//     if (m.wasm.execute.contract_addr === socialFeedContractAddress) {
//       if (action === "create_post") {
//         return (
//           <View>
//             <BrandText>Post on social feed</BrandText>
//             <SpacerColumn size={2.5} />
//             <SocialMessageContent
//               postCategory={payload.category}
//               metadata={JSON.parse(payload.metadata)}
//               isPreview
//             />
//           </View>
//         );
//       }
//     } else {
//       m.wasm.execute.msg = payload;
//     }
//   }
//   return (
//     <BrandText style={styles.textGray}>{JSON.stringify(m, null, 4)}</BrandText>
//   );
// };

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "column",
  },
  body: {
    flexDirection: "column",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
    paddingVertical: 10,
  },
});
