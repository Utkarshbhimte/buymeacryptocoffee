import { User } from "../contracts";
import { db, firestoreCollections } from "./firebaseClient";

export const getOrCreateUser = async (address: string): Promise<User> => {
	// create new user in firesbase if not exists
	const response = await db
		.doc(`${firestoreCollections.USERS}/${address}`)
		.get();

	if (response.exists) {
		return response.data() as User;
	}

	const newUser = {
		...new User(),
		address,
	};

	await db.doc(`${firestoreCollections.USERS}/${address}`).set(newUser);

	return newUser;
};
