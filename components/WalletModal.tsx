import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { Modal } from "antd";
import React, { useMemo } from "react";

const WalletModal: React.FC = () => {
	const { wallets, select, connect } = useWallet();

	const [installed] = useMemo(() => {
		const installedWallets = [];
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

	return (
		<Modal visible={true}>
			{installed.map((wallet) => {
				return (
					<div
						className="cursor-pointer"
						onClick={() => {
							console.log(wallet.adapter);
							select(wallet.name);
							connect();
						}}
					>
						{wallet.name}
					</div>
				);
			})}
		</Modal>
	);
};

export default WalletModal;
