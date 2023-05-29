import { SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
export class TeritoriEscrowClient {
    client: SigningCosmWasmClient;
    sender: string;
    contractAddress: string;
    constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string){
        this.client = client;
        this.sender = sender;
        this.contractAddress = contractAddress;
        this.acceptContract = this.acceptContract.bind(this);
        this.pauseContract = this.pauseContract.bind(this);
        this.resumeContract = this.resumeContract.bind(this);
        this.cancelContract = this.cancelContract.bind(this);
        this.completeContract= this.completeContract.bind(this);
    }
    acceptContract = async({ id }: { id: number}):Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            accept_contract:{
                id
            }
        }, "auto");
    }

    pauseContract = async({ id }: { id: number}):Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            pause_contract:{
                id
            }
        }, "auto");
    }

    resumeContract = async({ id, increasedExpiredAt }: { id: number, increasedExpiredAt: number}):Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            resume_contract:{
                id,
                increased_expire_at: increasedExpiredAt,
            }
        }, "auto");
    }

    cancelContract = async({ id }: { id: number}):Promise<ExecuteResult> =>{
        return await this.client.execute( this.sender, this.contractAddress, {
            cancel_contract:{
                id,
            }
        }, "auto");
    }

    completeContract = async({ id }: { id: number}):Promise<ExecuteResult> =>{
        return await this.client.execute( this.sender, this.contractAddress, {
            complete_contract:{
                id,
            }
        }, "auto");
    }
}