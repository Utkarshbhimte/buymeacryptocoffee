import { useEffect, useState } from "react";
import { ENSResponse } from "./crypto";

export const fetchEnsAddress = async (
	currAccount: string
): Promise<ENSResponse | undefined> => {
	const cachedEns = localStorage.getItem(`ensAddress-${currAccount}`);

	if (cachedEns) {
		try {
			const data = JSON.parse(cachedEns);
			return data;
		} catch (e) {
			localStorage.removeItem(`ensAddress-${currAccount}`);
		}
	}

	const request = await fetch(`/api/resolve-wallet?name=${currAccount}`);
	const res: ENSResponse = await request.json();

	if (res.name) {
		localStorage.setItem(`ensAddress-${currAccount}`, JSON.stringify(res));
		return res;
	}
};

export const useEnsAddress = (account: string): ENSResponse => {
	// const [ensAddress, setEnsAddress] = useState<string | null>(null);
	const [ensMeta, setEnsMeta] = useState<ENSResponse>({
		address: null,
		name: null,
		avatar: null,
	});

	const getEnsAddress = async (currAccount: string) => {
		const response = await fetchEnsAddress(currAccount);

		if (response) {
			setEnsMeta(response);
		}
	};

	useEffect(() => {
		account && getEnsAddress(account);
	}, [account]);

	return ensMeta;
};
