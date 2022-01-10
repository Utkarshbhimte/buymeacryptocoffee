import { Social, Transaction, User } from "../contracts";
import { validateAndResolveAddress } from "./crypto";
import { db, firestoreCollections } from "./firebaseClient";
import WAValidator from "multicoin-address-validator";

export const getOrCreateUser = async (address: string): Promise<User> => {
	const user = await getUser(address);

	if (user) {
		return user;
	}

	const docRef = db.collection(firestoreCollections.USERS).doc();

	const newUser: User = {
		...new User(),
		id: docRef.id,
		name: minimizeAddress(address),
		social: {
			...new Social(),
		},
	};

	const isEthAddress = WAValidator.validate(address, "ETH");
	const isSolanaAddress = WAValidator.validate(address, "slr");

	if (isEthAddress) {
		const { address: userAddress, name } = await validateAndResolveAddress(
			address
		);
		newUser.ethAddress = address;
		newUser.name = name ?? newUser.name;
		newUser.identifiers = [...newUser.identifiers, address];
		if (name) {
			newUser.identifiers = [...newUser.identifiers, name];
		}
	}

	if (isSolanaAddress) {
		newUser.solAddress = address;
		newUser.identifiers = [...newUser.identifiers, address];
	}

	await db.doc(`${firestoreCollections.USERS}/${docRef.id}`).set(newUser);

	return newUser;
};

export const getUser = async (key: string): Promise<User> => {
	const response = await db
		.collection(firestoreCollections.USERS)
		.where("identifiers", "array-contains", [key])
		.get();

	if (!response.empty) {
		return response.docs[0].data() as User;
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
	if (!address) return "";
	return (
		address.substring(0, 6) + "..." + address.substring(address.length - 4)
	);
};
