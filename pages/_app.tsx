import React from "react";
import "tailwindcss/tailwind.css";
import { Provider } from "next-auth/client";
import { AuthWrapper } from "../utils/context";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<AuthWrapper>
			<Toaster />
			<Component {...pageProps} />
		</AuthWrapper>
	);
}

export default MyApp;
