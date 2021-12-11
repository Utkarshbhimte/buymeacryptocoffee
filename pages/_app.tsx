import Head from "next/head";
import Link from "next/link";
import React from "react";
import { MoralisProvider } from "react-moralis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import "tailwindcss/tailwind.css";
import Account from "../components/Account";
import Address from "../components/Address";
import Chains from "../components/Chains";
import Logo from "../components/Logo";
import { AuthWrapper } from "../utils/context";

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	// const Provider =
	return (
		<div className="relative">
			<MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
				<AuthWrapper>
					<Head key="main-head">
						<link
							rel="preconnect"
							href="https://fonts.googleapis.com"
						/>
						<link
							rel="preconnect"
							href="https://fonts.gstatic.com"
							crossOrigin="anonymous"
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Sora&display=swap"
							rel="stylesheet"
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;800&display=swap"
							rel="stylesheet"
						></link>
					</Head>
					<header className="bg-white shadow">
						<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
							<div className="flex items-center justify-between py-4">
								<div className="flex px-2 lg:px-0">
									<div className="flex-shrink-0 flex items-center">
										<Link href="/">
											<span>
												<Logo />
											</span>
										</Link>
									</div>
								</div>
								<div className="flex space-x-6 items-center">
									<Chains />
									<Account />
								</div>
							</div>
						</div>
					</header>

					<Component {...pageProps} />
					<footer className="bg-footerblack w-full absolute bottom-0 h-52 flex flex-col items-center justify-center">
						<Logo isWhite />
						<span className="font-urbanist text-white text-base">
							Makers:
							<a
								href="https://twitter.com/BhimteBhaisaab"
								target="_blank"
								rel="noreferrer noopener"
							>
								{" "}
								Utkarsh,{" "}
							</a>
							<a
								href="https://twitter.com/CreakFoder"
								target="_blank"
								rel="noreferrer noopener"
							>
								Ajinkya,{" "}
							</a>
							<a
								href="https://twitter.com/abhikumar_98"
								target="_blank"
								rel="noreferrer noopener"
							>
								Abhishek,{" "}
							</a>
							<a
								href="https://twitter.com/akhil_bvs"
								target="_blank"
								rel="noreferrer noopener"
							>
								and Akhil BVS
							</a>
						</span>
					</footer>
					<ToastContainer />
					<ReactTooltip effect="solid" />
				</AuthWrapper>
			</MoralisProvider>
		</div>
	);
}

export default MyApp;
