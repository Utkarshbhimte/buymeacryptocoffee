import { LinkIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { AuthenticateOptions } from "react-moralis/lib/hooks/core/useMoralis/_useMoralisAuth";
import { toast } from "react-toastify";
import illustration from "../assets/illustration.png";
import Loader from "../components/Loader";
import { useEnsAddress } from "../utils/useEnsAddress";
import Link from "next/link";
import { ethers } from "ethers";
import { validateAndResolveAddress } from "../utils/crypto";

declare let window: any;

const makerData = [
	{
		name: "Utkarsh",
		address: "0xbhaisaab.eth",
		image: "https://pbs.twimg.com/profile_images/1284769236305338368/1QMpU-YP_400x400.jpg",
		twitterUrl: "https://twitter.com/BhimteBhaisaab",
		description:
			"building @worthinnft hanging out @buildbystl, @developer_dao",
	},
	{
		name: "Ajinkya",
		address: "0xCF193782f2eBC069ae05eC0Ef955E4B042D000Dd",
		image: "https://pbs.twimg.com/profile_images/1379068290643886084/_uPr_3jj_400x400.jpg",
		twitterUrl: "https://twitter.com/CreakFoder",
		description: "Frontend Developer",
	},
	{
		name: "Abhishek",
		address: "0xAD6561E9e306C923512B4ea7af902994BEbd99B8",
		image: "https://pbs.twimg.com/profile_images/1111908635494543360/P3M1am5F_400x400.jpg",
		twitterUrl: "https://twitter.com/abhikumar_98",
		description: "Frontend Developer @zomentum, building @nocodeletters",
	},
	{
		name: "Akhil",
		address: "0xab14023979a34b4abb17abd099a1de1dc452011a",
		image: "https://pbs.twimg.com/profile_images/1434216740729155585/X_jLGctP_400x400.jpg",
		twitterUrl: "https://twitter.com/akhil_bvs",
		description: "Design @DrumworksHQ | Alumnus @10KDesigners",
	},
];

const CtaButton = () => {
	const { authenticate, isAuthenticated, account } =
		useMoralis();

	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleAuth = async () => {
		try {
			setLoading(true);
			const options: AuthenticateOptions = {
				signingMessage: `
					Get your audience support with crypto! \n
					With BuyMeACryptoCoffee your audience can support you with cryptocurrency. \n
					How does it work?\n
					- Supporter connects their Wallet on Crypto Coffee
					- They enter their favorite creator’s wallet address and donate crypto.
					- Creators can create their own crypto coffee page and share with their audience too
				`,
			};

			if (!(window as any).ethereum) {
				options.provider = "walletconnect";
			}

			await authenticate(options);

			!!account?.length && router.push(`/${account}`)
		} catch (error) {
			console.error(error);
			setLoading(false);
			toast.error(error.message);
		} finally {
			setLoading(false)
		}
	};

	if (loading) {
		return (
			<div className=" bg-gray-200 rounded-lg px-2 py-3 w-48 flex justify-center">
				<Loader />
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<button
				type="button"
				onClick={handleAuth}
				className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cryptopurple hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cryptopurple"
			>
				Start today
			</button>
		);
	}

	return (
		<Link href={`/${account}`}>
			<button
				type="button"
				className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cryptopurple hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cryptopurple"
			>
				Go to your wall
			</button>
		</Link>
	);
};

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

	// const redirectToProfile = async (currAccount: string) => {
	// 	router.push(`/${currAccount}`);
	// };

	// useEffect(() => {
	// 	if (account) {
	// 		redirectToProfile(account);
	// 	}
	// }, [account]);

	return (
		<div className="min-h-screen">
			<div className="h-154 bg-lightpurple">
				<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 flex h-full bg-lightpurple space-x-4 items-center font-urbanist">
					<div className="flex-1 px-4 md:px-0">
						<h1 className=" text-5xl font-bold mb-4">
							Get your audience support with{" "}
							<span className="text-cryptopurple">Crypto ✨</span>
						</h1>
						<p className="mb-8">
							With BuyMeACryptoCoffee your audience can
							<span className="font-semibold">
								{" "}
								support you with cryptocurrency
							</span>
						</p>
						<CtaButton />
						{/* <div>
							<form
								className="flex space-x-2"
								onSubmit={handleRedirect}
							>
								<input
									id="address"
									className="shadow-sm focus:ring-cryptopurple focus:border-cryptopurple block w-full sm:text-sm rounded-md border border-gray-400 px-4"
									placeholder="Search by : Eg 0x1ed3... or destination.eth"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
								/>
								<button className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cryptopurple whitespace-nowrap">
									Search Creator
								</button>
							</form>
						</div> */}
					</div>
					<div className="md:block xs:hidden flex-1">
						<Image src={illustration} />
					</div>
				</div>
			</div>
			<div className='max-w-7xl flex flex-col font-urbanist items-center justify-center mx-auto py-16'>
				<h2 className='mb-4 font-extrabold text-4xl'>Not a creator?</h2>
				<p className='mb-8 text-center xs:mx-2'>
					You can show support to your favorite creators with just their wallet address! 
					<br/><span className='font-semibold'> And also add a few words of gratitude</span>
				</p>
				<div className='w-full'>
					<form
						className="flex xs:flex-col xs:w-4/5 xs:mx-auto xs:space-y-4 mx-auto w-2/5 space-x-2 xs:space-x-0"
						onSubmit={handleRedirect}
					>
						<input
							id="address"
							className="shadow-sm focus:ring-cryptopurple focus:border-cryptopurple block w-full sm:text-sm rounded-md border border-gray-400 px-4 xs:py-3"
							placeholder="Search by : Eg 0x1ed3... or destination.eth"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
						<button className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cryptopurple whitespace-nowrap">
							Search Creator
						</button>
					</form>
				</div>
			</div>
			<div className='bg-lightpurple py-4'>
				<div className="max-w-7xl font-urbanist mt-16 mb-32 mx-auto px-2 sm:px-4 lg:px-8">
					<h2 className="text-4xl font-extrabold mb-4">
						<span className="text-cryptopurple">Support Makers,</span>{" "}
						Today!
					</h2>
					{/* <span className='w-20 text-base'>
						Some of the most talented creators in the world accept cryptocurrency through 
						our cryptocoffee pages. Go support them!
					</span> */}
					<div className="flex justify-center mt-16 mx-auto space-x-24 sm:flex-col sm:space-x-0 sm:space-y-12">
						{makerData.map((maker) => (
							<div className="flex flex-1/4 flex-col items-center justify-center">
								<img
									src={maker.image}
									className="rounded-full w-28 h-28"
								/>
								<span className="text-lg font-extrabold mt-4">
									{maker.name}
								</span>
								<span className="text-center mt-2">
									{maker.description}
								</span>
								<div className="flex space-x-4 mt-4">
									<a
										className="w-12 h-12 rounded-full bg-lightpurple border-cryptopurple border text-cryptopurple flex items-center justify-center"
										href={`https://buymeacryptocoffee.xyz/${maker.address}`}
										target="_blank"
										rel="noreferrer noopener"
									>
										<LinkIcon className="w-6 h-6" />
									</a>
									<a
										className="w-12 h-12 rounded-full bg-lightpurple border-cryptopurple border flex items-center justify-center"
										href={maker.twitterUrl}
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
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
