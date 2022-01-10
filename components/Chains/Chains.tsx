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
import { useMoralisData } from "../../hooks/useMoralisData";
import { useSolana } from "../../hooks/useSolana";

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
	const { switchNetwork, chainId, chain, account } = useChain();
	const { isAuthenticated, logout } = useMoralisData();
	const router = useRouter();
	const id = router.query.id;
	const [selected, setSelected] = useState<ChainItem | undefined>();
	const [isEthAddress, setIsEthAddress] = useState(false);
	const { publicKey } = useSolana();

	// state for modal open
	const [modalOpen, setModalOpen] = useState(false);

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

	if (!account || !!publicKey) {
		return null;
	}

	return (
		<div className="space-x-4 items-center hidden md:flex">
			<span className="text-gray-500 text-sm">Switch Chain:</span>
			{menuItems(!publicKey).map((item) => (
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
		</div>
	);
};

export default Chains;
