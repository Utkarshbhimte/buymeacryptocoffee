import { ArrowUpIcon } from "@heroicons/react/solid";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Moralis from "moralis";
import React, { useCallback, useEffect } from "react";
import { useChain, useMoralis, useWeb3Transfer } from "react-moralis";
import { toast } from "react-toastify";
import { Transaction } from "../../contracts";
import { saveTransaction } from "../../utils";
import { fetchEnsAddress } from "../../utils/useEnsAddress";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
	Keypair,
	PublicKey,
	SystemProgram,
	Transaction as SolanaTransaction,
} from "@solana/web3.js";
import { getLamportsFromSol } from "../../utils/crypto";

interface IPayButton {
	readonly amount: number;
	readonly receiver: string;
	readonly type: "native" | "spl";
	readonly decimals?: number;
	readonly contractAddress?: string;
	readonly disabled?: boolean;
	readonly message?: string;
	readonly symbol: string;
}

const PayButton: React.FC<IPayButton> = ({
	amount,
	type,
	receiver,
	contractAddress,
	decimals,
	disabled,
	message,
	symbol,
}) => {
	const txAmount =
		// type === "native"
		getLamportsFromSol(amount);
	// : Moralis.Units.Token(amount, decimals);

	const { connection } = useConnection();
	const { sendTransaction, publicKey } = useWallet();

	const account = publicKey?.toString();

	const onClick = useCallback(async () => {
		if (!publicKey) throw new WalletNotConnectedError();

		const transaction = new SolanaTransaction().add(
			SystemProgram.transfer({
				fromPubkey: publicKey,
				toPubkey: new PublicKey(receiver),
				lamports: txAmount,
			})
		);

		const signature = await sendTransaction(transaction, connection);

		// const response = await connection.confirmTransaction(
		// 	signature,
		// 	"processed"
		// );
		saveTransactionToDB(signature);
	}, [publicKey, sendTransaction, connection, txAmount]);

	const saveTransactionToDB = async (tx: string) => {
		const walletMeta = await fetchEnsAddress(account);
		try {
			const transaction: Transaction = {
				...new Transaction(),
				to: receiver.toLowerCase(),
				from: account.toLowerCase(),
				id: tx,
				amount,
				message,
				formattedAmount: `${amount} ${symbol}`,
				chain: "solana",
				fromEns: walletMeta?.name ?? null,
				senderAvatar: walletMeta?.avatar ?? null,
				tokenDecimals: decimals || null,
			};

			await saveTransaction(transaction);

			// const transactionURL = getTxnUrl(transaction.id, transaction.chain);

			toast.success(
				<div className="flex items-center justify-between">
					<span>Transaction Successful!</span>
					<a
						className="cursor-pointer absolute flex items-center justify-center rounded-full w-6 h-6 bg-cryptoblue right-4"
						href={`https://solscan.io/tx/${tx}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<ArrowUpIcon className="w-4 h-4 rotate-45 text-white" />
					</a>
				</div>,
				{ closeButton: false, position: "top-center" }
			);
		} catch (error) {
			console.error(error);
		}
	};

	// useEffect(() => {
	// 	if (!!data) {
	// 		saveTransactionToDB(data);
	// 	}
	// }, [data]);
	console.log("called");

	return (
		<>
			<button
				type="button"
				disabled={disabled}
				onClick={onClick}
				className={`justify-center inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 w-full ${
					disabled
						? "opacity-50 cursor-not-allowed "
						: " hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cryptopurple "
				}`}
			>
				{true ? (
					`Donate now ${!!symbol ? `( ${amount} ${symbol} )` : ""} `
				) : (
					<svg
						className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				)}{" "}
			</button>
			{/* {error && (
				<div className="text-red-500 text-sm mt-3">{error.message}</div>
			)} */}
		</>
	);
};

export default PayButton;
