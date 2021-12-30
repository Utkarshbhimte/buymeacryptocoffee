import { useEffect, useState } from "react";
import Image from "next/image";
import { SolanaLogo, PolygonLogo, BSCLogo, ETHLogo } from "./Logos";
import { useChain, useMoralis } from "react-moralis";
import classNames from "classnames";

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
		key: "000",
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

	useEffect(() => {
		if (!chainId) return null;
		const newSelected = menuItems.find((item) => item.key === chainId);
		setSelected(newSelected);
	}, [chainId]);

	const handleMenuClick = (key: string) => {
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
