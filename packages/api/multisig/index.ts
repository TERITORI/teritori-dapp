import { useQuery, UseQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  Long: { input: any; output: any; }
  Time: { input: any; output: any; }
};

export type Multisig = {
  __typename?: 'Multisig';
  _id: Scalars['ID']['output'];
  _ts: Scalars['Long']['output'];
  address: Scalars['String']['output'];
  chainId: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  pubkeyJSON: Scalars['String']['output'];
  userAddresses: Array<Scalars['String']['output']>;
};

export type MultisigInput = {
  address: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  pubkeyJSON: Scalars['String']['input'];
  userAddresses: Array<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createMultisig: Multisig;
  createSignature: Signature;
  createTransaction: Transaction;
  createTransactionsCounts: TransactionsCounts;
  deleteMultisig?: Maybe<Multisig>;
  deleteSignature?: Maybe<Signature>;
  deleteTransaction?: Maybe<Transaction>;
  deleteTransactionsCounts?: Maybe<TransactionsCounts>;
  partialUpdateMultisig?: Maybe<Multisig>;
  partialUpdateSignature?: Maybe<Signature>;
  partialUpdateTransaction?: Maybe<Transaction>;
  partialUpdateTransactionsCounts?: Maybe<TransactionsCounts>;
  updateMultisig?: Maybe<Multisig>;
  updateSignature?: Maybe<Signature>;
  updateTransaction?: Maybe<Transaction>;
  updateTransactionsCounts?: Maybe<TransactionsCounts>;
};


export type MutationCreateMultisigArgs = {
  data: MultisigInput;
};


export type MutationCreateSignatureArgs = {
  data: SignatureInput;
};


export type MutationCreateTransactionArgs = {
  data: TransactionInput;
};


export type MutationCreateTransactionsCountsArgs = {
  data: TransactionsCountsInput;
};


export type MutationDeleteMultisigArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSignatureArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTransactionsCountsArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPartialUpdateMultisigArgs = {
  data: PartialUpdateMultisigInput;
  id: Scalars['ID']['input'];
};


export type MutationPartialUpdateSignatureArgs = {
  data: PartialUpdateSignatureInput;
  id: Scalars['ID']['input'];
};


export type MutationPartialUpdateTransactionArgs = {
  data: PartialUpdateTransactionInput;
  id: Scalars['ID']['input'];
};


