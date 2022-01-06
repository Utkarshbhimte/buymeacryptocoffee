import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SendTransactionOptions } from "@solana/wallet-adapter-base";
import {
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
	Transaction as SolanaTransaction,
} from "@solana/web3.js";
import { ethers } from "ethers";
import { SolanaAccountDetails, SolanaTokenData } from "../contracts";

declare let window: any;

const solscanBaseURL = "https://public-api.solscan.io";

export const checkIfWalletIsConnected = async (): Promise<string> => {
	try {
		if (!window) {
			throw new Error("No window object");
		}

		const { ethereum } = window;

		if (!ethereum) {
			console.log("Make sure you have metamask!");
			return;
		} else {
			console.log("We have the ethereum object");
		}

		/*
		 * Check if we're authorized to access the user's wallet
		 */

		let chainId = await ethereum.request({ method: "eth_chainId" });

		// String, hex code of the chainId of the Rinkebey test network
		// const rinkebyChainId = "0x4";
		const mainnetChainId = "0x1";
		if (chainId !== mainnetChainId) {
			throw new Error("Please connect to the mainnet");
		}

		const accounts = await ethereum.request({ method: "eth_accounts" });

		/*
		 * User can have multiple authorized accounts, we grab the first one if its there!
		 */

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log("Found an authorized account:", account);
			return account;
		} else {
			console.log("No authorized account found");
		}
	} catch (error) {
		console.error(error);
	}
};

export const connectWallet = async () => {
	try {
		if (!window) {
			throw new Error("No window object");
		}

		const { ethereum } = window;

		if (!ethereum) {
			alert("Get MetaMask!");
			return;
		}

		/*
		 * Fancy method to request access to account.
		 */

		// let chainId = await ethereum.request({ method: "eth_chainId" });
		// console.log(chainId);
		// console.log("Connected to chain " + chainId);

		// // String, hex code of the chainId of the Rinkebey test network
		// const rinkebyChainId = "0x4";
		// if (chainId !== rinkebyChainId) {
		// 	alert("You are not connected to the Rinkeby Test Network!");
		// 	throw new Error(
		// 		"You are not connected to the Rinkeby Test Network!"
		// 	);
		// }

		const accounts = await ethereum.request({
			method: "eth_requestAccounts",
		});

		/*
		 * Boom! This should print out public address once we authorize Metamask.
		 */
		console.log({ accounts });
		console.log("Connected", accounts[0]);

		return accounts[0];
	} catch (error) {
		console.log(error);
	}
};

export const sendTransaction = async (
	addr: string,
	message: string,
	ether: string
) => {
	await window.ethereum.send("eth_requestAccounts");
	console.log("here", ethers);
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	console.log({ provider });
	const signer = provider.getSigner();
	ethers.utils.getAddress(addr);
	console.log({ signer });
	const hexaMessage = ethers.utils.formatBytes32String(message);
	console.log({ hexaMessage });
	const tx = await signer.sendTransaction({
		to: addr,
		value: ethers.utils.parseEther(ether),
		data: hexaMessage,
	});

	return tx;
};

export interface ENSResponse {
	address?: string | null;
	name?: string | null;
	avatar?: string | null;
}
export const validateAndResolveAddress = async (
	userAddress: string,
	provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
): Promise<ENSResponse | undefined> => {
	try {
		let address, name, avatar;

		if (userAddress.includes(".")) {
			const ensResolver = await provider.resolveName(userAddress);

			if (!ensResolver) {
				// toast.error("This address is not valid");
				throw new Error("This address is not valid");
			}

			address = ensResolver;
			name = userAddress;
		}

		if (!userAddress.includes(".")) {
			ethers.utils.getAddress(userAddress);

			name = await provider.lookupAddress(userAddress);

			address = userAddress;
		}

		if (name) {
			avatar = await provider.getAvatar(name);
		}

		return { address, name, avatar };
	} catch (error) {
		console.error(error);
		return {};
	}
};

export const getSolanaWalletDetails = async (
	walletAddress: string
): Promise<SolanaAccountDetails> => {
	try {
		const response = await fetch(
			`${solscanBaseURL}/account/${walletAddress}`
		);

		const json = await response.json();
		console.log(json);

		return json;
	} catch (error) {
		console.error(error);
	}
};

export const getTokensAvailableInSolanaWallet = async (
	walletAddress: string
): Promise<SolanaTokenData[]> => {
	try {
		const response = await fetch(
			`${solscanBaseURL}/account/tokens?account=${walletAddress}`
		);

		const json = await response.json();
		console.log(json.filter((token) => !!token?.tokenSymbol));

		return json.filter((token) => !!token?.tokenSymbol);
	} catch (error) {
		console.error(error);
	}
};

export const formatSolanaBalance = (lamports?: number, decimals?: number) => {
	if (decimals) {
		return !lamports ? 0 : lamports / 10 ** decimals;
	}
	return !lamports ? 0 : (lamports ?? 0) / LAMPORTS_PER_SOL;
};

export const getLamportsFromSol = (sol: number) => sol * LAMPORTS_PER_SOL;

export const sendSPL = async (
	mint: string,
	toWallet: PublicKey,
	amount: number,
	decimals: number,
	from: PublicKey,
	connection: Connection,
	signTransaction?: (
		transaction: SolanaTransaction
	) => Promise<SolanaTransaction>
) => {
	const SPL_pubkey = new PublicKey(mint);

	const fromWallet = Keypair.generate();
	const SPL_Token = new Token(
		connection,
		SPL_pubkey,
		TOKEN_PROGRAM_ID,
		fromWallet
	);
	console.log(SPL_Token);

	let fromTokenAccount;

	try {
		fromTokenAccount = await SPL_Token.getOrCreateAssociatedAccountInfo(
			from
		);
		// Create associated token accounts for the recipient if they don't exist yet
	} catch (error: any) {
		return;
	}

	const associatedDestinationTokenAddr =
		await Token.getAssociatedTokenAddress(
			SPL_Token.associatedProgramId,
			SPL_Token.programId,
			SPL_pubkey,
			toWallet
		);

	const receiverAccount = await connection.getAccountInfo(
		associatedDestinationTokenAddr
	);

	const transaction = new SolanaTransaction();

	if (receiverAccount === null) {
		transaction.add(
			Token.createAssociatedTokenAccountInstruction(
				SPL_Token.associatedProgramId,
				SPL_Token.programId,
				SPL_pubkey,
				associatedDestinationTokenAddr,
				toWallet,
				from
			)
		);
	}

	// Add token transfer instructions to transaction
	transaction.add(
		Token.createTransferInstruction(
			TOKEN_PROGRAM_ID,
			fromTokenAccount.address,
			associatedDestinationTokenAddr,
			from,
			[],
			Number(amount) * 10 ** decimals
		)
	);

	let signedTransaction: any = null;

	const { blockhash } = await connection.getRecentBlockhash();

	transaction.recentBlockhash = blockhash;
	transaction.feePayer = from;

	if (signTransaction) {
		try {
			signedTransaction = await signTransaction(transaction);
		} catch (e: any) {
			return;
		}
	} else return;

	const txid = await connection
		.sendRawTransaction(signedTransaction.serialize())
		.catch((err) => {
			console.log(err);
		});
	if (txid) return txid;
};
