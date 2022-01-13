import { Social, Transaction, User } from "../contracts";
import { validateAndResolveAddress } from "./crypto";
import { db, firestoreCollections } from "./firebaseClient";
import WAValidator from "multicoin-address-validator";
import { PublicKey } from "@solana/web3.js";

export const getOrCreateUser = async (
	address: string,
	isForClaiming?: boolean
): Promise<User> => {
	const user = await getUser(address.toLowerCase());

	if (user || isForClaiming) {
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

	const { key } = await detectAddress(address);
	const isSolanaAddress = key === "solAddress";

	if (!isEthAddress && !isSolanaAddress && !address.includes("eth")) {
		throw new Error("Invalid attempt to fetch user");
	}

	if (address.includes(".eth")) {
		const { address: userAddress, name } = await validateAndResolveAddress(
			address,
			true
		);

		newUser.ethAddress = userAddress;
		newUser.name = name ?? newUser.name;
		newUser.ens = name ?? null;
	}

	if (isEthAddress) {
		const { address: userAddress, name } = await validateAndResolveAddress(
			address
		);
		newUser.ethAddress = address;
		newUser.name = name ?? newUser.name;
	}

	if (isSolanaAddress) {
		newUser.solAddress = address;
	}

	await db.doc(`${firestoreCollections.USERS}/${docRef.id}`).set(newUser);

	return newUser;
};

export const getUser = async (address: string): Promise<User> => {
	const { key, value } = await detectAddress(address);

	const response = await db
		.collection(firestoreCollections.USERS)
		.where(key, "==", value)
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

export const detectAddress = async (
	address?: string
): Promise<Record<string, string>> => {
	if (!address) return {};

	if (address.includes(".eth")) {
		return {
			key: "ens",
			value: address,
		};
	}

	const isEthAddress = WAValidator.validate(address, "ETH");

	if (isEthAddress) {
		return {
			key: "ethAddress",
			value: address,
		};
	}

	try {
		if (PublicKey.isOnCurve(new Uint8Array(Number(address)))) {
			return {
				key: "solAddress",
				value: address,
			};
		}
	} catch (error) {
		console.error(error);
	}

	return {
		key: "name",
		value: address,
	};
};

export const mergeAddresses = async (
	user: User,
	ethAddress: string,
	solAddress: string,
	deleteId?: string
) => {
	try {
		const updatedUser: User = {
			...user,
			ethAddress,
			solAddress: solAddress.toLowerCase(),
		};

		await db
			.doc(`${firestoreCollections.USERS}/${user.id}`)
			.update({ ...updatedUser });

		if (!!deleteId?.length) {
			await db.doc(`${firestoreCollections.USERS}/${deleteId}`).delete();
		}

		return updatedUser;
	} catch (error) {
		console.error(error);
		return null;
	}
};
