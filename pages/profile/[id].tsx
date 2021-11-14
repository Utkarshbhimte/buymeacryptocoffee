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
import { GetStaticPaths, GetStaticProps } from "next";
import { db } from "../../utils/firebaseClient";
import { Widget } from "../../components/customise-widget-form/CustomiseWidgetForm";
import WidgetComponent from "../../components/Widget";
import { useUser } from "../../utils/context";
import { sendTransaction } from "../../utils/crypto";
import Modal from "../../components/Modal";

const user = {
	name: "Whitney Francis",
	email: "whitney@example.com",
	imageUrl:
		"https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
};
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
const timeline = [
	{
		id: 1,
		type: eventTypes.applied,
		content: "Applied to",
		target: "Front End Developer",
		date: "Sep 20",
		datetime: "2020-09-20",
	},
	{
		id: 2,
		type: eventTypes.advanced,
		content: "Advanced to phone screening by",
		target: "Bethany Blake",
		date: "Sep 22",
		datetime: "2020-09-22",
	},
	{
		id: 3,
		type: eventTypes.completed,
		content: "Completed phone screening with",
		target: "Martha Gardner",
		date: "Sep 28",
		datetime: "2020-09-28",
	},
	{
		id: 4,
		type: eventTypes.advanced,
		content: "Advanced to interview by",
		target: "Bethany Blake",
		date: "Sep 30",
		datetime: "2020-09-30",
	},
	{
		id: 5,
		type: eventTypes.completed,
		content: "Completed interview with",
		target: "Katherine Snyder",
		date: "Oct 4",
		datetime: "2020-10-04",
	},
];
const comments = [
	{
		id: 1,
		name: "Leslie Alexander",
		date: "4d ago",
		imageId: "1494790108377-be9c29b29330",
		body: "Ducimus quas delectus ad maxime totam doloribus reiciendis ex. Tempore dolorem maiores. Similique voluptatibus tempore non ut.",
	},
	{
		id: 2,
		name: "Michael Foster",
		date: "4d ago",
		imageId: "1519244703995-f4e0f30006d5",
		body: "Et ut autem. Voluptatem eum dolores sint necessitatibus quos. Quis eum qui dolorem accusantium voluptas voluptatem ipsum. Quo facere iusto quia accusamus veniam id explicabo et aut.",
	},
	{
		id: 3,
		name: "Dries Vincent",
		date: "4d ago",
		imageId: "1506794778202-cad84cf45f1d",
		body: "Expedita consequatur sit ea voluptas quo ipsam recusandae. Ab sint et voluptatem repudiandae voluptatem et eveniet. Nihil quas consequatur autem. Perferendis rerum et.",
	},
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export interface ProfileProps {
	widget: Widget;
}

const Profile: React.FC<ProfileProps> = ({ widget }) => {
	// modal state
	const [modalOpen, setModalOpen] = useState(false);
	const [price, setPrice] = useState<number>(0);
	const [message, setMessage] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const { user, authenticated } = useUser();

	const [transactionDetails, setTransactionDetails] = useState(null);

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

	useEffect(() => {
		if (!modalOpen) {
			setTransactionDetails(null);
		}
	}, [modalOpen]);

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
										<Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
											<span className="sr-only">
												Open user menu
											</span>
											<img
												className="h-8 w-8 rounded-full"
												src={user?.profileImage}
												alt=""
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
									<img
										className="h-16 w-16 rounded-full"
										src={user?.profileImage}
										alt=""
									/>
									<span
										className="absolute inset-0 shadow-inner rounded-full"
										aria-hidden="true"
									/>
								</div>
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									{user?.name}
								</h1>
								<p className="text-sm font-medium text-gray-500">
									{widget?.wallet_address[1].public_address}
								</p>
							</div>
						</div>
						<div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
							{authenticated && (
								<button
									type="button"
									className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
								>
									Edit Profile
								</button>
							)}
						</div>
					</div>

					<div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
						<div className="space-y-6 lg:col-start-1 lg:col-span-2">
							{/* Description list*/}
							<section aria-labelledby="applicant-information-title">
								<div className="bg-white shadow sm:rounded-lg">
									<div className="px-4 py-5 sm:px-6">
										<h2
											id="applicant-information-title"
											className="text-lg leading-6 font-medium text-gray-900"
										>
											I think and write code, sometime
											design.😄
										</h2>
									</div>
								</div>
							</section>

							{/* Comments*/}
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
												{comments.map((comment) => (
													<li key={comment.id}>
														<div className="flex space-x-3">
															<div className="flex-shrink-0">
																<img
																	className="h-10 w-10 rounded-full"
																	src={`https://images.unsplash.com/photo-${comment.imageId}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
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
																			comment.name
																		}
																	</a>
																</div>
																<div className="mt-1 text-sm text-gray-700">
																	<p>
																		{
																			comment.body
																		}
																	</p>
																</div>
																<div className="mt-2 text-sm space-x-2">
																	<span className="text-gray-500 font-medium">
																		{
																			comment.date
																		}
																	</span>{" "}
																	<span className="text-gray-500 font-medium">
																		&middot;
																	</span>{" "}
																	<button
																		type="button"
																		className="text-gray-900 font-medium"
																	>
																		Reply
																	</button>
																</div>
															</div>
														</div>
													</li>
												))}
											</ul>
										</div>
									</div>
									<div className="bg-gray-50 px-4 py-6 sm:px-6">
										<div className="flex space-x-3">
											<div className="flex-shrink-0">
												<img
													className="h-10 w-10 rounded-full"
													src={user?.profileImage}
													alt=""
												/>
											</div>
											<div className="min-w-0 flex-1">
												<form action="#">
													<div>
														<label
															htmlFor="comment"
															className="sr-only"
														>
															About
														</label>
														<textarea
															id="comment"
															name="comment"
															rows={3}
															className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
															placeholder="Add a note"
															defaultValue={""}
														/>
													</div>
													<div className="mt-3 flex items-center justify-between">
														<a
															href="#"
															className="group inline-flex items-start text-sm space-x-2 text-gray-500 hover:text-gray-900"
														>
															<QuestionMarkCircleIcon
																className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
																aria-hidden="true"
															/>
															<span>
																Some HTML is
																okay.
															</span>
														</a>
														<button
															type="submit"
															className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
														>
															Comment
														</button>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</section>
						</div>

						<section
							aria-labelledby="timeline-title"
							className="lg:col-start-3 lg:col-span-1"
						>
							<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
								{!widget ? (
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
											disabled={loading || !price}
											className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full text-center"
										>
											Donate {price} ETH
										</button>
									</div>
								) : (
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
								)}
							</div>
						</section>
					</div>
				</main>
			</div>
			<Modal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Transaction successful"
				onOk={handleEtherScanRedirect}
				okText="View on Etherscan"
			/>
		</>
	);
};

// export const getStaticProps: GetStaticProps = async (context) => {
// 	const userId = context.params.id;
// 	const widgetResponse = await db
// 		.collection("widgets")
// 		.where("userId", "==", userId)
// 		.get();
// 	const widget = {
// 		...widgetResponse.docs[0].data(),
// 		id: widgetResponse.docs[0].id,
// 	};

// 	return {
// 		props: {
// 			widget,
// 		},
// 	};
// };

// export const getStaticPaths: GetStaticPaths = async () => {
// 	const widgetResponse = await db.collection("widgets").get();
// 	const widgets: Widget[] = widgetResponse.docs.map((doc) => ({
// 		...(doc.data() as Widget),
// 		id: doc.id,
// 	}));

// 	const paths = widgets.map((widget) => ({
// 		params: { id: widget.userId },
// 	}));

// 	return { paths, fallback: "blocking" };
// };

export default Profile;
