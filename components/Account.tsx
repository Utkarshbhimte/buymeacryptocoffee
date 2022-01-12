import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import router from "next/router";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { useChain } from "react-moralis";
import { AuthenticateOptions } from "react-moralis/lib/hooks/core/useMoralis/_useMoralisAuth";
import { getEllipsisTxt } from "../helpers/formatters";
import { getExplorer } from "../helpers/networks";
import { useMoralisData } from "../hooks/useMoralisData";
import { useSolana } from "../hooks/useSolana";
import { useEnsAddress } from "../utils/useEnsAddress";
import Blockie from "./Blockie";
import { MetamaskLogo, SolanaLogo } from "./Chains/Logos";
import Loader from "./Loader";
import Modal from "./Modal";
import WalletModal from "./WalletModal";

function Account() {
	const { authenticate, isAuthenticated, logout, account, chainId, user } =
		useMoralisData();
	const { switchNetwork } = useChain();
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const { wallets, publicKey, select, disconnect } = useSolana();
	const { name: ensAddress, avatar } = useEnsAddress(account);

	const handleAuth = async () => {
		try {
			setLoading(true);
			const options: AuthenticateOptions = {
				signingMessage: `
					Get your audience support with crypto!\n
					With BuyMeACryptoCoffee your audience can support you with cryptocurrency.\n
					How does it work?\n
					- Supporter connects their Wallet on Crypto Coffee
					- They enter their favorite creator’s wallet address and donate crypto.
					- Creators can create their own crypto coffee page and share with their audience too
				`,
			};

			if (!(window as any).ethereum) {
				console.log("no ethereum");
				options.provider = "walletconnect";
			}

			await authenticate(options);
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className=" bg-gray-200 rounded-lg px-2 py-3 w-48 flex justify-center">
				<Loader />
			</div>
		);
	}

	const handleCheckoutPageRedirect = () => {
		if (!!publicKey) {
			router.push(`/${publicKey}`);
		}

		if (!!account) {
			router.push(`/${account}`);
		}
	};

	const handleLogout = () => {
		if (publicKey) {
			disconnect();
		}

		if (!!account) {
			console.log("called");
			logout();
		}
	};
	const handleSwitchToEth = async () => {
		await handleAuth();
		disconnect();
	};
	const handleSwitchToSolana = async () => {
		logout();
		setModalOpen(true);
	};

	if (!isAuthenticated && !publicKey) {
		return (
			<>
				<Menu as="div" className="relative inline-block text-left">
					<div>
						<Menu.Button className="inline-flex justify-center items-center space-x-2 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cryptopurple">
							Connect Wallet
							<ChevronDownIcon
								className="-mr-1 ml-2 h-5 w-5"
								aria-hidden="true"
							/>
						</Menu.Button>
					</div>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
							<div className="py-1">
								<Menu.Item>
									{({ active }) => (
										<div
											onClick={handleAuth}
											className={classNames(
												active
													? "bg-gray-100 text-gray-900"
													: "text-gray-700",
												" px-4 py-2 text-sm flex items-center cursor-pointer space-x-4"
											)}
										>
											<MetamaskLogo /> <div>Metamask</div>
										</div>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
										<div
											onClick={() => setModalOpen(true)}
											className={classNames(
												active
													? "bg-gray-100 text-gray-900"
													: "text-gray-700",
												" px-4 py-2 text-sm flex items-center cursor-pointer space-x-4"
											)}
										>
											<SolanaLogo /> <div>Solana</div>
										</div>
									)}
								</Menu.Item>
							</div>
						</Menu.Items>
					</Transition>
				</Menu>
				<Modal
					title="Connect wallet"
					onClose={() => setModalOpen(false)}
					open={modalOpen}
				>
					{wallets.map((wallet) => {
						return (
							<div
								key={(wallet as any).name}
								className="cursor-pointer"
								onClick={() => {
									setModalOpen(false);
									select(wallet.adapter.name);
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
			</>
		);
	}

	return (
		<>
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button className="inline-flex justify-center items-center space-x-2 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cryptopurple">
						{!publicKey && !!avatar && (
							<img src={avatar} className="h-6 w-6 rounded-lg" />
						)}
						{!publicKey && !!account && !avatar && (
							<Blockie currentWallet scale={3} />
						)}
						{!publicKey && (
							<p className="m-0">
								{ensAddress || getEllipsisTxt(account, 6)}
							</p>
						)}
						{publicKey && (
							<p className="m-0">
								{getEllipsisTxt(publicKey, 6)}
							</p>
						)}
						<ChevronDownIcon
							className="-mr-1 ml-2 h-5 w-5"
							aria-hidden="true"
						/>
					</Menu.Button>
				</div>

				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="py-1">
							<Menu.Item>
								{({ active }) => (
									<div
										onClick={handleCheckoutPageRedirect}
										className={classNames(
											active
												? "bg-gray-100 text-gray-900"
												: "text-gray-700",
											"block px-4 py-2 text-sm"
										)}
									>
										Checkout your page
									</div>
								)}
							</Menu.Item>
							{!publicKey && (
								<>
									<div className="block md:hidden">
										{chainId == "0x1" && (
											<Menu.Item>
												{({ active }) => (
													<a
														onClick={() =>
															switchNetwork(
																"0x89"
															)
														}
														className={classNames(
															active
																? "bg-gray-100 text-gray-900"
																: "text-gray-700",
															"block px-4 py-2 text-sm"
														)}
													>
														Switch to Polygon
													</a>
												)}
											</Menu.Item>
										)}

										{chainId !== "0x1" && (
											<Menu.Item>
												{({ active }) => (
													<a
														onClick={() =>
															switchNetwork("0x1")
														}
														className={classNames(
															active
																? "bg-gray-100 text-gray-900"
																: "text-gray-700",
															"block px-4 py-2 text-sm"
														)}
													>
														Switch to Ethereum
													</a>
												)}
											</Menu.Item>
										)}
									</div>
									<Menu.Item>
										{({ active }) => (
											<div
												onClick={handleSwitchToSolana}
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												Switch to Solana
											</div>
										)}
									</Menu.Item>

									<Menu.Item>
										{({ active }) => (
											<a
												href={`${getExplorer(
													chainId
												)}address/${account}`}
												target="_blank"
												rel="noreferrer"
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												{chainId === "0x1"
													? "View on Etherscan"
													: "View on PolygonScan"}
											</a>
										)}
									</Menu.Item>
								</>
							)}
							{publicKey && (
								<>
									<Menu.Item>
										{({ active }) => (
											<div
												onClick={handleSwitchToEth}
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												Switch to Ethereum
											</div>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<a
												href={`https://explorer.solana.com/address/${publicKey}`}
												target="_blank"
												rel="noreferrer"
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												View on Explorer
											</a>
										)}
									</Menu.Item>
								</>
							)}
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={handleLogout}
										type="submit"
										className={classNames(
											active
												? "bg-gray-100 text-gray-900"
												: "text-gray-700",
											"block w-full text-left px-4 py-2 text-sm"
										)}
									>
										Sign out
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
			<WalletModal
				visible={modalOpen}
				onClose={() => setModalOpen(false)}
				onSubmit={() => setModalOpen(false)}
			/>
		</>
	);
}

export default Account;
