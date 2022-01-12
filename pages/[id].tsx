import { DuplicateIcon } from "@heroicons/react/outline";
import { CheckIcon } from "@heroicons/react/solid";
import { useWallet } from "@solana/wallet-adapter-react";
import { Modal } from "antd";
import copy from "copy-to-clipboard";
import { ethers } from "ethers";
import WAValidator from "multicoin-address-validator";
import { GetStaticProps } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Blockies from "react-blockies";
import { useCollection } from "react-firebase-hooks/firestore";
import { AuthenticateOptions } from "react-moralis/lib/hooks/core/useMoralis/_useMoralisAuth";
import { toast } from "react-toastify";
import PaymentSection from "../components/PaymentSection";
import SolanaPaymentSection from "../components/SolanaPaymentSection";
import Transactions from "../components/Transactions";
import WalletModal from "../components/WalletModal";
import { Transaction } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";
import embedbadge from "../public/embedbadge.svg";
import {
	getOrCreateUser,
	getUser,
	mergeAddresses,
	minimizeAddress,
} from "../utils";
import { useUser } from "../utils/context";
import { validateAndResolveAddress } from "../utils/crypto";
import { db } from "../utils/firebaseClient";
import { useEnsAddress } from "../utils/useEnsAddress";

declare let window: any;

export interface ProfileProps {
	transactions: Transaction[];
	profileAddress: string;
	ens?: string;
	avatar?: string;
	isEthereumAddress?: boolean;
}

