import React from "react";
import "tailwindcss/tailwind.css";
import Head from "next/head";
import { AuthWrapper } from "../utils/context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";

import { MoralisProvider } from "react-moralis";
import Logo from "../components/Logo";
import Address from "../components/Address";

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
						<div className="flex item-center justify-between py-2">
							<div className="flex px-2 lg:px-0">
								<div className="flex-shrink-0 flex items-center">
									<a href="#">
										<Logo />
									</a>
								</div>
							</div>
							<Address avatar="left" size={6} copyable />
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
