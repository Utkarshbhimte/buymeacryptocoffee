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
		router.push(`/${currAccount}`);
	};

	// useEffect(() => {
	// 	console.log(
	// 		"🚀 ~ file: index.tsx ~ line 110 ~ useEffect ~ account",
	// 		account
	// 	);
	// 	if (account) {
	// 		redirectToProfile(account);
	// 	}
	// }, [account]);

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
				<div className="flex space-x-4 items-center min-h-screen font-urbanist">
					<div className="flex-1 px-4 md:px-0">
						<h1 className=" text-5xl font-bold mb-4">
							Let your audience buy you a Crypto Coffee
						</h1>
						<p className="mb-8">
							BuyMeACryptoCoffee is a fun way to get rid of the
							messy wallet addresses and use simple and easy to
							share links
						</p>
						<div>
							<form
								className="flex space-x-2"
								onSubmit={handleRedirect}
							>
								<input
									id="address"
									className="shadow-sm focus:ring-cryptopurple focus:border-cryptopurple block w-full sm:text-sm rounded-md border border-gray-400 px-4"
									placeholder="0x..."
									value={address}
									onChange={(e) => setAddress(e.target.value)}
								/>
								<button className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap">
									Checkout page
								</button>
							</form>
						</div>
					</div>
					<div className="hidden md:block flex-1"></div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