const Profile: React.FC<ProfileProps> = ({
	transactions: allTransactions,
	profileAddress,
	ens,
	avatar: defaultAvatar,
	isEthereumAddress,
}) => {
	const { name: currProfileEns, avatar } = useEnsAddress(profileAddress) || {
		currProfileEns: ens,
		avatar: defaultAvatar,
	};
	const [modalOpen, setModalOpen] = useState(false);
	const {
		account,
		isAuthenticated,
		isWeb3Enabled,
		enableWeb3,
		authenticate,
	} = useMoralisData();
	const { user } = useUser();
	const { publicKey, connected, connect } = useWallet();

	const isMergedAccount =
		!!user?.ethAddress?.length && !!user?.solAddress?.length;

	const isOwner = isMergedAccount
		? publicKey?.toString() === user?.solAddress ||
		  account === user?.ethAddress
		: (account === profileAddress && isAuthenticated) ||
		  publicKey?.toString() === profileAddress;

	const shouldShowButton =
		(isOwner && isAuthenticated && !user?.solAddress?.length) ||
		(publicKey?.toString() && !user?.ethAddress?.length);

	const walletNotConnected = !connected && !isAuthenticated;

	const currentWallet = connected ? "SOL" : isAuthenticated ? "ETH" : "";

	const shouldShowEthereum =
		(isMergedAccount && currentWallet === "ETH") ||
		(!isMergedAccount && isEthereumAddress);

	const addressTx = [
		user?.ethAddress?.toString()?.toLowerCase(),
		user?.solAddress?.toString()?.toLowerCase(),
	].filter((a) => !!a);

	const [snapshot] = useCollection(
		!!addressTx.length &&
			db.collection("transactions").where("to", "in", addressTx)
	);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isCopied, setIsCopied] = useState(false);
	const [isScriptCopied, setIsScriptCopied] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isClaiming, setIsClaiming] = useState("");
	const [isMerging, setIsMerging] = useState(false);

	const handleCopyAddress = () => {
		if (!profileAddress) return;
		setIsCopied(true);
		copy(profileAddress);
		setTimeout(() => setIsCopied(false), 1500);
	};

	const handleTransactionChange = (transactions: Transaction[]) => {
		const sortedTransactions = transactions.sort((a, b) => {
			return b.timestamp - a.timestamp;
		});

		setTransactions(sortedTransactions);
	};

	const handleClaim = async (claiming: "SOL" | "ETH") => {
		if (claiming === "SOL") {
			if (!connected) {
				setIsClaiming("SOL");
				setModalOpen(true);
				return;
			}
			onSubmit(publicKey.toString());
		} else {
			if (!isAuthenticated) {
				setIsClaiming("ETH");
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
				return;
			}
			onSubmit(account);
		}
	};

	const onSubmit = async (address: string) => {
		setIsMerging(true);
		try {
			const userToMergeAndDelete = await getOrCreateUser(address, true);
			const isMerged = await mergeAddresses(
				user,
				account,
				publicKey.toString(),
				userToMergeAndDelete.id
			);
			if (isMerged) {
				toast.success("Claiming done successfully");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setModalOpen(false);
			setIsClaiming("");
			setIsMerging(false);
		}
	};

	useEffect(() => {
		handleTransactionChange(allTransactions);
	}, [allTransactions]);

	useEffect(() => {
		if (snapshot) {
			handleTransactionChange(
				snapshot.docs.map((doc) => ({
					...(doc.data() as Transaction),
					id: doc.id,
				}))
			);
		}
	}, [snapshot]);

	useEffect(() => {
		if (isClaiming === "SOL" && !!publicKey) {
			onSubmit(publicKey?.toString());
		} else if (isClaiming === "ETH" && !!account) {
			onSubmit(account);
		}
	}, [isClaiming, publicKey, account]);

	const twitterIntent = `
		You%20can%20support%20by%20donating%20some%20CryptoCoffee%20(%E2%98%95%EF%B8%8F)%20here%20%E2%80%94%0Ahttps://buymeacryptocoffee.xyz/${profileAddress}%0ACreate%20your%20own%20page%20%40buycryptocoffee
	`;

	const script = `<script type="text/javascript" src="https://buymeacryptocoffee.xyz/buttonwidget.js" data-address="${profileAddress}" data-name="crypto-coffee-button" ></script>`;

	const copyEmbedButtonScript = () => {
		if (!profileAddress) return;
		setIsScriptCopied(true);
		copy(script);
		setTimeout(() => setIsScriptCopied(false), 1500);
	};

	useEffect(() => {
		if (!isWeb3Enabled && isAuthenticated && !(window as any).ethereum) {
			enableWeb3({
				provider: "walletconnect",
			});
		}
	}, [!!isWeb3Enabled, isAuthenticated, account]);

	return (
		<>
			<div className="bg-gray-50 min-h-screen">
				{/* Page header */}
				<div className="w-full bg-cryptopurple h-64" />
				<div className="max-w-6xl max-lg:mx-2 mx-auto rounded-xl py-12 ">
					<div className="-mt-64 mx-auto grid grid-cols-1 gap-6 sm:px-6 xs:px-0 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
						<div className="space-y-6 p-8 xs:p-4 rounded-lg bg-white shadow-md lg:col-start-1 lg:col-span-2 border border-gray-300">
							<div className="flex justify-between items-center sm:hidden">
								<div className="flex items-center space-x-5">
									<div className="flex-shrink-0">
										{avatar && (
											<img
												src={avatar}
												alt={profileAddress}
												className="h-16 w-16 rounded-full"
											/>
										)}
										{!avatar && (
											<Blockies
												seed={profileAddress}
												size={9}
												scale={8}
												className="rounded-full"
											/>
										)}
									</div>
									<div className="group">
										<h1 className="font-urbanist text-3xl font-bold text-gray-900 mb-1">
											{/* <div className="animate-pulse h-12 w-48 bg-gray-300 rounded-md" /> */}
											{isMerging
												? "Merging..."
												: user?.name ??
												  currProfileEns ??
												  minimizeAddress(
														profileAddress
												  )}
										</h1>
										{!!currProfileEns && (
											<div
												onClick={handleCopyAddress}
												className="flex space-x-2 items-center"
											>
												<p className="text-xs font-medium text-gray-500 p-1 bg-gray-100 inline-block px-3 cursor-pointer hover:bg-indigo-100 transition duration-300 ease-in-out rounded-md">
													{minimizeAddress(
														profileAddress
													)}
												</p>
												{/* <DuplicateIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition ease-in-out duration-300 text-cryptopurple" /> */}
												<div className="w-5 h-5 rounded-full bg-lightpurple text-cryptopurple flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
													{isCopied ? (
														<CheckIcon />
													) : (
														<DuplicateIcon
															onClick={
																handleCopyAddress
															}
														/>
													)}
												</div>
											</div>
										)}
									</div>
								</div>
								<div className="flex space-x-4">
									{shouldShowButton && (
										<button
											onClick={() =>
												handleClaim(
													isEthereumAddress
														? "SOL"
														: "ETH"
												)
											}
										>
											{`Claim Your ${
												isEthereumAddress
													? "SOL"
													: "ETH"
											} Page`}
										</button>
									)}
									<a
										className="w-12 h-12 rounded-full bg-lightpurple flex items-center justify-center"
										href={`https://twitter.com/intent/tweet?text=${twitterIntent}`}
										target="_blank"
										rel="noreferrer noopener"
									>
										<svg
											width="22"
											height="18"
											viewBox="0 0 22 18"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M21 1.01001C20 1.50001 19.02 1.69901 18 2.00001C16.879 0.735013 15.217 0.665013 13.62 1.26301C12.023 1.86101 10.977 3.32301 11 5.00001V6.00001C7.755 6.08301 4.865 4.60501 3 2.00001C3 2.00001 -1.182 9.43301 7 13C5.128 14.247 3.261 15.088 1 15C4.308 16.803 7.913 17.423 11.034 16.517C14.614 15.477 17.556 12.794 18.685 8.77501C19.0218 7.55268 19.189 6.28987 19.182 5.02201C19.18 4.77301 20.692 2.25001 21 1.00901V1.01001Z"
												stroke="#9366F9"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</a>
								</div>
							</div>
							<div className="mt-8 border-b -mx-8 xs:hidden" />

							{/* Comments*/}
							<section aria-labelledby="notes-title">
								<Transactions
									transactions={transactions}
									twitterIntent={twitterIntent}
								/>
							</section>
						</div>

						<section
							aria-labelledby="timeline-title"
							className={`${
								isOwner ? "grid grid-cols-1 gap-4" : ""
							} lg:col-start-3 lg:col-span-1 sm:row-span-full`}
						>
							<div className="sm:bg-white sm:border border-gray-200 rounded-lg">
								<div className="hidden sm:p-6 justify-between items-center sm:flex">
									<div className="flex items-center space-x-5">
										<div className="flex-shrink-0">
											{avatar && (
												<img
													src={avatar}
													alt={profileAddress}
													className="h-16 w-16 rounded-full"
												/>
											)}
											{!avatar && (
												<Blockies
													seed={profileAddress}
													size={9}
													scale={8}
													className="rounded-full"
												/>
											)}
										</div>
										<div className="group">
											<h1 className="font-urbanist text-2xl font-bold text-gray-900 mb-1">
												{/* <div className="animate-pulse h-12 w-48 bg-gray-300 rounded-md" /> */}
												{currProfileEns ??
													minimizeAddress(
														profileAddress
													)}
											</h1>
											{!!currProfileEns && (
												<div className="flex space-x-2 items-center">
													<p
														onClick={
															handleCopyAddress
														}
														className="text-xs font-medium text-gray-500 p-1 bg-gray-100 inline-block px-3 cursor-pointer hover:bg-indigo-100 transition duration-300 ease-in-out rounded-md"
													>
														{minimizeAddress(
															profileAddress
														)}
													</p>
													{/* <DuplicateIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition ease-in-out duration-300 text-cryptopurple" /> */}
													<div
														onClick={
															handleCopyAddress
														}
														className="w-5 h-5 rounded-full bg-lightpurple text-cryptopurple flex items-center justify-center cursor-pointer"
													>
														{isCopied ? (
															<CheckIcon />
														) : (
															<DuplicateIcon
																onClick={
																	handleCopyAddress
																}
															/>
														)}
													</div>

													<a
														href={`https://twitter.com/intent/tweet?text=${twitterIntent}`}
														target="_blank"
														rel="noreferrer noopener"
														className="w-5 h-5 rounded-full bg-lightpurple text-cryptopurple flex items-center justify-center cursor-pointer"
													>
														<svg
															className="w-5 h-5"
															viewBox="0 0 22 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M21 1.01001C20 1.50001 19.02 1.69901 18 2.00001C16.879 0.735013 15.217 0.665013 13.62 1.26301C12.023 1.86101 10.977 3.32301 11 5.00001V6.00001C7.755 6.08301 4.865 4.60501 3 2.00001C3 2.00001 -1.182 9.43301 7 13C5.128 14.247 3.261 15.088 1 15C4.308 16.803 7.913 17.423 11.034 16.517C14.614 15.477 17.556 12.794 18.685 8.77501C19.0218 7.55268 19.189 6.28987 19.182 5.02201C19.18 4.77301 20.692 2.25001 21 1.00901V1.01001Z"
																stroke="#9366F9"
																strokeWidth="1.5"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</a>
												</div>
											)}
										</div>
									</div>
								</div>
								{!walletNotConnected && (
									<>
										{shouldShowEthereum ? (
											<PaymentSection
												profileAddress={profileAddress}
											/>
										) : (
											<SolanaPaymentSection
												profileAddress={profileAddress}
											/>
										)}
									</>
								)}
							</div>
							{isOwner && (
								<div className="bg-white border font-urbanist border-gray-200 rounded-lg p-8 shadow-md sm:hidden">
									<h1 className="text-xl font-bold mb-1">
										Are you a Creator?
									</h1>
									<p className="text-base mb-8">
										Install CryptoCoffee badge on your
										website and redirect your audience!
									</p>
									<button
										className="border-cryptopurple border text-cryptopurple rounded-md w-full py-3 text-lg"
										onClick={() => setIsModalVisible(true)}
									>
										Get embed code
									</button>
								</div>
							)}
						</section>
					</div>
				</div>
				<Modal
					visible={isModalVisible}
					onCancel={() => setIsModalVisible(false)}
					className="embed-modal"
					width={1032}
					bodyStyle={{
						borderRadius: "10px",
					}}
					title={
						<div className="font-urbanist">
							<h3 className="font-bold text-xl mb-1">
								Embed CryptoCoffee
							</h3>
							<p>
								Copy and paste the code below to send your
								website's visitors to your cryptocoffee page!
							</p>
						</div>
					}
					footer={null}
				>
					<div className="flex flex-col items-center justify-center">
						<Image src={embedbadge} />
						<div className="mt-8 relative mb-8 mx-8 border border-cryptopurple bg-lightpurple rounded-md py-8 px-12 font-urbanist text-lg">
							{script}
							<button
								className="flex absolute right-4 bottom-3 items-center text-lg text-cryptopurple"
								onClick={copyEmbedButtonScript}
								disabled={isScriptCopied}
							>
								{isScriptCopied ? (
									<CheckIcon className="w-6 h-6 mr-2" />
								) : (
									<DuplicateIcon className="w-6 h-6 mr-2" />
								)}
								Copy Code
							</button>
						</div>
					</div>
				</Modal>
				<WalletModal
					visible={modalOpen}
					onClose={() => setModalOpen(false)}
					onSubmit={console.log}
				/>
			</div>
		</>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const userAddress = context.params.id;

	const user = await getUser(String(userAddress));

	const addressTx = [
		user?.ethAddress?.toString()?.toLowerCase(),
		user?.solAddress?.toString()?.toLowerCase(),
	].filter((a) => !!a);

	const isEthereumAddress =
		WAValidator.validate(String(userAddress), "ETH") ||
		userAddress.includes(".eth");

	let address = userAddress;
	let name, avatar;
	if (isEthereumAddress) {
		const mainnetEndpoint =
			"https://speedy-nodes-nyc.moralis.io/d35afcfb3d409232f26629cd/eth/mainnet";
		const provider = new ethers.providers.JsonRpcProvider(mainnetEndpoint);

		const {
			address: ethAddress,
			name: ensName,
			avatar: ensAvatar,
		} = await validateAndResolveAddress(userAddress.toString(), true);

		address = ethAddress;
		name = name;
		avatar = ensAvatar;
	}

	const transactionsResponse = await db
		.collection("transactions")
		.where("to", "in", addressTx)
		.get();

	const transactions: Transaction[] = transactionsResponse.docs.map((doc) => {
		const data = doc.data();
		return {
			...(data as Transaction),
			id: doc.id,
		};
	});

	return {
		revalidate: 60,
		props: {
			transactions,
			profileAddress: address,
			ens: name ?? "",
			avatar: avatar ?? "",
			isEthereumAddress,
		},
	};
};

export async function getStaticPaths() {
	return { paths: [], fallback: "blocking" };
}

export default Profile;
