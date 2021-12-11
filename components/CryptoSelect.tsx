import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import React, { Fragment } from "react";
import { Wallet } from "../pages/widget/[id]";

export interface CryptoSelectProps {
	availableWallets: Wallet[];
	selectedWalletId: string | undefined;
	handleOnChange: (value: string) => void;
	selectedWallet: Wallet | undefined;
}

const CryptoSelect: React.FC<CryptoSelectProps> = ({
	availableWallets,
	selectedWalletId,
	selectedWallet,
	handleOnChange,
}) => {
	return (
		<Listbox
			value={selectedWalletId}
			onChange={handleOnChange}
			disabled={availableWallets.length < 2}
		>
			<div className="relative w-4/5 h-10 bg-gray-200 mt-4 rounded-md">
				<Listbox.Button className="relative justify-center w-full h-full py-2 pl-3 pr-10 text-left rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-cryptopurple sm:text-sm">
					<span className="block truncate">
						{selectedWallet?.name}
					</span>
					<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
						{availableWallets.length > 1 && (
							<ChevronDownIcon
								className="w-5 h-5 text-gray-400"
								aria-hidden="true"
							/>
						)}
					</span>
				</Listbox.Button>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{availableWallets?.map((wallet, walletIdx) => (
							<Listbox.Option
								key={walletIdx}
								className={({ active }) =>
									`${
										active
											? "text-amber-900 bg-amber-100"
											: "text-gray-900"
									}
                            cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-gray-200`
								}
								value={wallet.id}
							>
								{({ selected, active }) => (
									<>
										<span
											className={`${
												selected
													? "font-medium"
													: "font-normal"
											} block truncate`}
										>
											{wallet.name}
										</span>
										{selected ? (
											<span
												className={`${
													active
														? "text-yellow-500"
														: "text-yellow-600"
												}
                                    absolute inset-y-0 left-0 flex items-center pl-3`}
											>
												<CheckIcon
													className="w-5 h-5"
													aria-hidden="true"
												/>
											</span>
										) : null}
									</>
								)}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	);
};

export default CryptoSelect;