export type MutationPartialUpdateTransactionsCountsArgs = {
  data: PartialUpdateTransactionsCountsInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateMultisigArgs = {
  data: MultisigInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateSignatureArgs = {
  data: SignatureInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateTransactionArgs = {
  data: TransactionInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateTransactionsCountsArgs = {
  data: TransactionsCountsInput;
  id: Scalars['ID']['input'];
};

export type PartialUpdateMultisigInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pubkeyJSON?: InputMaybe<Scalars['String']['input']>;
  userAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type PartialUpdateSignatureInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  bodyBytes?: InputMaybe<Scalars['String']['input']>;
  signature?: InputMaybe<Scalars['String']['input']>;
  transaction?: InputMaybe<SignatureTransactionRelation>;
};

export type PartialUpdateTransactionInput = {
  accountNumber?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Time']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  decliners?: InputMaybe<Array<Scalars['String']['input']>>;
  fee?: InputMaybe<Scalars['String']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
  msgs?: InputMaybe<Scalars['String']['input']>;
  multisig?: InputMaybe<TransactionMultisigRelation>;
  sequence?: InputMaybe<Scalars['Int']['input']>;
  signatures?: InputMaybe<Array<Scalars['ID']['input']>>;
  txHash?: InputMaybe<Scalars['String']['input']>;
};

export type PartialUpdateTransactionsCountsInput = {
  executed?: InputMaybe<Scalars['Int']['input']>;
  total?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  findMultisigByID?: Maybe<Multisig>;
  findSignatureByID?: Maybe<Signature>;
  findTransactionByID?: Maybe<Transaction>;
  findTransactionsCountsByID?: Maybe<TransactionsCounts>;
  getMultisig: Multisig;
  getMultisigTransactions: Array<Transaction>;
  getMultisigTransactionsCounts: TransactionsCounts;
  getUserMultisigs: Array<Multisig>;
  getUserTransactions: Array<Transaction>;
};


export type QueryFindMultisigByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFindSignatureByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFindTransactionByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFindTransactionsCountsByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetMultisigArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
};


export type QueryGetMultisigTransactionsArgs = {
  before?: InputMaybe<Scalars['Time']['input']>;
  chainId: Scalars['String']['input'];
  multisigAddress: Scalars['String']['input'];
  size: Scalars['Int']['input'];
};


export type QueryGetMultisigTransactionsCountsArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
};


export type QueryGetUserMultisigsArgs = {
  before?: InputMaybe<Scalars['Time']['input']>;
  chainId: Scalars['String']['input'];
  size: Scalars['Int']['input'];
  userAddress: Scalars['String']['input'];
};


export type QueryGetUserTransactionsArgs = {
  before?: InputMaybe<Scalars['Time']['input']>;
  chainId: Scalars['String']['input'];
  size: Scalars['Int']['input'];
  userAddress: Scalars['String']['input'];
};

export type Signature = {
  __typename?: 'Signature';
  _id: Scalars['ID']['output'];
  _ts: Scalars['Long']['output'];
  address: Scalars['String']['output'];
  bodyBytes: Scalars['String']['output'];
  signature: Scalars['String']['output'];
  transaction: Transaction;
};

export type SignatureInput = {
  address: Scalars['String']['input'];
  bodyBytes: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  transaction?: InputMaybe<SignatureTransactionRelation>;
};

export type SignatureTransactionRelation = {
  connect?: InputMaybe<Scalars['ID']['input']>;
  create?: InputMaybe<TransactionInput>;
};

export type Transaction = {
  __typename?: 'Transaction';
  _id: Scalars['ID']['output'];
  _ts: Scalars['Long']['output'];
  accountNumber?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Time']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  decliners: Array<Scalars['String']['output']>;
  fee?: Maybe<Scalars['String']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  msgs?: Maybe<Scalars['String']['output']>;
  multisig: Multisig;
  sequence?: Maybe<Scalars['Int']['output']>;
  signatures: Array<Signature>;
  txHash?: Maybe<Scalars['String']['output']>;
};

export type TransactionInput = {
  accountNumber?: InputMaybe<Scalars['Int']['input']>;
  createdAt: Scalars['Time']['input'];
  createdBy?: InputMaybe<Scalars['String']['input']>;
  decliners: Array<Scalars['String']['input']>;
  fee?: InputMaybe<Scalars['String']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
  msgs?: InputMaybe<Scalars['String']['input']>;
  multisig?: InputMaybe<TransactionMultisigRelation>;
  sequence?: InputMaybe<Scalars['Int']['input']>;
  signatures: Array<Scalars['ID']['input']>;
  txHash?: InputMaybe<Scalars['String']['input']>;
};

export type TransactionMultisigRelation = {
  connect?: InputMaybe<Scalars['ID']['input']>;
  create?: InputMaybe<MultisigInput>;
};

export type TransactionsCounts = {
  __typename?: 'TransactionsCounts';
  _id: Scalars['ID']['output'];
  _ts: Scalars['Long']['output'];
  executed: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TransactionsCountsInput = {
  executed: Scalars['Int']['input'];
  total: Scalars['Int']['input'];
};

export type GetUserMultisigsQueryVariables = Exact<{
  chainId: Scalars['String']['input'];
  userAddress: Scalars['String']['input'];
  size: Scalars['Int']['input'];
  before?: InputMaybe<Scalars['Time']['input']>;
}>;


export type GetUserMultisigsQuery = { __typename?: 'Query', multisigs: Array<{ __typename?: 'Multisig', _id: string, name?: string | null, address: string, pubkeyJSON: string, chainId: string, userAddresses: Array<string> }> };

export type GetUserTransactionsQueryVariables = Exact<{
  chainId: Scalars['String']['input'];
  userAddress: Scalars['String']['input'];
  size: Scalars['Int']['input'];
  before?: InputMaybe<Scalars['Time']['input']>;
}>;


export type GetUserTransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'Transaction', _id: string, msgs?: string | null, createdAt: any, fee?: string | null, multisig: { __typename?: 'Multisig', chainId: string, address: string } }> };

export type GetMultisigQueryVariables = Exact<{
  chainId: Scalars['String']['input'];
  address: Scalars['String']['input'];
}>;


