import Moralis from "moralis";
import React, { useEffect } from "react";
import { useMoralis, useWeb3Transfer } from "react-moralis";
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
}

const PayButton: React.FC<IPayButton> = ({
	amount,
	type,
	receiver,
	contractAddress,
	decimals,
	disabled,
	message,
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

	const { account } = useMoralis();

	console.log({
		error,
		isFetching,
		data,
	});

	useEffect(() => {
		Moralis.Web3.enableWeb3();
	}, []);

	const saveTransactionToDB = async (tx: any) => {
		try {
			const transaction: Transaction = {
				...new Transaction(),
				to: receiver,
				from: account,
				id: tx.transactionHash,
				amount,
				message,
			};

			console.log({ transaction });
			await saveTransaction(transaction);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		console.log({ data });
		if (!isFetching && !error && !!data) {
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
						: " hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
				}`}
			>
				Donate now ( {amount} ETH )
			</button>
			{error && (
				<div className="text-red-500 text-sm mt-3">{error.message}</div>
			)}
		</>
	);
};

export default PayButton;
