import { useEffect } from "react";
import { useState } from "react";
import { getEllipsisTxt } from "../helpers/formatters";
import Blockie from "./Blockie";
// import "./identicon.css";
import { useMoralis } from "react-moralis";
import { useMoralisData } from "../hooks/useMoralisData";

const styles = {
	address: {
		height: "36px",
		display: "flex",
		gap: "5px",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: "9px",
		alignItems: "center",
	},
};

interface AddressProps {
	address?: string;
	avatar: string;
	size: number;
	copyable: boolean;
}
const Address: React.FC<AddressProps> = (props) => {
	const { account, user } = useMoralisData();

	const [address, setAddress] = useState<string | undefined>();
	const [isClicked, setIsClicked] = useState(false);

	useEffect(() => {
		const currAccount = props?.address || account;
		setAddressWithEns(currAccount);
	}, [account, props]);

	const setAddressWithEns = async (address: string) => {
		// get ens name of the address
		const ensResponse = await fetch("/api/resolve-wallet`").then((res) =>
			res.json()
		);

		setAddress(ensResponse.name);
	};

	if (!address) return <span>Loading...</span>;

	const Copy = (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="26"
			height="26"
			viewBox="0 0 24 24"
			strokeWidth="2"
			stroke="#1780FF"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			style={{ cursor: "pointer" }}
			onClick={() => {
				navigator.clipboard.writeText(address);
				setIsClicked(true);
			}}
			{...props}
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M15 3v4a1 1 0 0 0 1 1h4" />
			<path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" />
			<path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
			<title id="copy-address">Copy Address</title>
		</svg>
	);

	return (
		<div className="flex items-center space-x-2 p-2 rounded-lg focus:bg-gray-100 hover:bg-gray-100">
			{address && props.avatar === "left" && (
				<Blockie address={address} size={7} />
			)}
			<p className="mb-0">
				{props.size ? getEllipsisTxt(address, props.size) : address}
			</p>
			{address && props.avatar === "right" && (
				<Blockie address={address} size={7} />
			)}
			{props.copyable &&
				(isClicked ? (
					<Check className="h-4 w-4" />
				) : (
					<Copy className="h-4 w-4" />
				))}
		</div>
	);
};

export default Address;

const Check = (props) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		strokeWidth="3"
		stroke="#21BF96"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M5 12l5 5l10 -10" />
		<title id="copied-address">Copied!</title>
	</svg>
);
