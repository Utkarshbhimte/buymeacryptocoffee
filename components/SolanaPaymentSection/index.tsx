import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Moralis from "moralis";
import React, { ReactText, useEffect, useState } from "react";
import {
	useChain,
	useERC20Balances,
	useMoralis,
	useNativeBalance,
	useOneInchTokens,
} from "react-moralis";
import { SolanaAccountDetails, SolanaTokenData } from "../../contracts";
import {
	getSolanaWalletDetails,
	getTokensAvailableInSolanaWallet,
} from "../../utils/crypto";
import { chainLogo, tokenMetadata } from "../../utils/tokens";
import PayButton from "./PayButton";
import Select from "../Select";

interface Token {
	readonly name: string;
	readonly symbol: string;
	readonly balance: ReactText;
	readonly decimals: number;
	readonly tokenAddress: string | null;
	readonly logo?: string;
}

const SolanaPaymentSection = ({ profileAddress }) => {
	const { account: walletAddress, user } = useMoralis();

	const queriedAddress = user?.get("ethAddress");
	const address = walletAddress ?? queriedAddress;

	const [price, setPrice] = useState(0);
	const [message, setMessage] = useState("");
	const [loading, setIsLoading] = useState(false);
	const [accountDetails, setAccountDetails] =
		useState<SolanaAccountDetails>();
	const [tokens, setTokens] = useState<SolanaTokenData[]>([]);

	const [selectedToken, setSelectedToken] = useState<string>();

	const { publicKey, connected, sendTransaction } = useWallet();

	useEffect(() => {
		fetchBalances();
	}, [connected, publicKey]);

	const fetchBalances = async () => {
		setIsLoading(true);
		try {
			if (connected) {
				const accountDetails = await getSolanaWalletDetails(
					publicKey.toString()
				);
				const tokensData = await getTokensAvailableInSolanaWallet(
					publicKey.toString()
				);
				setAccountDetails(accountDetails);
				setTokens(tokensData);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const cleanedNativeTokens = {
		symbol: "SOL",
		balance: (accountDetails?.lamports ?? 0) / LAMPORTS_PER_SOL,
		name: "SOL",
		decimals: 18,
		tokenAddress: null,
		logo: "/solanaLogoMark.svg",
	};

	const cleanedSOLTokens: Token[] =
		tokens?.map((token) => ({
			name: token.tokenName,
			symbol: token.tokenSymbol,
			balance: token.tokenAmount.amount,
			decimals: token.tokenAmount.decimals,
			tokenAddress: token.tokenAddress,
			logo: token.tokenIcon,
		})) ?? [];

	const tokensArray: Token[] = [cleanedNativeTokens, ...cleanedSOLTokens];

	const disableDonateButton = loading || !price;

	const selectedTokenData =
		tokensArray.find((token) => token.name === selectedToken) ??
		cleanedNativeTokens;

	const handleMax = () => {
		setPrice(Number(selectedTokenData.balance as string));
	};

	return (
		<section
			aria-labelledby="timeline-title"
			className="lg:col-start-3 lg:col-span-1"
		>
			<div className="bg-white rounded-lg shadow-md">
				{/* {!widget ? ( */}
				<div className="h-full">
					<div className="font-urbanist font-bold px-6 py-4 text-lg border-b border-gray-200 flex items-center justify-between">
						Support the Creator 🤝
						<span
							className={`p-2 rounded-lg  ${
								loading
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
					<div className="px-6 py-4">
						<div className="font-urbanist font-normal rounded-md space-x-4">
							<div className="flex items-center justify-between">
								<div className="flex flex-col flex-1 w-44">
									<Select
										options={tokensArray.map((token) => ({
											key: token.name,
											label: (
												<div className="flex items-center space-x-2">
													{token.logo && (
														<img
															src={token.logo}
															className="h-6 w-6"
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
										placeholder="0.0"
									/>
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
										style={{
											appearance: "none",
										}}
										className="block text-2xl font-bold border-none rounded-md w-24 text-right focus:ring-0 shadow-none focus:bg-gray-100 hover:bg-gray-100 cursor-pointer transition duration-300 ease-in-out"
										placeholder="0.0"
									/>
								</div>
							</div>
							<div className="mt-2 text-xs">
								Balance: {selectedTokenData?.balance ?? 0}
								<button
									className="px-1 ml-2 border border-cryptopurple bg-lightpurple text-cryptopurple rounded-lg"
									onClick={handleMax}
								>
									max
								</button>
							</div>
						</div>

						<div className="font-urbanist mt-4">
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

						<div className="mt-4">
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
								contractAddress={
									selectedTokenData?.tokenAddress
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SolanaPaymentSection;
