import { ArrowUpIcon, LinkIcon } from "@heroicons/react/solid";
import copy from "copy-to-clipboard";
import React from "react";
import Blockies from "react-blockies";
import { toast } from "react-toastify";
import { Transaction } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";
import { minimizeAddress } from "../utils";
import { getTxnUrl } from "../utils/getTxnUrl";

export interface TransactionsProps {
	readonly twitterIntent: string;
	readonly transactions: Transaction[];
}

const Transactions: React.FC<TransactionsProps> = ({
	twitterIntent,
	transactions,
}) => {
	const { account } = useMoralisData();

	return (
		<div className="bg-white mt-8 sm:rounded-lg sm:overflow-hidden">
			<div className="mb-8">
				<h2
					id="notes-title"
					className="text-xl font-urbanist font-bold text-gray-900"
				>
					Recent Supporters 🤝
				</h2>
			</div>
			{!!transactions?.length ? (
				<div>
					<ul role="list" className="space-y-6">
						{transactions.map((transaction, index) => {
							const transactionURL = getTxnUrl(
								transaction?.id,
								transaction?.chain
							);

							return (
								<li
									key={index}
									className="p-4 bg-lightpurple rounded-xl border border-cryptopurple relative group"
								>
									<div className="flex space-x-3">
										<div className="flex-shrink-0">
											{!!transaction.senderAvatar && (
												<img
													className="h-12 w-12 rounded-full"
													src={
														transaction.senderAvatar
													}
													alt={transaction.from}
												/>
											)}
											{!transaction.senderAvatar && (
												<Blockies
													seed={transaction?.from}
													size={8}
													scale={6}
													className="rounded-full"
												/>
											)}
										</div>
										<div>
											<div className="text-lg">
												<span
													data-tip={transaction?.from}
												>
													{transaction?.from.toLowerCase() ===
													account?.toLowerCase()
														? "You "
														: `${
																transaction.fromEns ||
																minimizeAddress(
																	transaction?.from
																)
														  } `}
												</span>
												bought a CryptoCoffee 🎉
											</div>
											<div className="inline-block mr-1 font-urbanist font-semibold text-base">
												{!!transaction.formattedAmount ? (
													transaction.formattedAmount
												) : (
													<span>
														{/* {Moralis.Units.FromWei(
																						transaction?.amount,
																						Number(
																							transaction.tokenDecimals
																						)
																					)} */}
														{transaction?.amount}
														<span className="font-normal mx-2">
															Ξ
														</span>
													</span>
												)}
											</div>
										</div>
									</div>
									{!!transaction?.message.length && (
										<>
											<div className="w-0 ml-5 mt-6 border-8 border-transparent border-b-8 border-b-white" />
											<div className="bg-white rounded-md w-max p-4 text-base text-gray-700">
												<p>{transaction.message}</p>
											</div>
										</>
									)}
									<a
										className="cursor-pointer absolute flex items-center justify-center rounded-full w-6 h-6 bg-cryptoblue right-4 bottom-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
										href={transactionURL}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ArrowUpIcon className="w-4 h-4 rotate-45 text-white" />
									</a>
								</li>
							);
						})}
					</ul>
				</div>
			) : (
				<div className="w-3/5 xs:w-full mx-auto flex font-urbanist items-center flex-col justify-center h-80 xs:h-60">
					<span className="text-2xl font-bold">
						No supporters yet! 🙂
					</span>
					<span className="text-center">
						That’s Okay! We all should start somewhere, Share your
						CryptoCoffee page with your audience
					</span>
					<div className="text-cryptopurple flex mt-8 space-x-4 xs:text-sm">
						<button
							className="flex items-center border border-cryptopurple px-5 py-2 rounded-lg"
							onClick={() => {
								copy(window.location.href);
								toast.success("Copied to clipboard!", {
									position: "top-center",
								});
							}}
						>
							Copy Page Link
							<LinkIcon className="w-4 h-4 ml-2" />
						</button>
						<a
							className="flex items-center border border-twitterblue text-twitterblue px-5 py-2 rounded-lg"
							href={`https://twitter.com/intent/tweet?text=${twitterIntent}`}
							target="_blank"
							rel="noreferrer noopener"
						>
							Tweet This
							<svg
								className="ml-2"
								width="16"
								height="14"
								viewBox="0 0 22 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M21 1.01001C20 1.50001 19.02 1.69901 18 2.00001C16.879 0.735013 15.217 0.665013 13.62 1.26301C12.023 1.86101 10.977 3.32301 11 5.00001V6.00001C7.755 6.08301 4.865 4.60501 3 2.00001C3 2.00001 -1.182 9.43301 7 13C5.128 14.247 3.261 15.088 1 15C4.308 16.803 7.913 17.423 11.034 16.517C14.614 15.477 17.556 12.794 18.685 8.77501C19.0218 7.55268 19.189 6.28987 19.182 5.02201C19.18 4.77301 20.692 2.25001 21 1.00901V1.01001Z"
									stroke="#1DA1F2"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</a>
					</div>
				</div>
			)}
		</div>
	);
};

export default Transactions;
