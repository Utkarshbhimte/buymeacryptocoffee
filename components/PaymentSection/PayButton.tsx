import { ArrowUpIcon } from "@heroicons/react/solid";
import Moralis from "moralis";
import React, { useEffect } from "react";
import { useChain, useMoralis, useWeb3Transfer } from "react-moralis";
import { toast } from "react-toastify";
import { Transaction } from "../../contracts";
import { saveTransaction } from "../../utils";

interface IPayButton {
	readonly amount: number;
	readonly receiver: string;
	readonly type: "native" | "erc20";
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
		type === "native"
			? Moralis.Units.ETH(amount)
			: Moralis.Units.Token(amount, decimals);

	const { fetch, error, isFetching, data } = useWeb3Transfer({
		amount: txAmount,
		receiver,
		type,
		contractAddress,
	});

	const { chainId } = useChain();

	console.log({
		amount: txAmount,
		receiver,
		type,
		contractAddress,
	});

	const { account } = useMoralis();

	useEffect(() => {
		Moralis.Web3.enableWeb3();
	}, []);

	const saveTransactionToDB = async (tx: any) => {
		try {
			const transaction: Transaction = {
				...new Transaction(),
				to: receiver.toLowerCase(),
				from: account.toLowerCase(),
				id: tx.transactionHash,
				amount,
				message,
				formattedAmount: `${amount} ${symbol}`,
				chain: chainId,
			};

			console.log({ transaction });
			await saveTransaction(transaction);
			const transactionURL = chainId
				? chainId === "0x1"
					? `https://etherscan.io/tx/${transaction?.id}`
					: `https://polygonscan.com/tx/${transaction?.id}`
				: `https://etherscan.io/tx/${transaction?.id}`;

			toast.success(
				<div className="flex items-center justify-between">
					<span>Transaction Successful!</span>
					<a
						className="cursor-pointer absolute flex items-center justify-center rounded-full w-6 h-6 bg-cryptoblue right-4"
						href={"#"}
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

	useEffect(() => {
		if (!!data) {
			console.log(
				"Transaction is successful, saving to DB and redirecting to home page"
			);
			saveTransactionToDB(data);
		}
	}, [data]);

	return (
		<>
			<button
				type="button"
				disabled={disabled || isFetching}
				onClick={() => fetch()}
				className={`justify-center inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 w-full ${
					isFetching || disabled
						? "opacity-50 cursor-not-allowed "
						: " hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cryptopurple "
				}`}
			>
				{!isFetching ? (
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
			{error && (
				<div className="text-red-500 text-sm mt-3">{error.message}</div>
			)}
		</>
	);
};

export default PayButton;
