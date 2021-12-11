import React, { ReactText, useEffect, useState } from "react";
import { useChain, useERC20Balances, useNativeBalance } from "react-moralis";
import { useUser } from "../../utils/context";
import CryptoSelect from "../CryptoSelect";
import Select from "../Select";
import PayButton from "./PayButton";

interface Token {
	readonly name: string;
	readonly symbol: string;
	readonly balance: ReactText;
	readonly decimals: number;
	readonly tokenAddress: string | null;
}

const PaymentSection = ({ authenticated }: { authenticated: boolean }) => {
	const [price, setPrice] = useState(0);
	const [message, setMessage] = useState("");
	const { currentWallet: address, user } = useUser();

	// store token balance with name state
	const [tokenBalance, setTokenBalance] = useState<Token[]>([]);
	const [selectedToken, setSelectedToken] = useState<string>();

	const {
		fetchERC20Balances,
		data,
		isFetching: isFetchingERC20,
		isLoading: isLoadingERC20,
		error,
	} = useERC20Balances();

	const { chainId } = useChain();

	const {
		getBalances,
		data: nativeData,
		isFetching: isFetchingNative,
		isLoading: isLoadingNative,
		error: errorNative,
	} = useNativeBalance();

	const fetchBalances = async () => {
		if (!chainId) {
			return;
		}

		const chain = chainId as any;

		await getBalances({
			params: {
				address,
				chain: chain,
			},
		});
		await fetchERC20Balances({
			params: {
				address,
				chain: chain,
			},
		});

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

		const cleanedNativeTokens = {
			symbol: "ETH",
			balance: nativeData.formatted,
			name: "ETH",
			decimals: 18,
			tokenAddress: null,
		};

		setSelectedToken(cleanedNativeTokens.name);

		setTokenBalance([...cleanedERC20Tokens, cleanedNativeTokens]);
	};

	console.log([...tokenBalance]);

	useEffect(() => {
		fetchBalances();
	}, [chainId]);

	const disableDonateButton =
		isLoadingERC20 ||
		isLoadingNative ||
		isFetchingERC20 ||
		isFetchingNative ||
		!price ||
		authenticated ||
		!(window as any).ethereum;

	const selectedTokenBalance = tokenBalance.find(
		(token) => token.name === selectedToken
	)?.balance;

	return (
		<section
			aria-labelledby="timeline-title"
			className="lg:col-start-3 lg:col-span-1"
		>
			<div className="bg-white border border-gray-200 sm:rounded-lg">
				{/* {!widget ? ( */}
				<div className="h-full">
					<div className="font-urbanist font-bold px-6 py-4 text-lg border-b border-gray-200">
						Support the Creator 🤝
					</div>
					<div className="flex font-urbanist font-normal items-center justify-between border rounded-md p-3 mt-6 mx-6">
						<div className="flex flex-col">
							<div>
								<Select
									options={tokenBalance.map((token) => ({
										key: token.name,
										label: token.name,
									}))}
									onChange={(e) => setSelectedToken(e)}
									value={selectedToken}
								/>
							</div>
							<div className="mt-2">
								Balance: {selectedTokenBalance}
							</div>
						</div>
						<div>0.0ETH</div>
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
							receiver={user?.address}
							type="native"
							amount={0.05}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PaymentSection;