export type GetMultisigQuery = { __typename?: 'Query', multisig: { __typename?: 'Multisig', _id: string, name?: string | null, address: string, pubkeyJSON: string, chainId: string, userAddresses: Array<string> } };

export type GetMultisigTransactionsQueryVariables = Exact<{
  chainId: Scalars['String']['input'];
  multisigAddress: Scalars['String']['input'];
  size: Scalars['Int']['input'];
  before?: InputMaybe<Scalars['Time']['input']>;
}>;


export type GetMultisigTransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'Transaction', _id: string, msgs?: string | null, createdAt: any, fee?: string | null, multisig: { __typename?: 'Multisig', chainId: string, address: string } }> };

export type GetMultisigTransactionsCountsQueryVariables = Exact<{
  chainId: Scalars['String']['input'];
  address: Scalars['String']['input'];
}>;


export type GetMultisigTransactionsCountsQuery = { __typename?: 'Query', counts: { __typename?: 'TransactionsCounts', total: number, executed: number } };

export type TransactionsCountsFieldsFragment = { __typename?: 'TransactionsCounts', total: number, executed: number };

export type TransactionFieldsFragment = { __typename?: 'Transaction', _id: string, msgs?: string | null, createdAt: any, fee?: string | null, multisig: { __typename?: 'Multisig', chainId: string, address: string } };

export type MultisigFieldsFragment = { __typename?: 'Multisig', _id: string, name?: string | null, address: string, pubkeyJSON: string, chainId: string, userAddresses: Array<string> };

export const TransactionsCountsFieldsFragmentDoc = `
    fragment TransactionsCountsFields on TransactionsCounts {
  total
  executed
}
    `;
export const TransactionFieldsFragmentDoc = `
    fragment TransactionFields on Transaction {
  _id
  msgs
  createdAt
  fee
  multisig {
    chainId
    address
  }
}
    `;
export const MultisigFieldsFragmentDoc = `
    fragment MultisigFields on Multisig {
  _id
  name
  address
  pubkeyJSON
  chainId
  userAddresses
}
    `;
export const GetUserMultisigsDocument = `
    query getUserMultisigs($chainId: String!, $userAddress: String!, $size: Int!, $before: Time) {
  multisigs: getUserMultisigs(
    chainId: $chainId
    userAddress: $userAddress
    size: $size
    before: $before
  ) {
    ...MultisigFields
  }
}
    ${MultisigFieldsFragmentDoc}`;
export const useGetUserMultisigsQuery = <
      TData = GetUserMultisigsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetUserMultisigsQueryVariables,
      options?: UseQueryOptions<GetUserMultisigsQuery, TError, TData>
    ) =>
    useQuery<GetUserMultisigsQuery, TError, TData>(
      ['getUserMultisigs', variables],
      fetcher<GetUserMultisigsQuery, GetUserMultisigsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetUserMultisigsDocument, variables),
      options
    );
useGetUserMultisigsQuery.document = GetUserMultisigsDocument;


useGetUserMultisigsQuery.getKey = (variables: GetUserMultisigsQueryVariables) => ['getUserMultisigs', variables];
;

useGetUserMultisigsQuery.fetcher = (dataSource: { endpoint: string, fetchParams?: RequestInit }, variables: GetUserMultisigsQueryVariables) => fetcher<GetUserMultisigsQuery, GetUserMultisigsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetUserMultisigsDocument, variables);
export const GetUserTransactionsDocument = `
    query getUserTransactions($chainId: String!, $userAddress: String!, $size: Int!, $before: Time) {
  transactions: getUserTransactions(
    chainId: $chainId
    userAddress: $userAddress
    size: $size
    before: $before
  ) {
    ...TransactionFields
  }
}
    ${TransactionFieldsFragmentDoc}`;
export const useGetUserTransactionsQuery = <
      TData = GetUserTransactionsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetUserTransactionsQueryVariables,
      options?: UseQueryOptions<GetUserTransactionsQuery, TError, TData>
    ) =>
    useQuery<GetUserTransactionsQuery, TError, TData>(
      ['getUserTransactions', variables],
      fetcher<GetUserTransactionsQuery, GetUserTransactionsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetUserTransactionsDocument, variables),
      options
    );
useGetUserTransactionsQuery.document = GetUserTransactionsDocument;


useGetUserTransactionsQuery.getKey = (variables: GetUserTransactionsQueryVariables) => ['getUserTransactions', variables];
;

