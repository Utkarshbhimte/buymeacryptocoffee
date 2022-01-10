import { WalletReadyState } from "@solana/wallet-adapter-base";
import {
	useWallet,
	Wallet,
	WalletContextState,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";

type IUseSolana = Omit<WalletContextState, "publicKey"> & {
	readonly publicKey: string | null;
};

export const useSolana = (): IUseSolana => {
	const { wallets, publicKey, ...solanaWallet } = useWallet();

	const [installed] = useMemo(() => {
		const installedWallets: Wallet[] = [];
		const otherWallets = [];
		wallets.forEach((wallet) => {
			if (wallet.readyState === WalletReadyState.Installed) {
				installedWallets.push(wallet);
			} else {
				otherWallets.push(wallet);
			}
		});
		const remainingFeaturedSpots = Math.max(0, installedWallets.length);
		return [[...installedWallets]];
	}, [wallets]);

	return {
		...solanaWallet,
		publicKey: publicKey?.toString(),
		wallets: installed,
	};
};
