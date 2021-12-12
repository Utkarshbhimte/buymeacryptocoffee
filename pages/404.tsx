import React, { useState } from "react";
import illustration from "../assets/errorillustration.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { validateAndResolveAddress } from "../utils/crypto";
import { ethers } from "ethers";

declare let window: any;

const Page404: React.FC = () => {
	const [address, setAddress] = useState("");

	const router = useRouter();

	const handleRedirect = async (e) => {
		try {
			e.preventDefault();
			if (!address.length) return;

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
				return;
			}

			if (name) {
				router.push(`/${name}`);
				return;
			}

			router.push(`/${userAddress}`);
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="bg-gray-50">
			<main className="relative w-full mx-auto">
				<div className="w-full bg-cryptopurple h-80" />
				<div className="max-w-6xl flex flex-col items-center justify-center -translate-y-60 shadow-lg bg-white mx-auto rounded-xl py-12 xs:mx-4 xs:px-8">
					<Image src={illustration} />
					<p className="text-center mt-4 font-normal xs:w-full">
						<span className="font-semibold">
							This is a 404 error,
						</span>{" "}
						which means you've clicked on a bad link or entered an
						invalid URL.
					</p>
					<p className="text-center">
						Search for your favourite creator’s wallet address to
						get back!
					</p>
					<div className="w-3/5 xs:w-full">
						<form
							className="flex xs:justify-center xs:items-center xs:flex-col mt-8 space-x-2 xs:space-x-0 xs:space-y-4"
							onSubmit={handleRedirect}
						>
							<input
								id="address"
								className="shadow-sm focus:ring-cryptopurple xs:py-2 focus:border-cryptopurple block w-full sm:text-sm rounded-md border border-gray-400 px-4"
								placeholder="Search by : Eg 0x1ed3... or destination.eth"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
							<button className="flex justify-center py-2 px-4 xs:w-3/5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cryptopurple whitespace-nowrap">
								Search Creator
							</button>
						</form>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Page404;
