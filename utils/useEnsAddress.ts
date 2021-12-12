import { useEffect, useState } from "react";

export const fetchEnsAddress = async (currAccount: string) => {
	const cachedEns = localStorage.getItem(`ensAddress-${currAccount}`);

	if (cachedEns) {
		return cachedEns;
	}

	const request = await fetch(`/api/resolve-wallet?name=${currAccount}`);
	const res = await request.json();

	if (res.name) {
		localStorage.setItem(`ensAddress-${currAccount}`, res.name);
		return res.name;
	}
};

export const useEnsAddress = (account: string) => {
	const [ensAddress, setEnsAddress] = useState<string | null>(null);

	const getEnsAddress = async (currAccount: string) => {
		const name = await fetchEnsAddress(currAccount);

		if (name) {
			setEnsAddress(name);
		}
	}


	useEffect(() => {
		account && getEnsAddress(account);
	}, [account]);

	return ensAddress;
};
