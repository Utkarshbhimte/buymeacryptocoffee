import { getExplorer } from "../helpers/networks"

export const getTxnUrl = (txnId: string, chainId: string = "0x1") => {
    return getExplorer(chainId) + 'tx/' + txnId
}
