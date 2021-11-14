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
}
