import { ethers } from "ethers";
import { Transaction, Social, User } from "../contracts";
import { validateAndResolveAddress } from "./crypto";
import { db, firestoreCollections } from "./firebaseClient";

export const getOrCreateUser = async (
	address: string,
	customProvider?:
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
): Promise<User> => {
	// create new user in firesbase if not exists

	const provider = customProvider
		? customProvider
		: new ethers.providers.Web3Provider((window as any).ethereum);

	const { address: userAddress, name } = await validateAndResolveAddress(
		address,
		provider
	);

	const user = await getUser(userAddress, provider);

	if (user) {
		return user;
	}

	const docRef = db.collection(firestoreCollections.USERS).doc();

	const newUser: User = {
		...new User(),
		id: docRef.id,
		name: !!name ? name : "Unnamed",
		social: {
			...new Social(),
		},
		ens: name,
		address: userAddress,
	};

	await db.doc(`${firestoreCollections.USERS}/${docRef.id}`).set(newUser);

	return newUser;
};

export const getUser = async (
	address: string,
	customProvider?:
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
): Promise<User> => {
	const provider = customProvider
		? customProvider
		: new ethers.providers.Web3Provider((window as any).ethereum);

	const { address: userAddress } = await validateAndResolveAddress(
		address,
		provider
	);

	const response = await db
		.collection(firestoreCollections.USERS)
		.where("address", "==", userAddress)
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
	if(!address) return "";
	return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}
