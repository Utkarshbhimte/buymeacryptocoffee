import { Transaction, Social, User } from "../contracts";
import { db, firestoreCollections } from "./firebaseClient";

export const getOrCreateUser = async (address: string): Promise<User> => {
	// create new user in firesbase if not exists
	const response = await db
		.doc(`${firestoreCollections.USERS}/${address}`)
		.get();

	if (response.exists) {
		console.log("got the user sending it");
		return response.data() as User;
	}

	console.log("Didn\t get the user, creating one");

	const newUser: User = {
		...new User(),
		id: address,
		name: "Unnamed",
		social: {
			...new Social(),
		},
	};

	console.log("creating user 000,", newUser);

	await db.doc(`${firestoreCollections.USERS}/${address}`).set(newUser);

	return newUser;
};

export const getUser = async (address: string): Promise<User> => {
	const response = await db
		.doc(`${firestoreCollections.USERS}/${address}`)
		.get();

	if (response.exists) {
		return response.data() as User;
	}

	return null;
};

export const saveTransaction = async (
	transaction: Transaction
): Promise<void> => {
	await db
		.doc(`${firestoreCollections.TRANSACTIONS}/${transaction.id}`)
		.set(transaction);
};

export const minimizeAddress = (address?: string): string => {
	if(!address) return "";
	return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}
