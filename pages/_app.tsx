import React from "react";
import "tailwindcss/tailwind.css";
import Head from 'next/head';
import { AuthWrapper } from "../utils/context";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from "react-tooltip";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<AuthWrapper>
			<Head key='main-head'>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
                <link href="https://fonts.googleapis.com/css2?family=Sora&display=swap" rel="stylesheet" />
				<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;800&display=swap" rel="stylesheet"></link>
            </Head>
			<Component {...pageProps} />
			<ToastContainer />
			<ReactTooltip effect='solid' />
		</AuthWrapper>
	);
}

export default MyApp;
