import axios from "axios";

import { MultisigTransactionType } from "../../../screens/Multisig/types";
import { DbAccount, DbSignature } from "./types";

// Graphql base request for Faunadb
const graphqlReq = axios.create({
  baseURL: "https://graphql.fauna.com/graphql",
  headers: {
    Authorization: `Bearer ${process.env.FAUNADB_SECRET}`,
  },
});

/**
 * Creates multisig record in faunadb
 *
 * @param {object} multisig an object with address (string), pubkey JSON and chainId
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const createOrFindMultisig = async (multisig: DbAccount) => {
  return graphqlReq({
    method: "POST",
    data: {
      query: `
        mutation {
          createOrFindMultisig(
            address: "${multisig.address}",
            pubkeyJSON: ${JSON.stringify(multisig.pubkeyJSON)},
            chainId: "${multisig.chainId}",
            userAddresses: ${JSON.stringify(multisig.userAddresses)},
          ) {
            _id
            address
            chainId
          }
        }
      `,
    },
  });
};

/**
 * Gets multisig pubkey from faundb
 *
 * @param {string} address A multisig address.
 * @param {string} chainId The chainId the multisig belongs to.
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const getMultisig = async (address: string, chainId: string) => {
  return graphqlReq({
    method: "POST",
    data: {
      query: `
        query {
          getMultisig(address: "${address}", chainId: "${chainId}",) {
            _id
            address
            pubkeyJSON
            chainId
          }
        }
      `,
    },
  });
};

/**
 * Creates transaction record in faunadb
 *
 * @param {object} transaction The base transaction
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const createTransaction = async (
  transaction: string,
  multisigId: string,
  type: MultisigTransactionType
) => {
  return graphqlReq({
    method: "POST",
    data: {
      query: `
        mutation {
          createTransaction(data: {
            dataJSON: ${JSON.stringify(transaction)},
            multisig: {connect: ${multisigId}}, 
            type: "${type}"
          }) {
            _id
          }
        }
      `,
    },
  });
};

/**
 * Retrieves a transaction from faunadb
 *
 * @param {string} id Faunadb resource id
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const findTransactionByID = async (id: string) => {
  return graphqlReq({
    method: "POST",
    data: {
      query: `
        query {
          findTransactionByID(id: "${id}") {
            _id
            dataJSON
            txHash
            signatures {
              data {
                address
                signature
                bodyBytes
              }
            }
          }
        }
      `,
    },
  });
};

/**
 * Retrieves all transaction from faunadb
 *
 * @param {string} multisigId Faunadb resource txHash
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const transactionsByMultisigId = async (multisigId: string, type: string) => {
  return graphqlReq({
    method: "POST",
    data: {
      query: `
        query {
          transactionsByMultisigId(
            id: "${multisigId}"
            type: "${type}"
          ) {
            data {
              _id
              dataJSON
              txHash
              type
              signatures {
                data {
                  address
                  signature
                  bodyBytes
                }
              }
            }
            after
          }
        }
      `,
    },
  });
};

/**
 * Retrieves all transaction from faunadb
 *
 * @param {string} multisigId Faunadb resource txHash
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const multisigsByUserAddress = async (userAddress: string) => {
  return graphqlReq({
    method: "POST",
    data: {
      query: `
      query {
        multisigByUserAddress(address: "${userAddress}") {
          _id
          address
          userAddresses
          chainId
        }
      }
      `,
    },
  });
};
/**
 * Updates txHash of transaction on FaunaDB
 *
 * @param {string} id Faunadb resource id
 * @param {string} txHash tx hash returned from broadcasting a tx
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const updateTxHash = async (id: string, txHash: string) => {
  return graphqlReq({
    method: "POST",
    data: {
      query: `
        mutation {
          updateTransaction(id: ${id}, data: {txHash: "${txHash}"}) {
            _id
            dataJSON
            txHash
            signatures {
              data {
                address
                signature
                bodyBytes
              }
            }
          }
        }
      `,
    },
  });
};

/**
 * Creates signature record in faunadb
 *
 * @param {object} signature an object with bodyBytes (string) and signature set (Uint8 Array)
 * @param {string} transactionId id of the transaction to relate the signature with
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const createSignature = async (
  signature: DbSignature,
  transactionId: string
) => {
  return graphqlReq({
    method: "POST",
    data: {
      query: `
        mutation {
          createSignature(data: {
            transaction: {connect: ${transactionId}}, 
            bodyBytes: "${signature.bodyBytes}",
            signature: "${signature.signature}",
            address: "${signature.address}" 
          }) {
            _id
            address
            signature
            address
          }
        }
      `,
    },
  });
};

export {
  createOrFindMultisig,
  getMultisig,
  createTransaction,
  findTransactionByID,
  updateTxHash,
  createSignature,
  transactionsByMultisigId,
  multisigsByUserAddress,
};
