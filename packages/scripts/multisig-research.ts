import {
  Secp256k1HdWallet,
  Secp256k1Pubkey,
  StdFee,
  StdSignDoc,
  createMultisigThresholdPubkey,
} from "@cosmjs/amino";
import {
  MsgSendEncodeObject,
  SigningStargateClient,
  makeMultisignedTxBytes,
} from "@cosmjs/stargate";
import { range } from "lodash";

import { mustGetNodeMultisigClient } from "./lib";

import { cosmosNetworkGasPrice, getStakingCurrency } from "@/networks";
import { cosmosAminoTypes, cosmosTypesRegistry } from "@/networks/cosmos-types";
import { teritoriTestnetNetwork } from "@/networks/teritori-testnet";
import { multisigLogin } from "@/utils/multisig";

const main = async () => {
  // input
  const network = teritoriTestnetNetwork;
  const faucetMnemonic = "FILLME";
  const numWallets = 3;
  const threshold = 3;

  // get test currency
  const currency = getStakingCurrency(network.id);
  if (!currency) {
    throw new Error("currency not found");
  }

  // initialize wallets
  const wallets = await Promise.all(
    range(numWallets).map(async (i) => {
      const w = await Secp256k1HdWallet.generate(12, {
        prefix: network.addressPrefix,
      });
      return w;
    }),
  );
  const accounts = await Promise.all(
    wallets.map(async (w) => {
      const accs = await w.getAccounts();
      return accs[0];
    }),
  );
  const pubkeys = accounts.map((a) => {
    const pk: Secp256k1Pubkey = {
      type: "tendermint/PubKeySecp256k1",
      value: Buffer.from(a.pubkey).toString("base64"),
    };
    return pk;
  });

  // initialize service client
  const multisigClient = mustGetNodeMultisigClient(network.id);
  const usersAuthTokens = await Promise.all(
    wallets.map(async (wallet, i) => {
      const account = accounts[i];
      const pubkey = account.pubkey;
      const address = account.address;
      return multisigLogin(
        network,
        multisigClient,
        pubkey,
        async (infoJSON) => {
          const msgValue = {
            data: Buffer.from(infoJSON, "utf-8").toString("base64"),
            signer: address,
          };
          const signDoc: StdSignDoc = {
            account_number: "0",
            chain_id: "",
            fee: {
              amount: [],
              gas: "0",
            },
            memo: "",
            msgs: [
              {
                type: "sign/MsgSignData",
                value: msgValue,
              },
            ],
            sequence: "0",
          };
          const res = await wallet.signAmino(address, signDoc);
          return res.signature;
        },
      );
    }),
  );
  const creatorAuthToken = usersAuthTokens[0];

  // create multisig
  const multisigPubkey = createMultisigThresholdPubkey(pubkeys, threshold);
  const { multisigAddress } = await multisigClient.CreateOrJoinMultisig({
    name: "testing",
    chainId: network.chainId,
    multisigPubkeyJson: JSON.stringify(multisigPubkey),
    bech32Prefix: network.addressPrefix,
    authToken: creatorAuthToken,
  });

  // initialize faucet wallet
  const faucetWallet = await Secp256k1HdWallet.fromMnemonic(faucetMnemonic, {
    prefix: network.addressPrefix,
  });
  const faucetAccount = (await faucetWallet.getAccounts())[0];
  const faucetAddress = faucetAccount.address;

  // compute permutations
  const perms = permutationsNoRepeat(range(numWallets));
  console.log(perms.length, "permutations");

  // send funds to multisig
  const stargateClient = await SigningStargateClient.connectWithSigner(
    network.rpcEndpoint,
    faucetWallet,
    { gasPrice: cosmosNetworkGasPrice(network, "low") },
  );
  await stargateClient.sendTokens(
    faucetAddress,
    multisigAddress,
    [{ amount: perms.length.toString(), denom: currency.denom }],
    "auto",
  );

  for (const perm of perms) {
    console.log(perm.map((i) => accounts[i].address).join(", "));

    // get multisig account number
    const multisigAccount = await stargateClient.getAccount(multisigAddress);
    if (!multisigAccount) {
      throw new Error("multisig account not found");
    }

    // create send tx
    const sendMsg: MsgSendEncodeObject = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: multisigAddress,
        toAddress: faucetAddress,
        amount: [{ amount: "1", denom: currency.denom }],
      },
    };
    const fee: StdFee = {
      amount: [{ amount: "0", denom: currency.denom }],
      gas: "200000",
    };
    await multisigClient.CreateTransaction({
      multisigAddress,
      authToken: creatorAuthToken,
      accountNumber: multisigAccount.accountNumber,
      sequence: multisigAccount.sequence,
      msgs: [cosmosTypesRegistry.encodeAsAny(sendMsg)],
      feeJson: JSON.stringify(fee),
      chainId: network.chainId,
    });

    // sign tx
    for (const i of perm) {
      const wallet = wallets[i];
      const account = accounts[i];
      const authToken = usersAuthTokens[i];
      // start: hack to get tx
      const { transactions } = await multisigClient.Transactions({
        authToken,
        multisigAddress,
        limit: 1,
      });
      if (!transactions.length) {
        throw new Error("tx not found");
      }
      // end: hack to get tx
      const tx = transactions[0];
      const sd: StdSignDoc = {
        chain_id: tx.chainId,
        account_number: tx.accountNumber.toString(),
        sequence: tx.sequence.toString(),
        // eslint-disable-next-line no-restricted-syntax
        fee: JSON.parse(tx.feeJson),
        msgs: tx.msgs.map((m) => {
          const directMsg = cosmosTypesRegistry.decode(m);
          return cosmosAminoTypes.toAmino({
            typeUrl: m.typeUrl,
            value: directMsg,
          });
        }),
        memo: "",
      };
      const {
        signature: { signature },
      } = await wallet.signAmino(account.address, sd);
      await multisigClient.SignTransaction({
        transactionId: tx.id,
        authToken,
        signature,
        bodyBytes: cosmosTypesRegistry.encodeTxBody({
          messages: tx.msgs.map((m) => {
            const directMsg = cosmosTypesRegistry.decode(m);
            return {
              typeUrl: m.typeUrl,
              value: directMsg,
            };
          }),
        }),
      });
    }

    // broadcast tx
    // start: hack to get tx
    const { transactions: finalTxs } = await multisigClient.Transactions({
      authToken: creatorAuthToken,
      multisigAddress,
      limit: 1,
    });
    if (!finalTxs.length) {
      throw new Error("tx not found");
    }
    const tx = finalTxs[0];
    // end: hack to get tx
    const signedTx = makeMultisignedTxBytes(
      // eslint-disable-next-line no-restricted-syntax
      JSON.parse(tx.multisigPubkeyJson),
      tx.sequence,
      // eslint-disable-next-line no-restricted-syntax
      JSON.parse(tx.feeJson),
      tx.signatures[0].bodyBytes,
      new Map(
        tx.signatures.map((s) => [
          s.userAddress,
          Buffer.from(s.value, "base64"),
        ]),
      ),
    );

    const res = await stargateClient.broadcastTx(signedTx);
    if (res.code !== 0) {
      console.error(res);
      process.exit(1);
    }

    console.log(res.transactionHash);
  }
};

function permutationsNoRepeat<T>(array: T[]): T[][] {
  if (array.length === 0) {
    return [[]];
  }
  const result: T[][] = [];
  for (let i = 0; i < array.length; i++) {
    const rest = array.slice(0, i).concat(array.slice(i + 1));
    const restPermutations = permutationsNoRepeat(rest);
    for (const restPermutation of restPermutations) {
      result.push([array[i], ...restPermutation]);
    }
  }
  return result;
}

main();