useGetUserTransactionsQuery.fetcher = (dataSource: { endpoint: string, fetchParams?: RequestInit }, variables: GetUserTransactionsQueryVariables) => fetcher<GetUserTransactionsQuery, GetUserTransactionsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetUserTransactionsDocument, variables);
export const GetMultisigDocument = `
    query getMultisig($chainId: String!, $address: String!) {
  multisig: getMultisig(chainId: $chainId, address: $address) {
    ...MultisigFields
  }
}
    ${MultisigFieldsFragmentDoc}`;
export const useGetMultisigQuery = <
      TData = GetMultisigQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetMultisigQueryVariables,
      options?: UseQueryOptions<GetMultisigQuery, TError, TData>
    ) =>
    useQuery<GetMultisigQuery, TError, TData>(
      ['getMultisig', variables],
      fetcher<GetMultisigQuery, GetMultisigQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetMultisigDocument, variables),
      options
    );
useGetMultisigQuery.document = GetMultisigDocument;


useGetMultisigQuery.getKey = (variables: GetMultisigQueryVariables) => ['getMultisig', variables];
;

useGetMultisigQuery.fetcher = (dataSource: { endpoint: string, fetchParams?: RequestInit }, variables: GetMultisigQueryVariables) => fetcher<GetMultisigQuery, GetMultisigQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetMultisigDocument, variables);
export const GetMultisigTransactionsDocument = `
    query getMultisigTransactions($chainId: String!, $multisigAddress: String!, $size: Int!, $before: Time) {
  transactions: getMultisigTransactions(
    chainId: $chainId
    multisigAddress: $multisigAddress
    size: $size
    before: $before
  ) {
    ...TransactionFields
  }
}
    ${TransactionFieldsFragmentDoc}`;
export const useGetMultisigTransactionsQuery = <
      TData = GetMultisigTransactionsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetMultisigTransactionsQueryVariables,
      options?: UseQueryOptions<GetMultisigTransactionsQuery, TError, TData>
    ) =>
    useQuery<GetMultisigTransactionsQuery, TError, TData>(
      ['getMultisigTransactions', variables],
      fetcher<GetMultisigTransactionsQuery, GetMultisigTransactionsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetMultisigTransactionsDocument, variables),
      options
    );
useGetMultisigTransactionsQuery.document = GetMultisigTransactionsDocument;


useGetMultisigTransactionsQuery.getKey = (variables: GetMultisigTransactionsQueryVariables) => ['getMultisigTransactions', variables];
;

useGetMultisigTransactionsQuery.fetcher = (dataSource: { endpoint: string, fetchParams?: RequestInit }, variables: GetMultisigTransactionsQueryVariables) => fetcher<GetMultisigTransactionsQuery, GetMultisigTransactionsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetMultisigTransactionsDocument, variables);
export const GetMultisigTransactionsCountsDocument = `
    query getMultisigTransactionsCounts($chainId: String!, $address: String!) {
  counts: getMultisigTransactionsCounts(chainId: $chainId, address: $address) {
    ...TransactionsCountsFields
  }
}
    ${TransactionsCountsFieldsFragmentDoc}`;
export const useGetMultisigTransactionsCountsQuery = <
      TData = GetMultisigTransactionsCountsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetMultisigTransactionsCountsQueryVariables,
      options?: UseQueryOptions<GetMultisigTransactionsCountsQuery, TError, TData>
    ) =>
    useQuery<GetMultisigTransactionsCountsQuery, TError, TData>(
      ['getMultisigTransactionsCounts', variables],
      fetcher<GetMultisigTransactionsCountsQuery, GetMultisigTransactionsCountsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetMultisigTransactionsCountsDocument, variables),
      options
    );
useGetMultisigTransactionsCountsQuery.document = GetMultisigTransactionsCountsDocument;


useGetMultisigTransactionsCountsQuery.getKey = (variables: GetMultisigTransactionsCountsQueryVariables) => ['getMultisigTransactionsCounts', variables];
;

useGetMultisigTransactionsCountsQuery.fetcher = (dataSource: { endpoint: string, fetchParams?: RequestInit }, variables: GetMultisigTransactionsCountsQueryVariables) => fetcher<GetMultisigTransactionsCountsQuery, GetMultisigTransactionsCountsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetMultisigTransactionsCountsDocument, variables);