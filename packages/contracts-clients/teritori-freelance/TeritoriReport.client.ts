import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee, coins } from "@cosmjs/amino";
export class TeritoriReportClient {
    client: SigningCosmWasmClient;
    sender: string;
    contractAddress: string;
    constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string){
        this.client = client;
        this.sender = sender;
        this.contractAddress = contractAddress;
        this.sellerReportContract = this.sellerReportContract.bind(this);
    }
    sellerReportContract = async({ seller, optionIndex, description, refUrl }: { seller: string, optionIndex: number, description: string, refUrl: string},
        fee: number | StdFee | "auto" = "auto",
        memo?: string,
        funds?: Coin[]
    ):Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            seller_report:{
                seller,
                report_data: JSON.stringify({
                    option: optionIndex,
                    desc: description,
                    ref_url: refUrl,
                  }),
            }
        }, fee, memo, funds);
    }
}