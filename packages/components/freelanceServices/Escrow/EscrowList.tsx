import React, { useEffect, useState } from "react";
import { FlatList, StyleProp, View, ViewStyle } from "react-native";

import { EscrowInfo } from "../../../api/freelance/v1/freelance";
import { TeritoriEscrowClient } from "../../../contracts-clients/teritori-freelance/TeritoriEscrow.client";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  mustGetCosmosNetwork,
} from "../../../networks";
import { useAppNavigation } from "../../../utils/navigation";
import { mineShaftColor } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import { EscrowStatus } from "../../../utils/types/freelance";
import { BrandText } from "../../BrandText";
import { SecondaryButtonOutline } from "../../buttons/SecondaryButtonOutline";
import { SpacerRow } from "../../spacer";
import { TableRow, TableRowHeading } from "../../table";

const TABLE_ROWS: { [key in string]: TableRowHeading } = {
  sender: {
    label: "Sender",
    flex: 3,
  },
  receiver: {
    label: "Receiver",
    flex: 3,
  },
  amount: {
    label: "Amount",
    flex: 2,
  },
  expireAt: {
    label: "Expire At",
    flex: 1,
  },
  status: {
    label: "Status",
    flex: 1,
  },
  action: {
    label: "Action",
    flex: 1,
  },
};

export const EscrowTable: React.FC<{
  escrows: EscrowInfo[];
  style?: StyleProp<ViewStyle>;
}> = ({ escrows, style }) => {
  // variables
  const ROWS = TABLE_ROWS;
  // returns
  return (
    <>
      <TableRow headings={Object.values(ROWS)} />
      <FlatList
        data={escrows}
        style={style}
        renderItem={({ item }) => <EscrowRow escrow={item} />}
      />
    </>
  );
};

const getStringStatus = ["Create-Contract", "Accept", "Cancel", "Complete"];

