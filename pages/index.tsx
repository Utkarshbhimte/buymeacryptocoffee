import { ethers } from "ethers";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import { validateAndResolveAddress } from "../utils/crypto";

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
	const [loading, setLoading] = useState(false);
	const { account } = useMoralis();

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
			if (!address.length) return;

			setLoading(true);

			const mainnetEndpoint =
				"https://speedy-nodes-nyc.moralis.io/d35afcfb3d409232f26629cd/eth/mainnet";
			const rpcProvider = new ethers.providers.JsonRpcProvider(
				mainnetEndpoint
			);

			const provider = !(window as any).ethereum
				? rpcProvider
				: new ethers.providers.Web3Provider(window.ethereum);
			const validatedAddress = await validateAndResolveAddress(
				address,
				provider
			);
			const { name, address: userAddress } = validatedAddress;

			if (!userAddress) {
				toast.error("Please enter valid ens or address", {
					position: "top-center",
				});
				setLoading(false);
				return;
			}

			console.log({
				userAddress,
				name,
				address,
			});

			if (name) {
				router.push(`/${name}`);
				return;
			}

			router.push(`/${userAddress}`);
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const redirectToProfile = async (currAccount: string) => {
		console.log(
			"🚀 ~ file: index.tsx ~ line 95 ~ redirectToProfile ~ currAccount",
			currAccount
		);
		const response = await fetch(
			`/api/resolve-wallet?name=${currAccount}`
		).then((res) => res.json());

		const destination = response.name || response.address || currAccount;

		router.push(`/${currAccount}`);
	};

	useEffect(() => {
		if (account) {
			redirectToProfile(account);
		}
	}, [account]);

	return (
		<div className="min-h-screen bg-white">
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
										className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
											!!address.length
												? " bg-indigo-600 hover:bg-indigo-700 "
												: "bg-indigo-300 cursor-not-allowed "
										}`}
										disabled={!address.length}
									>
										{loading ? (
											<svg
												className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
										) : (
											"Create page and send ETH"
										)}
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
