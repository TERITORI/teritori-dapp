export interface ProposalExpiration{
	at_time: string
}
export interface ProposalVotes{
	yes: string;
	no: string;
	abstain: string;
}
export interface ProposalThresholdQuorum{
	threshold: Majority | Percent,
	quorum: Percent
}
export interface Majority{
	majority: object
}
export interface Percent{
	percent: string
}

export interface ProposalThreshold {
	threshold_quorum: ProposalThresholdQuorum;
}
export interface ProposalDataInfo{
	title: string;
	description: string;
	proposer: string;
	start_height: number;
	threshold: ProposalThreshold;
	total_power: string;
	status: string;
	votes: ProposalVotes;
	allow_revoting: boolean;
	expiration: ProposalExpiration;
	msgs: object[];
}

export interface ProposalData{
	proposals: ProposalInfo[]
}
export interface ProposalInfo {
	id: number;
	proposal: ProposalDataInfo	
}