import { useState, useEffect } from "react";

export const useEnsAddress = (account: string) => {
    const [ensAddress, setEnsAddress] = useState<string | null>(null);

    const getEnsAddress = async (currAccount: string) => {
        const cachedEns = localStorage.getItem(`ensAddress-${currAccount}`);

        if (cachedEns) {
            setEnsAddress(cachedEns);
            return;
        }

        const request = await fetch(`/api/resolve-wallet?name=${currAccount}`);
        const res = await request.json();

        if (res.name) {
            setEnsAddress(res.name);
            localStorage.setItem(`ensAddress-${currAccount}`, res.name);
        }

    };

    useEffect(() => {
        account && getEnsAddress(account);
    }, [account]);

    return ensAddress;
};
