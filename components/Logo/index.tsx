import React from "react";
import Image from "next/image";
import cryptocoffeewhite from "../../assets/cryptocoffeewhite.svg";
import cryptocoffee from "../../assets/cryptocoffee.svg";

const Logo: React.FC<{ isWhite?: boolean }> = ({ isWhite = false }) => {
	return (
		<Image
			height={34}
			width={87}
			src={isWhite ? cryptocoffeewhite : cryptocoffee}
		/>
	);
};

export default Logo;
