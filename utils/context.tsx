import React, { useEffect, useState } from "react";
import { getOrCreateUser } from ".";
import { User } from "../contracts";
import { checkIfWalletIsConnected, connectWallet } from "./crypto";

interface IAuthContext {
	readonly user: User;
	readonly connectWallet: () => Promise<void>;
	readonly loading: boolean;
}

const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = React.useState<User | null>(null);
	const [currentWallet, setCurrentWallet] = useState<string | null>(null);
	const [loading, setLoading] = React.useState(false);

	const handleConnectWallet = async () => {
		try {
			setLoading(true);
			const wallet = await connectWallet();
			setCurrentWallet(wallet);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const fetchUpdateUser = async () => {
		try {
			const user = await getOrCreateUser(currentWallet);
			setUser(user);
		} catch (error) {
			console.error(error);
		}
	};

	const initialWalletCheck = async () => {
		try {
			const wallet = await checkIfWalletIsConnected();
			setCurrentWallet(wallet);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (currentWallet) {
			fetchUpdateUser();
		}
	}, [currentWallet]);

	useEffect(() => {
		initialWalletCheck();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				connectWallet: handleConnectWallet,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useUser = () => {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a AuthWrapper");
	}
	return context;
};
