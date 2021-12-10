import React, { useEffect, useState } from "react";
import { Menu, Popover } from "@headlessui/react";
import { ArrowUpIcon, CheckIcon } from "@heroicons/react/solid";
import Image from "next/image";
import sampleprofilepic from "../assets/sampleprofilepic.png";
import { DuplicateIcon, LinkIcon } from "@heroicons/react/outline";
import { GetServerSideProps } from "next";
import { db } from "../utils/firebaseClient";
import { useUser } from "../utils/context";
import { sendTransaction } from "../utils/crypto";
import ProfileModal from "../components/ProfileModal";
import { Transaction } from "../contracts";
import { minimizeAddress, saveTransaction } from "../utils";
import SuccessTransactionModal from "../components/SuccessTransactionModal";
import Logo from "../components/Logo";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import Blockies from "react-blockies";

declare let window: any;

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export interface ProfileProps {
	transactions: Transaction[];
}

const Profile: React.FC<ProfileProps> = ({ transactions: allTransactions }) => {
	// edit modal state

	const [editModalOpen, setEditModalOpen] = useState(false);

	const [modalOpen, setModalOpen] = useState(false);
	const [price, setPrice] = useState<number>(0);
	const [message, setMessage] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const { user, authenticated, currentWallet, connectWallet, setUser } =
		useUser();

	// transaction data
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const [transactionDetails, setTransactionDetails] = useState(null);

	const [isCopied, setIsCopied] = useState(false);

	const handleCopyAddress = (address: string | undefined) => {
		if (!address) return;
		setIsCopied(true);
		copy(address);
		setTimeout(() => setIsCopied(false), 1500);
	};

	const handleSendTransaction = async () => {
		try {
			if (!user?.address) {
				throw new Error("No user address found");
			}

			setLoading(true);
			const response = await sendTransaction(
				user.address,
				message,
				price.toString()
			);

			setTransactionDetails(response);
			setModalOpen(true);
			setMessage("");
			setPrice(0);

			const transaction: Transaction = {
				...new Transaction(),
				to: user.address,
				from: currentWallet,
				id: response.hash,
				amount: price,
				message,
			};

			console.log({ transaction });
			await saveTransaction(transaction);
		} catch (error) {
			console.error(error);
			toast.error(error, { position: "top-center" });
		} finally {
			setLoading(false);
		}
	};

	const handleEtherScanRedirect = () => {
		if (transactionDetails?.hash) {
			window.open(
				`https://etherscan.io/tx/${transactionDetails.hash}`,
				"_blank"
			);
		}
	};

	useEffect(() => {
		if (!modalOpen) {
			setTransactionDetails(null);
		}
	}, [modalOpen]);

	useEffect(() => {
		setTransactions(allTransactions);
	}, [allTransactions]);

	const disableDonateButton =
		loading || !price || authenticated || !(window as any).ethereum;

	console.log(user);

	return (
		<>
			<div className="bg-gray-50 min-h-screen">
				<header className="bg-white shadow">
					<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
						<Popover className="flex justify-between h-16">
							<div className="flex px-2 lg:px-0">
								<div className="flex-shrink-0 flex items-center">
									<a href="#">
										<Logo />
									</a>
								</div>
							</div>
							<div className="hidden lg:ml-4 lg:flex lg:items-center">
								{/* Profile dropdown */}
								<Menu
									as="div"
									className="ml-4 relative flex-shrink-0"
								>
									<div>
										{currentWallet ? (
											<button
												type="button"
												className="inline-flex items-center px-3 py-2 border border-cryptoblue text-sm leading-4 font-medium rounded-md shadow-sm text-cryptoblue hover:bg-gray-100"
											>
												Contact Us
											</button>
										) : (
											<button
												type="button"
												onClick={() => connectWallet()}
												className="inline-flex items-center px-3 py-2 border border-cryptoblue text-sm leading-4 font-medium rounded-md shadow-sm text-cryptoblue hover:bg-gray-100"
											>
												Connect
											</button>
										)}
									</div>
								</Menu>
							</div>
						</Popover>
					</div>
				</header>

				<main className="py-10">
					{/* Page header */}
					<div className="max-w-7xl bg-white py-12 rounded-xl shadow-md mx-auto">
						<div className="mx-auto pb-12 border-b border-gray-300 px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
							<div className="flex items-center space-x-5">
								<div className="flex-shrink-0">
									<div className="relative">
										<Blockies seed={user?.address} size={9} scale={8} className='rounded-full'  />
										{/* {user?.profileImage ? (
											<img
												className="h-16 w-16 rounded-full"
												src={user?.profileImage}
												alt=""
											/>
										) : (
											<div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 cursor-pointer hover:bg-gray-200">
												<svg
													className="h-20 w-20 text-gray-300"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
												</svg>
											</div>
										)} */}
									</div>
								</div>
								<div data-tip={user?.id}>
									<h1 className="font-urbanist text-3xl font-bold text-gray-900">
										{!user ? (
											<div className="animate-pulse h-12 w-48 bg-gray-300 rounded-md" />
										) : (
											user?.ens ??
											minimizeAddress(user?.address)
										)}
									</h1>
									{/* <p className="text-sm font-medium text-gray-500">
										{user?.id}
									</p> */}
								</div>
							</div>
							<div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-8">
								<button
									className="flex items-center"
									onClick={() =>
										handleCopyAddress(user?.address)
									}
								>
									{isCopied ? (
										<CheckIcon className="text-green-600 w-6 h-6 mr-2" />
									) : (
										<DuplicateIcon className="w-6 h-6 mr-2" />
									)}
									Copy Wallet Address
								</button>
								{authenticated && (
									<>
										<button
											className="flex items-center border border-cryptoblue rounded-md border-solid px-5 py-2.5 text-cryptoblue hover:bg-gray-100"
											onClick={() => {
												copy(window.location.href);
												toast.success(
													"Copied to clipboard!",
													{ position: "top-center" }
												);
											}}
										>
											Copy Page Link
											<LinkIcon className="w-5 h-5 ml-2" />
										</button>
										<button className="flex items-center border border-twitterblue rounded-md border-solid px-5 py-2.5 text-twitterblue hover:bg-gray-100">
											Tweet This
											<svg
												className="ml-2"
												width="20"
												height="20"
												viewBox="0 0 15 12"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M14.1673 0.673342C13.5007 1.00001 12.8473 1.13268 12.1673 1.33334C11.42 0.490009 10.312 0.443342 9.24732 0.842009C8.18265 1.24068 7.48532 2.21534 7.50065 3.33334V4.00001C5.33732 4.05534 3.41065 3.07001 2.16732 1.33334C2.16732 1.33334 -0.620682 6.28868 4.83398 8.66668C3.58598 9.49801 2.34132 10.0587 0.833984 10C3.03932 11.202 5.44265 11.6153 7.52332 11.0113C9.90998 10.318 11.8713 8.52934 12.624 5.85001C12.8485 5.03512 12.96 4.19325 12.9553 3.34801C12.954 3.18201 13.962 1.50001 14.1673 0.672675V0.673342Z"
													stroke="#1DA1F2"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										</button>
									</>
								)}
							</div>
						</div>

						<div className="mt-8 mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
							<div className="space-y-6 lg:col-start-1 lg:col-span-2">
								{/* Description list*/}
								{/* {user?.description && <section aria-labelledby="applicant-information-title">
									<div className="bg-white shadow sm:rounded-lg">
										<div className="px-4 py-5 sm:px-6">
											<h2
												id="applicant-information-title"
												className="text-lg leading-6 font-medium text-gray-900"
											>
												{user.description}
											</h2>
										</div>
									</div>
								</section>} */}

								{/* Comments*/}
								{!!transactions?.length && (
									<section aria-labelledby="notes-title">
										<div className="bg-white sm:rounded-lg sm:overflow-hidden">
											<div className="px-4 py-5 sm:px-6">
												<h2
													id="notes-title"
													className="text-xl font-urbanist font-bold text-gray-900"
												>
													Recent Supporters 🤝
												</h2>
											</div>
											<div className="px-4 pb-6 sm:px-6">
												<ul
													role="list"
													className="space-y-8"
												>
													{transactions.map(
														(
															transaction,
															index
														) => (
															<li
																key={index}
																className="relative p-8 pb-9 bg-faintblue rounded-xl border border-cryptoblue"
															>
																<div className="flex space-x-3">
																	<div className="flex-shrink-0">
																		<Blockies seed={transaction?.from} size={9} scale={8} className='rounded-full' /> 
																	</div>
																	<div>
																		<div className="text-lg">
																			<span
																				data-tip={
																					transaction?.from
																				}
																			>
																				{`${minimizeAddress(
																					transaction?.from
																				)} `}
																			</span>
																			bought
																			you
																			a
																			CryptoCoffee🎉
																		</div>
																		<div className="inline-block mr-1 font-urbanist font-semibold text-base">
																			{`${transaction?.amount}`}
																		</div>
																		Ξ
																	</div>
																</div>
																{!!transaction
																	?.message
																	.length && (
																	<>
																		<div className="w-0 ml-5 mt-6 border-8 border-transparent border-b-8 border-b-white" />
																		<div className="bg-white rounded-md w-max p-4 text-base text-gray-700">
																			<p>
																				{
																					transaction.message
																				}
																			</p>
																		</div>
																	</>
																)}
																<a
																	className="cursor-pointer absolute flex items-center justify-center rounded-full w-6 h-6 bg-cryptoblue right-4 bottom-4"
																	href={`https://etherscan.io/tx/${transaction?.id}`}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	<ArrowUpIcon className="w-4 h-4 rotate-45 text-white" />
																</a>
															</li>
														)
													)}
												</ul>
											</div>
										</div>
									</section>
								)}
							</div>

							<section
								aria-labelledby="timeline-title"
								className="lg:col-start-3 lg:col-span-1"
							>
								<div className="bg-white border border-gray-200 sm:rounded-lg">
									{/* {!widget ? ( */}
									<div className="h-full">
										<div className="font-urbanist font-bold px-6 py-4 text-lg border-b border-gray-200">
											Support the Creator 🤝
										</div>
										<div className="flex px-6 pt-7 font-urbanist font-normal items-center justify-between">
											<span>Enter ETH Amount:</span>
											<div className="flex items-center">
												<div className="mt-1 flex rounded-md shadow-sm">
													<input
														value={price}
														min={0}
														onChange={(e) =>
															!isNaN(
																Number(
																	e.target
																		.value
																)
															) &&
															setPrice(
																Number(
																	e.target
																		.value
																)
															)
														}
														type="number"
														className="flex-1 min-w-0 block w-36 px-3 py-2 rounded-md sm:text-sm border-gray-300 text-right"
														placeholder="0"
													/>
												</div>
											</div>
										</div>

										<div className="font-urbanist pt-8 px-6">
											<label
												htmlFor="comment"
												className="block text-gray-700"
											>
												Add your comment (Optional)
											</label>
											<div className="mt-1">
												<textarea
													value={message}
													onChange={(e) =>
														setMessage(
															e.target.value
														)
													}
													rows={4}
													name="comment"
													id="comment"
													className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
												/>
											</div>
											<button
												onClick={() =>
													handleSendTransaction()
												}
												type="button"
												disabled={disableDonateButton}
												className={`mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full text-center ${
													disableDonateButton
														? " bg-indigo-300 cursor-not-allowed "
														: " bg-indigo-600 hover:bg-indigo-700 "
												}`}
											>
												Support Now ({price} ETH)
											</button>
										</div>
									</div>
									{/* ) : (
										<div className="flex flex-col items-center h-full">
											<WidgetComponent
												firstName={widget.firstName}
												widgetColor={widget.widgetColor}
												availableWallets={widget.wallet_address.filter(
													(wallet) =>
														!!wallet.public_address
															.length
												)}
											/>
										</div>
									)} */}
								</div>
							</section>
						</div>
					</div>
				</main>
			</div>
			<SuccessTransactionModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Transaction successful"
				onOk={handleEtherScanRedirect}
				okText="View on Etherscan"
			/>
			<ProfileModal
				open={editModalOpen}
				onClose={() => setEditModalOpen(false)}
				userAddress={user?.id}
			/>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const userAddress = context.params.id;

	const transactionsResponse = await db
		.collection("transactions")
		.where("to", "==", userAddress)
		.get();

	const transactions: Transaction[] = transactionsResponse.docs.map((doc) => {
		const data = doc.data();
		return {
			...(data as Transaction),
			id: doc.id,
		};
	});

	return {
		props: {
			transactions,
		},
	};
};

export default Profile;
