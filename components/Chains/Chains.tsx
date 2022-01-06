// import { useWallet } from "@solana/wallet-adapter-react";

import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useChain, useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import { sign } from "tweetnacl";
import Modal from "../Modal";
import { ETHLogo, PolygonLogo, SolanaLogo } from "./Logos";
import { useRouter } from "next/router";
import WAValidator from "multicoin-address-validator";

const styles = {
	item: {
		display: "flex",
		alignItems: "center",
		height: "42px",
		fontWeight: "500",
		fontFamily: "Roboto, sans-serif",
		fontSize: "14px",
		padding: "0 10px",
	},
	button: {
		border: "2px solid rgb(231, 234, 243)",
		borderRadius: "12px",
	},
};

declare let window: any;
interface ChainItem {
	key: string;
	value: string;
	icon: JSX.Element;
	hidden?: boolean;
}

const menuItems = (isEthAddress: boolean): ChainItem[] => {
	return [
		{
			key: "0x1",
			value: "Ethereum",
			icon: <ETHLogo />,
			hidden: !isEthAddress,
		},
		{
			key: "0x89",
			value: "Polygon",
			icon: <PolygonLogo />,
			hidden: !isEthAddress,
		},
		{
			key: "solana",
			value: "Solana",
			icon: <SolanaLogo />,
			hidden: isEthAddress,
		},
	];
};

const Chains = () => {
	const { switchNetwork, chainId, chain } = useChain();
	const { isAuthenticated, logout } = useMoralis();
	const router = useRouter();
	const id = router.query.id;
	const [selected, setSelected] = useState<ChainItem | undefined>();
	const [isEthAddress, setIsEthAddress] = useState(false);
	const {
		wallets,
		select,
		publicKey,
		signMessage,
		connected,
		disconnect,
		wallet,
	} = useWallet();

	// state for modal open
	const [modalOpen, setModalOpen] = useState(false);

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

	const solanaAuth = useCallback(async () => {
		try {
			// `publicKey` will be null if the wallet isn't connected

			if (!publicKey) throw new Error("Wallet not connected!");
			// `signMessage` will be undefined if the wallet doesn't support it
			if (!signMessage)
				throw new Error("Wallet does not support message signing!");

			// Encode anything as bytes
			const message = new TextEncoder().encode("Connect to bmcc!");
			// Sign the bytes using the wallet
			const signature = await signMessage(message);
			// Verify that the bytes were signed using the private key that matches the known public key
			if (!sign.detached.verify(message, signature, publicKey.toBytes()))
				throw new Error("Invalid signature!");
		} catch (error: any) {
			toast.error(error.message);
		}
	}, [publicKey, signMessage]);

	useEffect(() => {
		if (!chainId) return null;
		const newSelected = menuItems(isEthAddress).find(
			(item) => item.key === chainId
		);
		setSelected(newSelected);
	}, [chainId]);

	useEffect(() => {
		if (id) {
			const isEthAddress = WAValidator.validate(id, "ETH");
			setIsEthAddress(isEthAddress);
		}
	}, [id]);

	const handleMenuClick = async (key: string) => {
		if (key === "solana") {
			// if (!connected) setModalOpen(true);
			isAuthenticated && logout();
			setModalOpen(true);
			return;
		}
		if (connected) {
			disconnect();
		}
		switchNetwork(key);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	// useEffect(() => {
	// 	if (!!publicKey) {
	// 		solanaAuth();
	// 	}
	// }, [!!publicKey]);

	return (
		<div className="space-x-4 items-center hidden md:flex">
			<span className="text-gray-500 text-sm">Switch Chain:</span>
			{menuItems(isEthAddress).map((item) => (
				<button
					key={item.value}
					onClick={() => handleMenuClick(item.key)}
					className={classNames(
						"rounded-lg focus:bg-indigo-100 hover:bg-indigo-100 text-white",
						selected?.key === item.key
							? ""
							: "focus:bg-indigo-100 hover:bg-indigo-100 cursor-pointer opacity-40",
						item.hidden ? "hidden" : ""
					)}
				>
					{item.icon}
				</button>
			))}
			<Modal title="Connect wallet" onClose={closeModal} open={modalOpen}>
				{installed.map((wallet) => {
					return (
						<div
							key={wallet.name}
							className="cursor-pointer"
							onClick={() => {
								select(wallet.adapter.name);
							}}
						>
							{wallet.adapter.name}
						</div>
					);
				})}
			</Modal>
		</div>
	);
};

export default Chains;
