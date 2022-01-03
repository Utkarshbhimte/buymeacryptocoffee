// import { useWallet } from "@solana/wallet-adapter-react";

import bs58 from "bs58";
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { useChain, useMoralis } from "react-moralis";
import { sign } from "tweetnacl";
import { ETHLogo, PolygonLogo, SolanaLogo } from "./Logos";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";

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
}
const menuItems: ChainItem[] = [
	{
		key: "0x1",
		value: "Ethereum",
		icon: <ETHLogo />,
	},
	// {
	// 	key: "0x539",
	// 	value: "Local Chain",
	// 	icon: <ETHLogo />,
	// },
	// {
	// 	key: "0x3",
	// 	value: "Ropsten Testnet",
	// 	icon: <ETHLogo />,
	// },
	// {
	// 	key: "0x4",
	// 	value: "Rinkeby Testnet",
	// 	icon: <ETHLogo />,
	// },
	// {
	// 	key: "0x2a",
	// 	value: "Kovan Testnet",
	// 	icon: <ETHLogo />,
	// },
	// {
	// 	key: "0x5",
	// 	value: "Goerli Testnet",
	// 	icon: <ETHLogo />,
	// },
	// {
	// 	key: "0x38",
	// 	value: "Binance",
	// 	icon: <BSCLogo />,
	// },
	// {
	// 	key: "0x61",
	// 	value: "Smart Chain Testnet",
	// 	icon: <BSCLogo />,
	// },
	{
		key: "0x89",
		value: "Polygon",
		icon: <PolygonLogo />,
	},
	{
		key: "solana",
		value: "Solana",
		icon: <SolanaLogo />,
	},
	// {
	// 	key: "0x13881",
	// 	value: "Mumbai",
	// 	icon: <PolygonLogo />,
	// },
	// {
	// 	key: "0xa86a",
	// 	value: "Avalanche",
	// 	icon: <AvaxLogo />,
	// },
];

const Chains = () => {
	const { switchNetwork, chainId, chain } = useChain();
	const { isAuthenticated } = useMoralis();
	const [selected, setSelected] = useState<ChainItem | undefined>();

	const { publicKey, signMessage, connect } = useWallet();
	console.log(publicKey);

	const solanaAuth = useCallback(async () => {
		try {
			// `publicKey` will be null if the wallet isn't connected

			const response = await connect();

			console.log({ publicKey, signMessage, response });

			if (!publicKey) throw new Error("Wallet not connected!");
			// `signMessage` will be undefined if the wallet doesn't support it
			if (!signMessage)
				throw new Error("Wallet does not support message signing!");

			// Encode anything as bytes
			const message = new TextEncoder().encode("Hello, world!");
			// Sign the bytes using the wallet
			const signature = await signMessage(message);
			// Verify that the bytes were signed using the private key that matches the known public key
			if (!sign.detached.verify(message, signature, publicKey.toBytes()))
				throw new Error("Invalid signature!");

			alert(`Message signature: ${bs58.encode(signature)}`);
		} catch (error: any) {
			alert(`Signing failed: ${error?.message}`);
		}
	}, [publicKey, signMessage]);

	useEffect(() => {
		if (!chainId) return null;
		const newSelected = menuItems.find((item) => item.key === chainId);
		setSelected(newSelected);
	}, [chainId]);

	const handleMenuClick = async (key: string) => {
		if (key === "solana") {
			const res = await window?.solana?.connect();
			console.log(res.publicKey.toString());
			solanaAuth();
			return;
		}
		switchNetwork(key);
	};

	if (!isAuthenticated) return <div />;

	return (
		<div className="space-x-4 items-center hidden md:flex">
			<span className="text-gray-500 text-sm">Switch Chain:</span>
			{menuItems.map((item) => (
				<button
					key={item.key}
					onClick={() => handleMenuClick(item.key)}
					className={classNames(
						"rounded-lg focus:bg-indigo-100 hover:bg-indigo-100 text-white",
						selected?.key === item.key
							? ""
							: "focus:bg-indigo-100 hover:bg-indigo-100 cursor-pointer opacity-40"
					)}
				>
					{item.icon}
				</button>
			))}
		</div>
	);
};

export default Chains;
