export class Social {
	twitter: string = "";
	instagram: string = "";
	website: string = "";
}

export class User {
	profileImage: string = "";
	coverImage: string = "";
	id: string = "";
	name: string = "";
	description: string = "";
	social: Social = new Social();
	address: string = "";
	ens: string | null = null;
}

export class Transaction {
	from: string = "";
	fromEns: string | null = null;
	to: string = "";
	amount: number = 0;
	timestamp: number = new Date().getTime();
	id: string = "";
	message: string = "";
	cronStatus: "pending" | "success" = "pending";
	status: "success" | "failure" | "" = "";
	chain: string = "";
	formattedAmount: string = "";
	tokenDecimals: number = 0;
	senderAvatar?: string = null;
}

export interface SolanaAccountDetails {
	account: string;
	lamports: number;
	ownerProgram: string;
	rentEpoch: number;
	typos: string;
}

export interface SolanaTokenAmount {
	decimals: number;
	amount: string;
	uiAmount: string;
	uiAmountString: string;
}

export interface SolanaTokenData {
	tokenAccount: string;
	tokenAddress: string;
	tokenIcon: string;
	tokenName: string;
	tokenSymbol: string;
	tokenAmount: SolanaTokenAmount;
}
