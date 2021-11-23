/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import React, { Fragment, useEffect, useState } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import {
	CheckIcon,
	EyeIcon,
	QuestionMarkCircleIcon,
	ThumbUpIcon,
	UserIcon,
} from "@heroicons/react/solid";
import Image from "next/image";
import cryptoCoffeeLogo from "../../assets/cryptocoffeelogo.png";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { db } from "../../utils/firebaseClient";
import { Widget } from "../../components/customise-widget-form/CustomiseWidgetForm";
import WidgetComponent from "../../components/Widget";
import { useUser } from "../../utils/context";
import { sendTransaction } from "../../utils/crypto";
import Modal from "../../components/Modal";
import ProfileModal from "../../components/ProfileModal";
import { Transaction, User } from "../../contracts";
import { saveTransaction } from "../../utils";
import SuccessTransactionModal from "../../components/SuccessTransactionModal";
import { ethers } from "ethers";

declare let window: any;

const userNavigation = [
	{ name: "Your Profile", href: "#" },
	{ name: "Settings", href: "#" },
	{ name: "Sign out", href: "#" },
];
const eventTypes = {
	applied: { icon: UserIcon, bgColorClass: "bg-gray-400" },
	advanced: { icon: ThumbUpIcon, bgColorClass: "bg-blue-500" },
	completed: { icon: CheckIcon, bgColorClass: "bg-green-500" },
};

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

	const { user, authenticated, currentWallet, connectWallet } = useUser();

	// transaction data
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const [transactionDetails, setTransactionDetails] = useState(null);

	const handleSendTransaction = async () => {
		try {
			if (!user?.id) {
				throw new Error("No user address found");
			}

			setLoading(true);
			const response = await sendTransaction(
				user.id,
				message,
				price.toString()
			);

			setTransactionDetails(response);
			setModalOpen(true);
			setMessage("");
			setPrice(0);

			const transaction: Transaction = {
				...new Transaction(),
				to: user.id,
				from: currentWallet,
				id: response.hash,
				amount: price,
				message,
			};

			console.log({ transaction });
			await saveTransaction(transaction);
		} catch (error) {
			console.error(error);
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

	const getENSFromName = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const ensResolver = await provider.lookupAddress(user.id);
		const address = ensResolver;
	}

	useEffect(() => {
		if (!modalOpen) {
			setTransactionDetails(null);
		}
	}, [modalOpen]);

	useEffect(() => {
		setTransactions(allTransactions);
	}, [allTransactions])

	useEffect(() => {
		if(user) {
			getENSFromName()
		}
	}, [user])

	return (
		<>
			<div className="min-h-full">
				<header className="bg-white shadow">
					<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
						<Popover className="flex justify-between h-16">
							<div className="flex px-2 lg:px-0">
								<div className="flex-shrink-0 flex items-center">
									<a href="#">
										<Image
											className="block lg:hidden h-8 w-auto"
											src={cryptoCoffeeLogo}
											alt="Workflow"
											width={300}
											height={30}
										/>
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
											<Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
												<span className="sr-only">
													Open user menu
												</span>
												{user?.profileImage ? (
													<img
														className="h-8 w-8 rounded-md"
														src={user?.profileImage}
														alt=""
													/>
												) : (
													<div className="h-8 rounded-md overflow-hidden bg-gray-100 cursor-pointer flex items-center">
														<svg
															className="h-8 w-8 text-gray-300"
															fill="currentColor"
															viewBox="0 0 24 24"
														>
															<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
														</svg>
														<span className="w-20 px-2 truncate text-gray-800 bg-gray-100">
															{currentWallet}
														</span>
													</div>
												)}
											</Menu.Button>
										) : (
											<button
												type="button"
												onClick={() => connectWallet()}
												className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											>
												Connect
											</button>
										)}
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
										<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
											{userNavigation.map((item) => (
												<Menu.Item key={item.name}>
													{({ active }) => (
														<a
															href={item.href}
															className={classNames(
																active
																	? "bg-gray-100"
																	: "",
																"block px-4 py-2 text-sm text-gray-700"
															)}
														>
															{item.name}
														</a>
													)}
												</Menu.Item>
											))}
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</Popover>
					</div>
				</header>

				<main className="py-10">
					{/* Page header */}
					<div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
						<div className="flex items-center space-x-5">
							<div className="flex-shrink-0">
								<div className="relative">
									{user?.profileImage ? (
										<img
											className="h-20 w-20 rounded-full"
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
									)}
								</div>
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									{user?.name}
								</h1>
								<p className="text-sm font-medium text-gray-500">
									{user?.id}
								</p>
							</div>
						</div>
						<div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
							{authenticated && (
								<button
									type="button"
									className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
									onClick={() => setEditModalOpen(true)}
								>
									Edit Profile
								</button>
							)}
						</div>
					</div>

					<div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
						<div className="space-y-6 lg:col-start-1 lg:col-span-2">
							{/* Description list*/}
							{user?.description && <section aria-labelledby="applicant-information-title">
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
							</section>}

							{/* Comments*/}
							{!!transactions?.length && (
								<section aria-labelledby="notes-title">
									<div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
										<div className="divide-y divide-gray-200">
											<div className="px-4 py-5 sm:px-6">
												<h2
													id="notes-title"
													className="text-lg font-medium text-gray-900"
												>
													Recent Crypto Coffees
												</h2>
											</div>
											<div className="px-4 py-6 sm:px-6">
												<ul
													role="list"
													className="space-y-8"
												>
													{transactions.map(
														(transaction) => (
															<li
																key={transaction.id}
															>
																<div className="flex space-x-3">
																	<div className="flex-shrink-0">
																		<img
																			className="h-10 w-10 rounded-full"
																			// src={`https://images.unsplash.com/photo-${transaction.imageId}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
																			alt=""
																		/>
																	</div>
																	<div>
																		<div className="text-sm">
																			<a
																				href="#"
																				className="font-medium text-gray-900"
																			>
																				{
																					`${transaction.from} has sent ${transaction.amount} eth.`
																				}
																			</a>
																		</div>
																		<div className="mt-1 text-sm text-gray-700">
																			<p>
																				{
																					transaction.message
																				}
																			</p>
																		</div>
																	</div>
																</div>
															</li>
														)
													)}
												</ul>
											</div>
										</div>
									</div>
								</section>
							)}
						</div>

						<section
							aria-labelledby="timeline-title"
							className="lg:col-start-3 lg:col-span-1"
						>
							<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
								{/* {!widget ? ( */}
									<div className="h-full px-4">
										<div className="text-lg my-4">
											Buy me a coffee
										</div>
										<div className="flex items-center justify-between">
											<span>Send ETH:</span>
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

										<div className="mt-4">
											<label
												htmlFor="comment"
												className="block text-sm font-medium text-gray-700"
											>
												Add your comment
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
										</div>
										<button
											onClick={() =>
												handleSendTransaction()
											}
											type="button"
											disabled={
												loading ||
												!price ||
												authenticated
											}
											className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full text-center"
										>
											Donate {price} ETH
										</button>
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
			...data as Transaction,
			id: doc.id,
		};
	});


	return {
		props: {
			transactions
		},
	};
};

export default Profile;
