/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import Modal from "../Modal";

interface ISuccessTransactionModal {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly title: string;
	readonly onOk: () => void;
	readonly okText: string;
}

const SuccessTransactionModal: React.FC<ISuccessTransactionModal> = ({
	open,
	onClose,
	title,
	onOk,
	okText,
}) => {
	return (
		<Modal
			open={open}
			onClose={onClose}
			title={""}
			onOk={onOk}
			okText={okText}
		>
			<div>
				<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
					<CheckIcon
						className="h-6 w-6 text-green-600"
						aria-hidden="true"
					/>
				</div>
				<div className="mt-3 text-center sm:mt-5">
					<h3 className="text-lg leading-6 font-medium text-gray-900">
						Transaction successful
					</h3>
					<div className="mt-2">
						<p className="text-sm text-gray-500">
							Thanks for donating !!
						</p>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default SuccessTransactionModal;
