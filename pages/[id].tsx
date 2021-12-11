import { DuplicateIcon, LinkIcon } from "@heroicons/react/outline";
import { ArrowUpIcon, CheckIcon } from "@heroicons/react/solid";
import copy from "copy-to-clipboard";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import Blockies from "react-blockies";
import { toast } from "react-toastify";
import ProfileModal from "../components/ProfileModal";
import { Transaction } from "../contracts";
import { minimizeAddress, saveTransaction } from "../utils";
import { useUser } from "../utils/context";
import { sendTransaction } from "../utils/crypto";
import { db } from "../utils/firebaseClient";

declare let window: any;

export interface ProfileProps {
	transactions: Transaction[];
}

const Profile: React.FC<ProfileProps> = ({ transactions: allTransactions }) => {
	// edit modal state

	const [editModalOpen, setEditModalOpen] = useState(false);

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
			toast.success(
				<div className="flex items-center">
					Transaction Successful!
					<a
						className="cursor-pointer ml-2 flex items-center justify-center rounded-full w-5 h-5 bg-cryptoblue"
						href={`https://etherscan.io/tx/${response?.hash}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<ArrowUpIcon className="w-3 h-3 rotate-45 text-white" />
					</a>
				</div>,
				{ position: "top-center", autoClose: 5000 }
			);
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

	useEffect(() => {
		setTransactions(allTransactions);
	}, [allTransactions]);

	const disableDonateButton =
		loading || !price || authenticated || !(window as any).ethereum;

	return (
		<>
			<div className="bg-gray-50 min-h-screen">
				<main className='relative w-full mx-auto'>
					{/* Page header */}
					<div className='w-full bg-cryptopurple sticky h-80' />
					<div className="absolute w-full top-14">
						<div className='max-w-7xl mx-auto rounded-xl py-12'>

							<div className="mt-8 mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
								<div className="space-y-6 p-8 rounded-lg bg-white shadow-md lg:col-start-1 lg:col-span-2">
									<div className="flex items-center space-x-5">
										<div className="flex-shrink-0">
											<div className="relative">
												<Blockies
													seed={user?.address}
													size={9}
													scale={8}
													className="rounded-full"
												/>
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
									<div className="mt-8 border-b -mx-8"/>

									{/* Comments*/}
									{!!transactions?.length && (
										<section aria-labelledby="notes-title">
											<div className="bg-white mt-8 sm:rounded-lg sm:overflow-hidden">
												<div className='mb-8'>
													<h2
														id="notes-title"
														className="text-xl font-urbanist font-bold text-gray-900"
													>
														Recent Supporters 🤝
													</h2>
												</div>
												<div>
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
																	className="relative p-8 pb-9 bg-lightpurple rounded-xl border border-cryptopurple"
																>
																	<div className="flex space-x-3">
																		<div className="flex-shrink-0">
																			<Blockies
																				seed={
																					transaction?.from
																				}
																				size={
																					8
																				}
																				scale={
																					6
																				}
																				className="rounded-full"
																			/>
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
					</div>
				</main>
			</div>
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
