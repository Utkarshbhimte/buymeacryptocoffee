import Head from "next/head";
import Link from "next/link";
import React from "react";
import { MoralisProvider } from "react-moralis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import "tailwindcss/tailwind.css";
import Account from "../components/Account";
import Chains from "../components/Chains";
import Logo from "../components/Logo";
import { AuthWrapper } from "../utils/context";

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	// const Provider =
	return (
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
										<Logo />
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
				<ToastContainer />
				<ReactTooltip effect="solid" />
			</AuthWrapper>
		</MoralisProvider>
	);
}

export default MyApp;