const EscrowRow: React.FC<{
  escrow: EscrowInfo;
}> = ({ escrow }) => {
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();

  const [isShowAccept, setIsShowAccept] = useState<boolean>(false);
  const [isShowCancel, setIsShowCancel] = useState<boolean>(false);
  const [isShowPause, setIsShowPause] = useState<boolean>(false);
  const [isShowResume, setIsShowResume] = useState<boolean>(false);
  const [isShowComplete, setIsShowComplete] = useState<boolean>(false);
  const navigation = useAppNavigation();

  useEffect(() => {
    if (!selectedWallet) return;
    const walletAddress = selectedWallet.address;
    if (escrow.sender !== walletAddress && escrow.receiver !== walletAddress)
      return;
    const isBuyer = escrow.sender === walletAddress;
    switch (escrow.status) {
      case EscrowStatus.CreateContract:
        if (isBuyer) {
          setIsShowCancel(true);
        } else {
          setIsShowAccept(true);
        }
        break;
      case EscrowStatus.Accept:
        if (isBuyer) {
          setIsShowPause(true);
          setIsShowComplete(true);
        }
        break;
      case EscrowStatus.Pause:
        if (isBuyer) {
          setIsShowResume(true);
        }
        break;
    }
  }, [escrow, selectedWallet]);

  const getExpireAt = (startTime: string, expireAt: number): string => {
    let d = new Date(startTime);
    d = new Date(d.getTime() + expireAt);
    return `${d.getFullYear()}/${
      d.getMonth() + 1
    }/${d.getDate()} ${d.getHours()}:${d.getSeconds()}`;
  };

  const clickAccept = async () => {
    if (!selectedWallet) return;
    const signingClient = await getKeplrSigningCosmWasmClient(networkId);
    const network = mustGetCosmosNetwork(networkId);
    const client = new TeritoriEscrowClient(
      signingClient,
      selectedWallet?.address!,
      network.freelanceEscrowAddress!
    );

    const escrowRes = await client.acceptContract({ id: escrow.id });
    if (escrowRes) {
      navigation.replace("FreelanceServicesEscrow");
    } else {
      console.log("failed");
    }
  };

  const clickPause = async () => {
    if (!selectedWallet) return;
    const signingClient = await getKeplrSigningCosmWasmClient(networkId);
    const network = mustGetCosmosNetwork(networkId);
    const client = new TeritoriEscrowClient(
      signingClient,
      selectedWallet?.address!,
      network.freelanceEscrowAddress!
    );
    const escrowRes = await client.pauseContract({ id: escrow.id });
    if (escrowRes) {
      navigation.replace("FreelanceServicesEscrow");
    } else {
      console.log("failed");
    }
  };
  const clickResume = async () => {
    if (!selectedWallet) return;
    const increasedExpiredAt = 0;
    const signingClient = await getKeplrSigningCosmWasmClient(networkId);
    const network = mustGetCosmosNetwork(networkId);
    const client = new TeritoriEscrowClient(
      signingClient,
      selectedWallet?.address!,
      network.freelanceEscrowAddress!
    );
    const escrowRes = await client.resumeContract({
      id: escrow.id,
      increasedExpiredAt,
    });

    if (escrowRes) {
      navigation.replace("FreelanceServicesEscrow");
    } else {
      console.log("failed");
    }
  };

  const clickCancel = async () => {
    if (!selectedWallet) return;
    const signingClient = await getKeplrSigningCosmWasmClient(networkId);
    const network = mustGetCosmosNetwork(networkId);
    const client = new TeritoriEscrowClient(
      signingClient,
      selectedWallet?.address!,
      network.freelanceEscrowAddress!
    );

    const escrowRes = await client.cancelContract({ id: escrow.id });
    if (escrowRes) {
      navigation.replace("FreelanceServicesEscrow");
    } else {
      console.log("failed");
    }
  };

  const clickComplete = async () => {
    if (!selectedWallet) return;
    const signingClient = await getKeplrSigningCosmWasmClient(networkId);
    const network = mustGetCosmosNetwork(networkId);
    const client = new TeritoriEscrowClient(
      signingClient,
      selectedWallet?.address!,
      network.freelanceEscrowAddress!
    );
    const escrowRes = await client.completeContract({ id: escrow.id });
    if (escrowRes) {
      navigation.replace("FreelanceServicesEscrow");
    } else {
      console.log("failed");
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        minHeight: layout.contentPadding,
        paddingHorizontal: layout.spacing_x2_5,
        borderColor: mineShaftColor,
        borderTopWidth: 1,
        paddingVertical: layout.spacing_x2,
      }}
    >
      <BrandText
        style={[
          fontSemibold13,
          { flex: TABLE_ROWS.sender.flex, paddingRight: layout.spacing_x1 },
        ]}
      >
        {tinyAddress(escrow.sender, 20)}
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: TABLE_ROWS.receiver.flex,
          paddingRight: layout.spacing_x1,
        }}
      >
        <SpacerRow size={1} />
        <BrandText style={fontSemibold13}>
          {tinyAddress(escrow.receiver, 20)}
        </BrandText>
      </View>
      <BrandText
        style={[
          fontSemibold13,
          {
            flex: TABLE_ROWS.amount.flex,
            paddingRight: layout.spacing_x1,
          },
        ]}
      >
        {escrow.amount} tori
      </BrandText>
      <BrandText
        style={[
          fontSemibold13,
          {
            flex: TABLE_ROWS.expireAt.flex,
            paddingRight: layout.spacing_x1,
          },
        ]}
      >
        {getExpireAt(escrow.expireAt + "", escrow.expireAt)}
      </BrandText>
      <BrandText
        style={[
          fontSemibold13,
          {
            flex: TABLE_ROWS.status.flex,
            paddingRight: layout.spacing_x1,
          },
        ]}
      >
        {getStringStatus[escrow.status]}
      </BrandText>
      <View
        style={{
          flex: TABLE_ROWS.action.flex,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isShowAccept && (
          <SecondaryButtonOutline
            onPress={() => clickAccept()}
            text="Accept"
            size="XS"
            style={{ marginVertical: 5 }}
          />
        )}
        {isShowPause && (
          <SecondaryButtonOutline
            onPress={() => clickPause()}
            text="Pause"
            size="XS"
            style={{ marginVertical: 5 }}
          />
        )}
        {isShowResume && (
          <SecondaryButtonOutline
            onPress={() => clickResume()}
            text="Resume"
            size="XS"
            style={{ marginVertical: 5 }}
          />
        )}
        {isShowCancel && (
          <SecondaryButtonOutline
            onPress={() => clickCancel()}
            text="Cancel"
            size="XS"
            style={{ marginVertical: 5 }}
          />
        )}
        {isShowComplete && (
          <SecondaryButtonOutline
            onPress={() => clickComplete()}
            text="Complete"
            size="XS"
            style={{ marginVertical: 5 }}
          />
        )}
      </View>
    </View>
  );
};
