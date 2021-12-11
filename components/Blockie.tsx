import Blockies from "react-blockies";
import { useMoralis } from "react-moralis";

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Blockie(props) {
	const { account } = useMoralis();
	if (!props.address && !account) return <span>Loading...</span>;

	return (
		<Blockies
			seed={
				props.currentWallet
					? account.toLowerCase()
					: props.address.toLowerCase()
			}
			className="rounded-lg"
			{...props}
		/>
	);
}

export default Blockie;
