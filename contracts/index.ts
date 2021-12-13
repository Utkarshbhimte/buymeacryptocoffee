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
