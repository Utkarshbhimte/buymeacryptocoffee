import { signOut } from "next-auth/client";
import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Logo from "../components/Logo";

declare let window: any;

const navigation = [
	// { name: 'Create Widget', href: '#', current: true }
];
const userNavigation = [
	{ name: "Your Profile", href: "#" },
	// { name: 'Settings', href: '#' },
	{ name: "Sign out", href: "#", onClick: () => signOut() },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const Dashboard: React.FC = () => {
	const [address, setAddress] = useState("");

	// const [session, loading] = useSession();
	const router = useRouter();

	// const { user } = useUser();

	// useEffect(() => {
	//     if(!session) {
	//         router.push('/login')
	//     }
	// }, [session])

	// if (loading) {
	// 	return <Loader />;
	// }

	const handleRedirect = async (e) => {
		try {
			e.preventDefault();
			if(!address.length) return
			let userAddress = address;
			if(userAddress.includes('.eth')){
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const ensResolver = await provider.getResolver(address)
				
				userAddress = ensResolver.address;
			}
			ethers.utils.getAddress(userAddress);
			router.push(`/profile/${userAddress}`);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="min-h-screen bg-white">
			<Disclosure as="nav" className="bg-white border-b border-gray-200">
				{({ open }) => (
					<>
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex justify-between h-16">
								<div className="flex">
									<div className="flex-shrink-0 flex items-center">
										<Logo />
									</div>
									<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
										{navigation.map((item) => (
											<a
												key={item.name}
												href={item.href}
												className={classNames(
													item.current
														? "border-indigo-500 text-gray-900"
														: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
													"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
												)}
												aria-current={
													item.current
														? "page"
														: undefined
												}
											>
												{item.name}
											</a>
										))}
									</div>
								</div>
								<div className="hidden sm:ml-6 sm:flex sm:items-center">
									{/* <Menu as="div" className="ml-3 relative">
										<div>
											<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
												<span className="sr-only">
													Open user menu
												</span>
												<img
													className="h-8 w-8 rounded-full"
													src={session?.user.image}
													alt=""
												/>
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-200"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
												{userNavigation.map((item) => (
													<Menu.Item
														key={item.name}
														onClick={item?.onClick}
													>
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
									</Menu> */}
								</div>
								<div className="-mr-2 flex items-center sm:hidden">
									{/* Mobile menu button */}
									<Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
										<span className="sr-only">
											Open main menu
										</span>
										{open ? (
											<XIcon
												className="block h-6 w-6"
												aria-hidden="true"
											/>
										) : (
											<MenuIcon
												className="block h-6 w-6"
												aria-hidden="true"
											/>
										)}
									</Disclosure.Button>
								</div>
							</div>
						</div>

						<Disclosure.Panel className="sm:hidden">
							<div className="pt-2 pb-3 space-y-1">
								{navigation.map((item) => (
									<a
										key={item.name}
										href={item.href}
										className={classNames(
											item.current
												? "bg-indigo-50 border-indigo-500 text-indigo-700"
												: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
											"block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
										)}
										aria-current={
											item.current ? "page" : undefined
										}
									>
										{item.name}
									</a>
								))}
							</div>
							<div className="pt-4 pb-3 border-t border-gray-200">
								<div className="flex items-center px-4">
									{/* <div className="flex-shrink-0">
										<img
											className="h-10 w-10 rounded-full"
											src={session?.user.image}
											alt=""
										/>
									</div>
									<div className="ml-3">
										<div className="text-base font-medium text-gray-800">
											{session?.user.name}
										</div>
										<div className="text-sm font-medium text-gray-500">
											{session?.user.email}
										</div>
									</div> */}
									<button
										type="button"
										className="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										<span className="sr-only">
											View notifications
										</span>
										<BellIcon
											className="h-6 w-6"
											aria-hidden="true"
										/>
									</button>
								</div>
								<div className="mt-3 space-y-1">
									{userNavigation.map((item) => (
										<a
											key={item.name}
											href={item.href}
											className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
										>
											{item.name}
										</a>
									))}
								</div>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>

			<div className="py-10">
				{/* <header>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold leading-tight text-gray-900">
							Dashboard
						</h1>
					</div>
				</header> */}
				<main>
					{/* <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
						<CustomiseWidgetForm />
					</div> */}
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
							Support creators with ETH
						</h2>
					</div>

					<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
						<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
							<form
								className="space-y-6"
								onSubmit={handleRedirect}
							>
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700"
									>
										Enter address of recipient
									</label>
									<div className="mt-1">
										<input
											value={address}
											onChange={(e) =>
												setAddress(e.target.value)
											}
											type="text"
											required
											className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
									</div>
								</div>

								<div>
									<button
										type="submit"
										className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Create page and send ETH
									</button>
								</div>
							</form>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Dashboard;
