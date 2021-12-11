import Moralis from "moralis";
import React, { useEffect } from "react";
import { useWeb3Transfer } from "react-moralis";

interface IPayButton {
	readonly amount: number;
	readonly receiver: string;
	readonly type: "native" | "erc20";
	readonly decimals?: number;
	readonly contractAddress?: string;
}

const PayButton: React.FC<IPayButton> = ({
	amount,
	type,
	receiver,
	contractAddress,
	decimals,
}) => {
	const txAmount =
		type === "native"
			? Moralis.Units.ETH(amount)
			: Moralis.Units.Token(amount, decimals);

	const { fetch, error, isFetching } = useWeb3Transfer({
		amount: txAmount,
		receiver,
		type,
	});

	console.log({
		error,
		isFetching,
	});

	useEffect(() => {
		Moralis.Web3.enableWeb3();
	}, []);

	return (
		<button
			type="button"
			onClick={() => fetch()}
			className="justify-center inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
		>
			Donate now ( 0 ETH )
		</button>
	);
};

export default PayButton;
