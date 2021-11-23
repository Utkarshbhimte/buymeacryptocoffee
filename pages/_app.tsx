import React from "react";
import "tailwindcss/tailwind.css";
import { Provider } from "next-auth/client";
import { AuthWrapper } from "../utils/context";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<AuthWrapper>
			<Component {...pageProps} />
		</AuthWrapper>
	);
}

export default MyApp;
