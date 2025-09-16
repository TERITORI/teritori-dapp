import { parseCoins } from "@cosmjs/amino";
import { Decimal } from "@cosmjs/math";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgCall } from "@gnolang/gno-js-client";
import { Fragment, useCallback, useState } from "react";
import { View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn } from "@/components/spacer";
import { useGnoFunctionsSignatures } from "@/hooks/gno/useGnoFunctionsSignatures";
import { useRunOrProposeTransaction } from "@/hooks/useRunOrProposeTransaction";
import { getStakingCurrency, parseUserId, UserKind } from "@/networks";
import { fontMedium15 } from "@/utils/style/fonts";
import { modalMarginPadding } from "@/utils/style/modals";
import { capitalize } from "@/utils/text";

interface GnoCallModalButtonProps {
  userId: string | undefined;
  userKind: UserKind;
}

export const GnoCallModalButton: React.FC<GnoCallModalButtonProps> = ({
  userId,
  userKind,
}) => {
  const [isVisible, setVisible] = useState(false);
  return (
    <>
      <PrimaryButton
        size="M"
        text="Call Realm"
        fullWidth
        onPress={() => setVisible(true)}
      />
      {!!userId && !!isVisible && (
        <GnoCallModal
          userId={userId}
          userKind={userKind}
          isVisible={isVisible}
          onClose={() => setVisible(false)}
        />
      )}
    </>
  );
};

interface GnoCallModalProps {
  userId: string;
  userKind: UserKind;
  isVisible: boolean;
  onClose: () => void;
}

const GnoCallModal = ({
  userId,
  userKind,
  isVisible,
  onClose,
}: GnoCallModalProps) => {
  const [txLinkText, setTxLinkText] = useState("");
  const [fn, setFn] = useState("");
  const [pkgPath, setPkgPath] = useState("");
  const [memo, setMemo] = useState("");
  const [args, setArgs] = useState<Record<string, string>>({});
  const [send, setSend] = useState("");

  const [network, userAddress] = parseUserId(userId);
  const networkId = network?.id;

  const currency = getStakingCurrency(networkId);

  const runOrProposeTransation = useRunOrProposeTransaction(userId, userKind);

  const { data: fnSigs } = useGnoFunctionsSignatures(networkId, pkgPath);

  const fnSig = fnSigs?.find((sig) => sig.FuncName === fn);

  const ModalHeader = useCallback(
    () => (
      <View style={headerStyle}>
        <BrandText>Call Realm</BrandText>
      </View>
    ),
    [],
  );
  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      Header={ModalHeader}
      width={456}
      boxStyle={{ paddingBottom: modalMarginPadding }}
    >
      <TextInputCustom
        name="txlink"
        label="Import from Txlink (optional)"
        onChangeText={(text) => {
          setTxLinkText(text);

          const u = URL.parse(text);
          const [pkgSubPath, ...restArr] = u?.pathname.split("$") || "";

          if (pkgSubPath) {
            setPkgPath("gno.land" + pkgSubPath);
          }

          const rest = restArr.join("$");
          const u2 = URL.parse("https://example.com/?" + rest.substring(5));
          if (!u2) {
            return;
          }

          const fnParam = u2.searchParams.get("func");
          if (fnParam !== null) {
            setFn(fnParam);
          }

          const sendParam = u2.searchParams.get(".send");
          if (sendParam !== null && currency) {
            const coin = parseCoins(sendParam);
            // XXX: handle 0 or more than 1 coins
            const userAmount = Decimal.fromAtomics(
              coin[0].amount,
              currency?.decimals,
            );
            setSend(userAmount.toString());
          }

          // XXX: can import memo?

          const keys = [
            ...u2.searchParams
              .keys()
              .filter((k) => k !== "func" && k !== ".send"),
          ];

          const newArgs: Record<string, string> = {};
          for (const k of keys) {
            const val = u2.searchParams.get(k);
            if (val === null) {
              continue;
            }
            newArgs[k] = val;
          }

          setArgs((args) => ({ ...args, ...newArgs }));
        }}
        value={txLinkText}
      />

      <SpacerColumn size={1} />
      <TextInputCustom
        name="pkgPath"
        label="Package path"
        value={pkgPath}
        onChangeText={setPkgPath}
      />

      <SpacerColumn size={1} />
      <TextInputCustom
        name="fn"
        label="Function"
        value={fn}
        onChangeText={setFn}
      />

      <SpacerColumn size={1} />
      <TextInputCustom
        height={48}
        label="Send amount"
        name="amount"
        value={send}
        onChangeText={setSend}
        placeHolder="0"
        defaultValue=""
      >
        <BrandText style={fontMedium15}>{currency?.displayName}</BrandText>
      </TextInputCustom>

      {fnSig?.Params.map((arg, idx) => {
        if (idx === 0) {
          // skip `cur realm`
          return null;
        }

        return (
          <Fragment key={idx}>
            <SpacerColumn size={1} />
            <TextInputCustom
              name={`args.${arg.Name}`}
              label={capitalize(arg.Name)}
              value={args[arg.Name]}
              onChangeText={(value) =>
                setArgs((args) => ({ ...args, [arg.Name]: value }))
              }
            />
          </Fragment>
        );
      })}

      <SpacerColumn size={1} />
      <TextInputCustom
        name="memo"
        label="Memo"
        value={memo}
        onChangeText={setMemo}
      />

      <SpacerColumn size={1} />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View />
        <PrimaryButton
          text="Propose"
          loader
          disabled={!currency || !fnSig}
          onPress={async () => {
            if (!currency || !fnSig) {
              return;
            }
            const sendCoin =
              Decimal.fromUserInput(send, currency?.decimals).atomics +
              currency.denom;
            const msgCall: MsgCall = {
              caller: userAddress,
              send: sendCoin,
              pkg_path: pkgPath,
              func: fn,
              args: fnSig.Params.slice(1).map((param) => args[param.Name]),
              max_deposit: "",
            };
            console.log("msgCall", msgCall);
            const msg: EncodeObject = {
              typeUrl: "/vm.m_call",
              value: msgCall,
            };
            await runOrProposeTransation({
              msgs: [msg],
              memo,
            });
            onClose();
          }}
        />
      </View>
    </ModalBase>
  );
};

const headerStyle: ViewStyle = {
  display: "flex",
  alignItems: "center",
  width: "auto",
};
