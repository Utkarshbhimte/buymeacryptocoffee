import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getOrCreateUser } from ".";
import { User } from "../contracts";
import {
	checkIfWalletIsConnected,
	connectWallet,
	validateAndResolveAddress,
} from "./crypto";

interface IAuthContext {
	readonly user: User | null;
	readonly setUser: React.Dispatch<React.SetStateAction<User>>;
	readonly connectWallet: () => Promise<void>;
	readonly loading: boolean;
	readonly authenticated: boolean;
	readonly currentWallet: string | null;
}

const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = React.useState<User | null>(null);
	const [currentWallet, setCurrentWallet] = useState<string | null>(null);
	const [loading, setLoading] = React.useState(false);

	const [authenticated, setAuthenticated] = useState(false);

	const router = useRouter();

	const { id: routerAddress } = router.query;
	const address = routerAddress?.toString() ?? "";

	const handleConnectWallet = async () => {
		try {
			if (!(window as any).ethereum) {
				toast.error("You don't have metamask install");
				return;
			}
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
			if (!address) {
				return;
			}

			if (!(window as any).ethereum) {
				const response = await fetch(`/api?address=${address}`);
				const fetchedUser: User = await response.json();

				setUser(fetchedUser);
				return;
			}

			const user = await getOrCreateUser(address);
			setUser(user);
		} catch (error) {
			console.error(error);
			setAuthenticated(false);
		}
	};

	const initialWalletCheck = async () => {
		try {
			if (!(window as any).ethereum) {
				return;
			}

			const wallet = await checkIfWalletIsConnected();
			setCurrentWallet(wallet);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (currentWallet) {
			if (currentWallet.toLowerCase() === address.toLowerCase()) {
				setAuthenticated(true);
			} else {
				setAuthenticated(false);
			}
		}
	}, [currentWallet]);

	useEffect(() => {
		if ((window as any).ethereum) {
			(window as any).ethereum.on("accountsChanged", function (accounts) {
				setCurrentWallet(accounts[0] ?? null);
			});
		}
		initialWalletCheck();
	}, []);

	useEffect(() => {
		fetchUpdateUser();
	}, [routerAddress]);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				connectWallet: handleConnectWallet,
				loading,
				authenticated,
				currentWallet,
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
