import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
export class TeritoriSellerQueryClient {
    client: CosmWasmClient;
    contractAddress: string;
    constructor (client: CosmWasmClient, contractAddress: string) {
        this.client = client;
        this.contractAddress = contractAddress;
        this.getSellerProfile = this.getSellerProfile.bind(this);
    }

    getSellerProfile = async(seller: string): Promise<string> =>{
        const res = await this.client.queryContractSmart(this.contractAddress, {
            seller_profile: {
                seller
            }
        });
        return res.ipfs_hash;
    }
}

export class TeritoriSellerClient extends TeritoriSellerQueryClient{
    client: SigningCosmWasmClient;
    sender: string;
    contractAddress: string;
    constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string){
        super(client, contractAddress);
        this.client = client;
        this.sender = sender;
        this.contractAddress = contractAddress;
        this.addGig = this.addGig.bind(this);
        this.updateSellerProfile = this.updateSellerProfile.bind(this);
    }

    addGig = async({ seller, gigInfo }: { seller: string, gigInfo: string}):Promise<ExecuteResult> => {
        return await this.client.execute( this.sender, this.contractAddress, {
            add_gig:{
                seller,
                gig_info: gigInfo
            }
        }, "auto");
    }

    updateSellerProfile = async({seller, ipfsHash}: {seller: string, ipfsHash: string}): Promise<ExecuteResult> => {
        return await this.client.execute(this.sender, this.contractAddress, {
            update_seller_profile : {
                seller,
                ipfs_hash: ipfsHash
            }
        }, "auto");
    }
}