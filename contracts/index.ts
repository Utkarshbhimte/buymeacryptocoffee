export interface Social {
	twitter: string;
	instagram: string;
	website: string;
}

export class User {
	profileImage: string;
	coverImage: string;
	address: string = "";
	name: string = "";
	description: string = "";
	social: Social | null = null;
}
