import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

interface IAuthContext {}

const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
		useMoralis();

	useEffect(() => {
		if (!isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, isWeb3Enabled]);

	return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a AuthWrapper");
	}
	return context;
};
