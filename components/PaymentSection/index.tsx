import Moralis from "moralis";
import { useRouter } from "next/router";
import React, { ReactText, useEffect, useState } from "react";
import {
	useChain,
	useERC20Balances,
	useMoralis,
	useNativeBalance,
	useOneInchTokens,
} from "react-moralis";
import { chainLogo, tokenMetadata } from "../../utils/tokens";

import Select from "../Select";
import PayButton from "./PayButton";

interface Token {
	readonly name: string;
	readonly symbol: string;
	readonly balance: ReactText;
	readonly decimals: number;
	readonly tokenAddress: string | null;
	readonly logo?: string;
}

const PaymentSection = () => {
	const { account: address } = useMoralis();
	const { chainId } = useChain();
	const { data: tokenMetadataData } = useOneInchTokens({
		chain: chainId,
	});

	console.log(tokenMetadataData);

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
	const nativeTokenName = nativeData?.formatted?.split(" ")[1] ?? "";
	const cleanedNativeTokens = {
		symbol: nativeTokenName,
		balance: nativeData.formatted,
		name: nativeTokenName,
		decimals: 18,
		tokenAddress: null,
		logo: tokenMetadata[nativeTokenName]?.logoURI,
	};

	const cleanedERC20Tokens: Token[] =
		data?.map((token) => ({
			name: token.name,
			symbol: token.symbol,
			balance: Moralis.Units.FromWei(
				token.balance,
				Number(token.decimals)
			),
			decimals: Number(token.decimals),
			tokenAddress:
				tokenMetadata[token.symbol]?.address ?? token.token_address,
			logo:
				token.logo ??
				tokenMetadata[token.symbol]?.logoURI ??
				chainLogo[nativeTokenName],
		})) ?? [];

	// fetch tokens data for plugin, need to add plugin in moralis
	const getData = async () => {
		const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata({
			chain: chainId as any,
			addresses: [address],
		});
		console.log({ tokenMetadata });
	};

	useEffect(() => {
		getData();
		// console.log("this-->", Moralis?.["Plugins"]);
		// if (!Moralis?.["Plugins"]?.["oneInch"]) return null;
		// Moralis.Plugins.oneInch
		// 	.getSupportedTokens({ chain: chainId })
		// 	.then((tokens) => {
		// 		console.log({ tokens });
		// 	});
	}, []);

	const tokensArray: Token[] = [...cleanedERC20Tokens, cleanedNativeTokens];

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
							<div className="w-32">
								<Select
									options={tokensArray.map((token) => ({
										key: token.name,
										label: (
											<div className="flex items-center">
												{token.logo && (
													<img
														src={token.logo}
														className="h-6 w-6 mr-1"
													/>
												)}
												<span className="text-sm font-semibold">
													{token.name}
												</span>
											</div>
										),
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
