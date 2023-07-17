import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee, coins } from "@cosmjs/amino";
import { Extension } from "./TeritoriOrder.types";

export class TeritoriOrderClient {
    client: SigningCosmWasmClient;
    sender: string;
    contractAddress: string;

    constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string){
        this.client = client;
        this.sender = sender;
        this.contractAddress = contractAddress;
        this.createContract = this.createContract.bind(this);
        this.createContractCw20 = this.createContractCw20.bind(this);
        this.cancelContract = this.cancelContract.bind(this);
        this.acceptContract = this.acceptContract.bind(this);
        this.completeContract = this.completeContract.bind(this);
        this.pauseContract = this.pauseContract.bind(this);
        this.mintFeedback = this.mintFeedback.bind(this);
    }
    createContract = async({ amount, receiver, expireAt }: { amount: string, receiver: string, expireAt: number},
        fee: number | StdFee | "auto" = "auto",
        memo?: string,
    ):Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            create_contract:{
                receiver,
                expire_at: expireAt
            }
        }, fee, memo, coins(amount, process.env.PUBLIC_STAKING_DENOM!));
    }
    createContractCw20 = async({ cw20Addr, amount, receiver, expireAt }: {cw20Addr: string, amount: string, receiver: string, expireAt: number},
        fee: number | StdFee | "auto" = "auto",
        memo?: string,
        funds?: Coin[]
    ):Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, cw20Addr, {
            send: {
                msg:
                    Buffer.from(JSON.stringify(
                        {
                        create_contract:{
                            receiver,
                            expire_at: expireAt
                        }
                    })).toString("base64"),
                amount,
                contract: this.contractAddress
            }
        }, fee, memo, funds);
    }

    cancelContract = async({ id }: { id: number},
        fee: number | StdFee | "auto" = "auto",
        memo?: string,
        funds?: Coin[]
    ): Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            cancel_contract: {
                id
            }
        }, fee, memo, funds);
    }

    acceptContract = async({ id }: { id: number},
        fee: number | StdFee | "auto" = "auto",
        memo?: string,
        funds?: Coin[]
    ): Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            accept_contract: {
                id
            }
        }, fee, memo, funds);
    }

    completeContract = async({ id }: { id: number},
        fee: number | StdFee | "auto" = "auto",
        memo?: string,
        funds?: Coin[]
    ): Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            complete_contract: {
                id
            }
        }, fee, memo, funds);
    }

    pauseContract = async({ id }: { id: number},
        fee: number | StdFee | "auto" = "auto",
        memo?: string,
        funds?: Coin[]
    ): Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            complete_contract: {
                id
            }
        }, fee, memo, funds);
    }

    mintFeedback = async({id, extension, tokenUri}:{id: number, extension?: Extension , tokenUri?: string},
        fee: number | StdFee | "auto" = "auto",
        memo?: string,
        funds?: Coin[]
    ): Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            mint_feedback: {
                id,
                extension,
                token_uri: tokenUri
            }
        }, fee, memo, funds);
    }
}