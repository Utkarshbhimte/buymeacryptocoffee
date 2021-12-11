import { useRouter } from "next/router";
import React, { ReactText, useState } from "react";
import {
	useChain,
	useERC20Balances,
	useMoralis,
	useNativeBalance,
} from "react-moralis";

import Select from "../Select";
import PayButton from "./PayButton";

interface Token {
	readonly name: string;
	readonly symbol: string;
	readonly balance: ReactText;
	readonly decimals: number;
	readonly tokenAddress: string | null;
}

const PaymentSection = () => {
	const { account: address } = useMoralis();
	const { chainId } = useChain();

	const router = useRouter();
	const profileAddress = router.query.id?.toString() ?? "";

	const [price, setPrice] = useState(0);
	const [message, setMessage] = useState("");

	const [selectedToken, setSelectedToken] = useState<string>();

	const {
		fetchERC20Balances,
		data,
		isFetching: isFetchingERC20,
		isLoading: isLoadingERC20,
		error,
	} = useERC20Balances();

	const {
		getBalances,
		data: nativeData,
		isFetching: isFetchingNative,
		isLoading: isLoadingNative,
		error: errorNative,
	} = useNativeBalance();

	const fetchBalances = async () => {
		console.log("Console log 1");
		await getBalances({
			params: {
				address,
				chain: chainId as any,
			},
		});
		await fetchERC20Balances({
			params: {
				address,
				chain: chainId as any,
			},
		});
	};

	const cleanedERC20Tokens: Token[] =
		data?.map((token) => {
			return {
				name: token.name,
				symbol: token.symbol,
				balance: token.balance,
				decimals: Number(token.decimals),
				tokenAddress: token.token_address,
			};
		}) ?? [];

	console.log({
		cleanedERC20Tokens,
	});

	const nativeTokenName = nativeData?.formatted?.split(" ")[1] ?? "";

	const cleanedNativeTokens = {
		symbol: nativeTokenName,
		balance: nativeData.formatted,
		name: nativeTokenName,
		decimals: 18,
		tokenAddress: null,
	};

	const tokensArray = [...cleanedERC20Tokens, cleanedNativeTokens];

	const disableDonateButton =
		isLoadingERC20 ||
		isLoadingNative ||
		isFetchingERC20 ||
		isFetchingNative ||
		!price;

	const selectedTokenData =
		tokensArray.find((token) => token.name === selectedToken) ??
		cleanedNativeTokens;

	return (
		<section
			aria-labelledby="timeline-title"
			className="lg:col-start-3 lg:col-span-1"
		>
			<div className="bg-white border border-gray-200 sm:rounded-lg">
				{/* {!widget ? ( */}
				<div className="h-full">
					<div className="font-urbanist font-bold px-6 py-4 text-lg border-b border-gray-200 flex items-center justify-between">
						Support the Creator 🤝
						<span
							className={`p-2 rounded-lg  ${
								isFetchingERC20 ||
								isLoadingERC20 ||
								isFetchingNative ||
								isLoadingNative
									? " animate-spin "
									: " hover:bg-indigo-100 cursor-pointer "
							}`}
							onClick={fetchBalances}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
								role="img"
								preserveAspectRatio="xMidYMid meet"
								viewBox="0 0 24 24"
								className="h-6 w-6 fill-current"
							>
								<g fill="none">
									<path
										d="M11.995 4a8 8 0 1 0 7.735 10h-2.081a6 6 0 1 1-5.654-8a5.92 5.92 0 0 1 4.223 1.78L13 11h7V4l-2.351 2.35A7.965 7.965 0 0 0 11.995 4z"
										fill="currentColor"
									></path>
								</g>
							</svg>
						</span>
					</div>
					<div className="flex font-urbanist font-normal items-center justify-between border rounded-md p-3 mt-6 mx-6">
						<div className="flex flex-col">
							<div className="w-24">
								<Select
									options={tokensArray.map((token) => ({
										key: token.name,
										label: token.name,
									}))}
									onChange={(e) => setSelectedToken(e)}
									value={
										!!selectedToken
											? selectedToken
											: cleanedNativeTokens.name
									}
								/>
							</div>
							<div className="mt-2">
								Balance: {selectedTokenData?.balance ?? 0}
							</div>
						</div>
						<div>
							<input
								type="number"
								name="amount"
								id="amount"
								min="0"
								value={price}
								onChange={(e) =>
									setPrice(Number(e.target.value))
								}
								className="shadow-sm block sm:text-sm border-none rounded-md w-24 text-right"
								placeholder="0.0"
							/>
						</div>
					</div>

					<div className="font-urbanist mt-4 mx-6">
						<div className="mt-1">
							<textarea
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								rows={4}
								name="comment"
								id="comment"
								placeholder="Add your comment (Optional)"
								className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
					</div>

					<div className="mx-6 my-4">
						<PayButton
							disabled={disableDonateButton}
							receiver={profileAddress}
							type={
								selectedTokenData?.tokenAddress
									? "erc20"
									: "native"
							}
							symbol={selectedTokenData?.symbol}
							decimals={selectedTokenData?.decimals}
							amount={price}
							message={message}
							contractAddress={selectedTokenData?.tokenAddress}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PaymentSection;
