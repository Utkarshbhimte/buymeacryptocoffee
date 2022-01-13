import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMoralis } from "react-moralis";
import { getOrCreateUser } from ".";
import { User } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";

interface IAuthContext {
	readonly canEdit: boolean;
	readonly user: User | null;
	readonly setUser: (user: User | null) => void;
}

const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const {
		isWeb3Enabled,
		enableWeb3,
		isAuthenticated,
		isWeb3EnableLoading,
		account,
	} = useMoralisData();

	const [user, setUser] = useState<User | null>(null);

	const router = useRouter();
	const id = router.query?.id?.toString();

	const fetchUsers = async (currId: string) => {
		try {
			const response = await getOrCreateUser(currId.toLowerCase());
			setUser(response);
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		if (!isWeb3Enabled && !isWeb3EnableLoading && !(window as any).ethereum)
			enableWeb3();
	}, [isAuthenticated, isWeb3Enabled]);

	useEffect(() => {
		fetchUsers(id);
	}, [id]);

	return (
		<AuthContext.Provider
			value={{
				user,
				canEdit: !![user?.ethAddress, user?.solAddress].includes(
					account
				),
				setUser,
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
