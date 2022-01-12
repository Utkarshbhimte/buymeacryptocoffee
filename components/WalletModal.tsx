import React from "react";
import { useSolana } from "../hooks/useSolana";
import Modal from "./Modal";

export interface WalletModalProps {
	readonly onClose: () => void;
	readonly onSubmit: () => void;
	readonly visible: boolean;
}

const WalletModal: React.FC<WalletModalProps> = ({
	onClose,
	visible,
	onSubmit,
}) => {
	const { wallets, select, wallet } = useSolana();

	return (
		<Modal title="Connect wallet" onClose={onClose} open={visible}>
			{wallets.map((wallet) => {
				return (
					<div
						key={(wallet as any).name}
						className="cursor-pointer"
						onClick={() => {
							select(wallet.adapter.name);
							onSubmit();
						}}
					>
						{wallet.adapter.name}
					</div>
				);
			})}
			{!wallets.length && (
				<div>No solana wallets present to authenticate</div>
			)}
		</Modal>
	);
};

export default WalletModal;
