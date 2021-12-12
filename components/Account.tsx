import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMoralis } from "react-moralis";
import { AuthenticateOptions } from "react-moralis/lib/hooks/core/useMoralis/_useMoralisAuth";
import { getEllipsisTxt } from "../helpers/formatters";
import { getExplorer } from "../helpers/networks";
import Blockie from "./Blockie";
import Loader from "./Loader";
import Link from "next/link";
import { useEnsAddress } from "../utils/useEnsAddress";

const styles = {
	account: {
		height: "42px",
		padding: "0 15px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "fit-content",
		borderRadius: "12px",
		backgroundColor: "rgb(244, 244, 244)",
		cursor: "pointer",
	},
	text: {
		color: "#21BF96",
	},
};

function Account() {
	const { authenticate, isAuthenticated, logout, account, chainId } =
		useMoralis();
	const [loading, setLoading] = useState(false);
	// const [ensAddress, setEnsAddress] = useState<string | null>(null);
	const ensAddress = useEnsAddress(account);

	const handleAuth = async () => {
		try {
			setLoading(true);
			const options: AuthenticateOptions = {
				signingMessage: "Hello World!",
			};

			if (!(window as any).ethereum) {
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

	if (!isAuthenticated) {
		return (
			<button
				type="button"
				onClick={handleAuth}
				className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cryptopurple hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cryptopurple"
			>
				Connect Wallet
			</button>
		);
	}

	return (
		<>
			<Menu as="div" className="relative inline-block text-left z-40">
				<div>
					<Menu.Button className="inline-flex justify-center items-center space-x-2 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cryptopurple">
						<Blockie currentWallet scale={3} />
						<p>{ensAddress || getEllipsisTxt(account, 6)}</p>
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
						<div className="py-1 z-20">
							<Menu.Item>
								{({ active }) => (
									<a
										className={classNames(
											active
												? "bg-gray-100 text-gray-900"
												: "text-gray-700",
											"block px-4 py-2 text-sm"
										)}
									>
										<Link href={`/${account}`}>
											Checkout your page
										</Link>
									</a>
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
										View on Etherscan
									</a>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={logout}
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
		</>
	);
}

export default Account;
