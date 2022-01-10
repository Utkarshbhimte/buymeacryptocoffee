import { ethers } from "ethers";
import { MoralisContextValue, useChain, useMoralis } from "react-moralis";

export const useMoralisData = (): MoralisContextValue & {
	readonly isMainnet: boolean;
	readonly chainId: string;
} => {
	const { account, ...moralis } = useMoralis();
	const { chainId } = useChain();

	const { user, web3 } = moralis;

	const address: string = user?.get("ethAddress") ?? account;

	const mainnetChainId = 1;
	const mainnetChain = "0x1";

	const ethereumObjPresent =
		typeof window !== "undefined" && !!(window as any)?.ethereum;

	const isWalletconnectOnMainnet =
		(web3.currentProvider as any)?.chainId === mainnetChainId &&
		!ethereumObjPresent;

	const isMainnet =
		!!isWalletconnectOnMainnet ||
		(ethereumObjPresent && chainId !== mainnetChain);

	const currentChain: string =
		chainId ?? (web3.currentProvider as any)?.chainId; // on walletconnect, value for chainId is undefined

	return {
		...moralis,
		account: address,
		user,
		web3,
		isMainnet,
		chainId: currentChain,
	};
};
