import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";

export interface TeritoriDaoProposalBaseReadOnlyInterface {
  contractAddress: string;  
}
export class TeritoriDaoProposalBaseQueryClient implements TeritoriDaoProposalBaseReadOnlyInterface {
	client: CosmWasmClient;
  	contractAddress: string;
	constructor(client: CosmWasmClient, contractAddress: string) {
   	 	this.client = client;
    	this.contractAddress = contractAddress;   
  }
}

export interface TeritoriDaoProposalBaseInterface extends TeritoriDaoProposalBaseReadOnlyInterface{	
  contractAddress: string;
  sender: string;
  createProposal:({
    title,
    description,
    msgs
  }:{
    title: string;
    description: string;
    msgs: object[];
  },  fee?: number | StdFee | "auto", memo?: string, funds?: Coin[])=>Promise<ExecuteResult>;
}

export class TeritoriDaoProposalBaseClient extends TeritoriDaoProposalBaseQueryClient implements TeritoriDaoProposalBaseInterface {
	client: SigningCosmWasmClient;
	sender: string;
  	contractAddress: string;
	constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
		super(client, contractAddress);
   	 	this.client = client;
   	 	this.sender = sender;
    	this.contractAddress = contractAddress;   
    	this.createProposal = this.createProposal.bind(this);
  	}
  	createProposal = async ({
    	title,
    	description,
      msgs
  	}: {
    	title: string;
    	description: string;
      msgs: object[];
  	}, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]):Promise<ExecuteResult> =>{
    	return await this.client.execute( this.sender, this.contractAddress, {
    		propose:{
  				msg: {
            propose: {
              title,
              description,
              msgs: msgs,
            }  					
  				}
  			}}, fee, memo, funds);
  	}
}
