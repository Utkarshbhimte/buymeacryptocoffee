import { Fragment, ReactNode, ReactText, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

const people = [
	{ id: 1, name: "Wade Cooper" },
	{ id: 2, name: "Arlene Mccoy" },
	{ id: 3, name: "Devon Webb" },
	{ id: 4, name: "Tom Cook" },
	{ id: 5, name: "Tanya Fox" },
	{ id: 6, name: "Hellen Schmidt" },
	{ id: 7, name: "Caroline Schultz" },
	{ id: 8, name: "Mason Heaney" },
	{ id: 9, name: "Claudie Smitham" },
	{ id: 10, name: "Emil Schaefer" },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

interface IOptionProps {
	readonly key: string;
	readonly label: string | ReactNode;
}

interface ISelectProps {
	readonly options: IOptionProps[];
	readonly onChange: (value: string) => void;
	readonly value: string;
	readonly placeholder?: string;
}

const Select: React.FC<ISelectProps> = ({
	options,
	onChange,
	value,
	placeholder,
}) => {
	const selectedValue = options.find((option) => option.key === value);

	return (
		<Listbox
			value={selectedValue}
			onChange={(option) => onChange(option.key)}
		>
			{({ open }) => (
				<>
					<div className="mt-1 relative">
						<Listbox.Button className="bg-white relative w-full border border-gray-200 rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-cryptopurple focus:border-cryptopurple sm:text-sm">
							<span className="block truncate">
								{selectedValue?.label ?? (
									<span>
										{placeholder ?? "Select an option"}
									</span>
								)}
							</span>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<SelectorIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="w-48 absolute z-10 mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
								{options.map((option) => (
									<Listbox.Option
										key={option.key}
										className={({ active }) =>
											classNames(
												active
													? "text-white bg-indigo-600"
													: "text-gray-900",
												"cursor-default select-none relative py-2 pl-3 pr-9"
											)
										}
										value={option}
									>
										{({ selected, active }) => (
											<>
												<span
													className={classNames(
														selected
															? "font-semibold"
															: "font-normal",
														"block truncate"
													)}
												>
													{option.label}
												</span>

												{selected ? (
													<span
														className={classNames(
															active
																? "text-white"
																: "text-indigo-600",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}
													>
														<CheckIcon
															className="h-5 w-5"
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
				</>
			)}
		</Listbox>
	);
};

export default Select;
