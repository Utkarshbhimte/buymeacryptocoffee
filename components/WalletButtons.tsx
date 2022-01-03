import {
	WalletDisconnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import React from "react";

const WalletButton = () => {
	return (
		<>
			<WalletDisconnectButton />
			<WalletMultiButton />
		</>
	);
};

export default WalletButton;
