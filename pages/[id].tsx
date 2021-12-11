import { DuplicateIcon, LinkIcon } from "@heroicons/react/outline";
import { ArrowUpIcon, CheckIcon } from "@heroicons/react/solid";
import copy from "copy-to-clipboard";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Blockies from "react-blockies";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import PaymentSection from "../components/PaymentSection";
import ProfileModal from "../components/ProfileModal";
import { Transaction } from "../contracts";
import { minimizeAddress, saveTransaction } from "../utils";
import { useUser } from "../utils/context";
import { sendTransaction } from "../utils/crypto";
import { db } from "../utils/firebaseClient";
import { useEnsAddress } from "../utils/useEnsAddress";

declare let window: any;

export interface ProfileProps {
	transactions: Transaction[];
}

const Profile: React.FC<ProfileProps> = ({ transactions: allTransactions }) => {
	const router = useRouter();
	const currProfileAddress = router.query.id as string;

	const currProfileEns = useEnsAddress(currProfileAddress);

	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyAddress = () => {
		if (!currProfileAddress) return;
		setIsCopied(true);
		copy(currProfileAddress);
		setTimeout(() => setIsCopied(false), 1500);
	};

	useEffect(() => {
		setTransactions(allTransactions);
	}, [allTransactions]);

	return (
		<>
			<div className="bg-gray-50 min-h-screen">
				<main className="relative w-full mx-auto">
					{/* Page header */}
					<div className="w-full bg-cryptopurple h-80" />
					<div className="max-w-6xl mx-auto rounded-xl py-12">
						<div className="-translate-y-80 z-10 mx-auto grid grid-cols-1 gap-6 sm:px-6 xs:mx-4 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
							<div className="space-y-6 p-8 rounded-lg bg-white shadow-md lg:col-start-1 lg:col-span-2">
								<div className="flex justify-between items-center xs:hidden">
									<div className="flex items-center space-x-5">
										<div className="flex-shrink-0">
											<div className="relative">
												<Blockies
													seed={currProfileAddress}
													size={9}
													scale={8}
													className="rounded-full"
												/>
											</div>
										</div>
										<div className="group">
											<h1 className="font-urbanist text-3xl font-bold text-gray-900 mb-1">
												{/* <div className="animate-pulse h-12 w-48 bg-gray-300 rounded-md" /> */}
												{currProfileEns ??
													minimizeAddress(
														currProfileAddress
													)}
											</h1>
											{!!currProfileEns && (
												<div
													onClick={handleCopyAddress}
													className="flex space-x-2 items-center"
												>
													<p className="text-xs font-medium text-gray-500 p-1 bg-gray-100 inline-block px-3 cursor-pointer hover:bg-indigo-100 transition duration-300 ease-in-out rounded-md">
														{minimizeAddress(
															currProfileAddress
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
										<a
											className="w-12 h-12 rounded-full bg-lightpurple flex items-center justify-center"
											href={`https://twitter.com/intent/tweet?text=Support%20this%20creator%20https://app.buymeacryptocoffee.xyz/${currProfileAddress}`}
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
									<div className="bg-white mt-8 sm:rounded-lg sm:overflow-hidden">
										<div className="mb-8">
											<h2
												id="notes-title"
												className="text-xl font-urbanist font-bold text-gray-900"
											>
												Recent Supporters 🤝
											</h2>
										</div>
										{!!transactions?.length ? (
											<div>
												<ul
													role="list"
													className="space-y-6"
												>
													{transactions.map(
														(
															transaction,
															index
														) => (
															<li
																key={index}
																className="relative p-4 bg-lightpurple rounded-xl border border-cryptopurple"
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
										) : (
											<div className="w-3/5 xs:w-full mx-auto flex font-urbanist items-center flex-col justify-center h-80 xs:h-60">
												<span className="text-2xl font-bold">
													No supporters yet! 🙂
												</span>
												<span className="text-center">
													That’s Okay! We all should
													start somewhere, Share your
													CryptoCoffee page with your
													audience
												</span>
												<div className="text-cryptopurple flex mt-8 space-x-4 xs:text-sm">
													<button
														className="flex items-center border border-cryptopurple px-5 py-2 rounded-lg"
														onClick={() => {
															copy(
																window.location
																	.href
															);
															toast.success(
																"Copied to clipboard!",
																{
																	position:
																		"top-center",
																}
															);
														}}
													>
														Copy Page Link
														<LinkIcon className="w-4 h-4 ml-2" />
													</button>
													<a
														className="flex items-center border border-twitterblue text-twitterblue px-5 py-2 rounded-lg"
														href={`https://twitter.com/intent/tweet?text=Support%20this%20creator%20https://app.buymeacryptocoffee.xyz/${currProfileAddress}`}
														target="_blank"
														rel="noreferrer noopener"
													>
														Tweet This
														<svg
															className="ml-2"
															width="16"
															height="14"
															viewBox="0 0 22 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M21 1.01001C20 1.50001 19.02 1.69901 18 2.00001C16.879 0.735013 15.217 0.665013 13.62 1.26301C12.023 1.86101 10.977 3.32301 11 5.00001V6.00001C7.755 6.08301 4.865 4.60501 3 2.00001C3 2.00001 -1.182 9.43301 7 13C5.128 14.247 3.261 15.088 1 15C4.308 16.803 7.913 17.423 11.034 16.517C14.614 15.477 17.556 12.794 18.685 8.77501C19.0218 7.55268 19.189 6.28987 19.182 5.02201C19.18 4.77301 20.692 2.25001 21 1.00901V1.01001Z"
																stroke="#1DA1F2"
																strokeWidth="1.5"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</a>
												</div>
											</div>
										)}
									</div>
								</section>
							</div>

							<section
								aria-labelledby="timeline-title"
								className="lg:col-start-3 lg:col-span-1 xs:row-span-full"
							>
								<div className="bg-white border border-gray-200 sm:rounded-lg xs:rounded-lg">
									<div className="hidden p-6 justify-between items-center xs:flex">
										<div className="flex items-center space-x-5">
											<div className="flex-shrink-0">
												<div className="relative">
													<Blockies
														seed={
															currProfileAddress
														}
														size={9}
														scale={8}
														className="rounded-full"
													/>
												</div>
											</div>
											<div data-tip={currProfileAddress}>
												<h1 className="font-urbanist text-3xl xs:text-xl font-bold text-gray-900">
													{!currProfileEns
														? currProfileEns
														: minimizeAddress(
																currProfileAddress
														  )}
												</h1>
											</div>
										</div>
										<div className="flex space-x-4">
											<a
												className="w-12 h-12 rounded-full bg-lightpurple flex items-center justify-center"
												href={`https://twitter.com/intent/tweet?text=Support%20this%20creator%20https://app.buymeacryptocoffee.xyz/${currProfileAddress}`}
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
											<div className="w-12 h-12 rounded-full bg-lightpurple text-cryptopurple flex items-center justify-center">
												{isCopied ? (
													<CheckIcon className="w-6 h-6" />
												) : (
													<DuplicateIcon
														className="cursor-pointer w-6 h-6"
														onClick={
															handleCopyAddress
														}
													/>
												)}
											</div>
										</div>
									</div>
									<PaymentSection />
								</div>
							</section>
						</div>
					</div>
				</main>
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const userAddress = context.params.id;

	const transactionsResponse = await db
		.collection("transactions")
		.where("to", "==", userAddress.toString().toLowerCase())
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
