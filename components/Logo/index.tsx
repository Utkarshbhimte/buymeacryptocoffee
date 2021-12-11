import React from "react";
import Image from "next/image";
import cryptocoffee from "../../assets/cryptocoffee.png";
import cryptocoffeewhite from "../../assets/cryptocoffeewhite.png";

const Logo: React.FC<{ isWhite?: boolean }> = ({ isWhite = false }) => {
	return (
		<div className="font-urbanist font-semibold text-2xl">
			<Image src={isWhite ? cryptocoffeewhite : cryptocoffee} />
		</div>
	);
};

export default Logo;
