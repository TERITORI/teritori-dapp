export interface DaoCoreConfig {
	name: string;
	description: string;
	image_url: string;
	automatically_add_cw20s: boolean;
	dao_uri: string;
}
export interface ProposalModule {
	address: string;
	prefix: string;
	status: string;
}

export interface DaoAddr {
	addr: string;
}
export interface ModuleAddr {
	module: DaoAddr
}

export interface TokenHolder {
	address: string;
	amount: string;
}
export interface DaoMember{
	addr: string;
	weight: number;
}