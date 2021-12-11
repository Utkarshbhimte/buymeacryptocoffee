import React, { useEffect, useState } from "react";
import { getUser } from "../../utils";
import { useUser } from "../../utils/context";
import { db, firestoreCollections, storage } from "../../utils/firebaseClient";
import Modal from "../Modal";

interface IProfileModal {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly userAddress: string;
}

const ProfileModal: React.FC<IProfileModal> = ({
	open,
	onClose,
	userAddress,
}) => {
	// const { setUser, user } = useUser();

	// const [name, setName] = useState(user?.name ?? "");
	// const [description, setDescription] = useState(user?.description ?? "");
	// const [image, setImage] = useState<File>();
	// const [coverImageFile, setCoverImageFile] = useState<File>();

	// useEffect(() => {
	// 	if (user) {
	// 		setName(user.name);
	// 		setDescription(user.description);
	// 	}
	// }, [user]);
	// const handleProfileUpdate = async () => {
	// 	if (!name || !description || !userAddress) {
	// 		return;
	// 	}
	// 	try {
	// 		const profileResponse =
	// 			image && (await storage.ref(`profiles/${user.id}`).put(image));
	// 		const coverImageResponse =
	// 			coverImageFile &&
	// 			(await storage
	// 				.ref(`cover-images/${user.id}`)
	// 				.put(coverImageFile));

	// 		const profileImage =
	// 			profileResponse && (await profileResponse.ref.getDownloadURL());
	// 		const coverImage =
	// 			coverImageResponse &&
	// 			(await coverImageResponse.ref.getDownloadURL());

	// 		console.log({
	// 			name,
	// 			description,
	// 			profileImage: profileImage ?? user.profileImage,
	// 			coverImage: coverImage ?? user.coverImage,
	// 		});

	// 		await db
	// 			.doc(`${firestoreCollections.USERS}/${userAddress}`)
	// 			.update({
	// 				name,
	// 				description,
	// 				profileImage: profileImage ?? user.profileImage,
	// 				coverImage: coverImage ?? user.coverImage,
	// 			});

	// 		const updatedUser = await getUser(userAddress);

	// 		setUser({
	// 			...updatedUser,
	// 			id: userAddress,
	// 		});

	// 		onClose();
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };

	return (
		<div />
		// <Modal
		// 	title="Edit profile details"
		// 	open={open}
		// 	onClose={onClose}
		// 	okText="Save"
		// 	onOk={handleProfileUpdate}
		// 	width="w-1/2"
		// >
		// 	<form className="space-y-8 divide-y divide-gray-200 text-left">
		// 		<div className="space-y-8 divide-y divide-gray-200">
		// 			<div>
		// 				<div className="sm:col-span-6">
		// 					<label className="block text-sm font-medium text-gray-700">
		// 						Photo
		// 					</label>
		// 					<label
		// 						htmlFor="profile-upload"
		// 						className="mt-1 flex items-center"
		// 					>
		// 						<span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
		// 							<svg
		// 								className="h-full w-full text-gray-300"
		// 								fill="currentColor"
		// 								viewBox="0 0 24 24"
		// 							>
		// 								<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
		// 							</svg>
		// 						</span>
		// 						<input
		// 							id="profile-upload"
		// 							name="profile-upload"
		// 							type="file"
		// 							className="sr-only"
		// 							onChange={(e) =>
		// 								setImage(e.target.files[0])
		// 							}
		// 						/>
		// 						<div className="cursor-pointer ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cryptopurple">
		// 							Change
		// 						</div>
		// 					</label>
		// 				</div>

		// 				<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
		// 					<div className="sm:col-span-4">
		// 						<label
		// 							htmlFor="username"
		// 							className="block text-sm font-medium text-gray-700"
		// 						>
		// 							Name
		// 						</label>
		// 						<div className="mt-1 flex rounded-md shadow-sm">
		// 							<input
		// 								type="text"
		// 								name="username"
		// 								id="username"
		// 								autoComplete="username"
		// 								value={name}
		// 								onChange={(e) =>
		// 									setName(e.target.value)
		// 								}
		// 								className="flex-1 focus:ring-cryptopurple focus:border-cryptopurple block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
		// 							/>
		// 						</div>
		// 					</div>

		// 					<div className="sm:col-span-6">
		// 						<label
		// 							htmlFor="about"
		// 							className="block text-sm font-medium text-gray-700"
		// 						>
		// 							Description
		// 						</label>
		// 						<div className="mt-1">
		// 							<textarea
		// 								id="about"
		// 								name="about"
		// 								rows={3}
		// 								value={description}
		// 								onChange={(e) =>
		// 									setDescription(e.target.value)
		// 								}
		// 								className="shadow-sm focus:ring-cryptopurple focus:border-cryptopurple block w-full sm:text-sm border border-gray-300 rounded-md"
		// 								defaultValue={""}
		// 							/>
		// 						</div>
		// 						<p className="mt-2 text-sm text-gray-500">
		// 							Write a few sentences about yourself.
		// 						</p>
		// 					</div>

		// 					<div className="sm:col-span-6">
		// 						<label
		// 							htmlFor="cover-photo"
		// 							className="block text-sm font-medium text-gray-700"
		// 						>
		// 							Cover photo
		// 						</label>
		// 						<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
		// 							<div className="space-y-1 text-center">
		// 								<svg
		// 									className="mx-auto h-12 w-12 text-gray-400"
		// 									stroke="currentColor"
		// 									fill="none"
		// 									viewBox="0 0 48 48"
		// 									aria-hidden="true"
		// 								>
		// 									<path
		// 										d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
		// 										strokeWidth={2}
		// 										strokeLinecap="round"
		// 										strokeLinejoin="round"
		// 									/>
		// 								</svg>
		// 								<div className="flex text-sm text-gray-600">
		// 									<label
		// 										htmlFor="cover-image-upload"
		// 										className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-cryptopurple focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cryptopurple"
		// 									>
		// 										<span>Upload a file</span>
		// 										<input
		// 											id="cover-image-upload"
		// 											name="cover-image-upload"
		// 											type="file"
		// 											className="sr-only"
		// 											onChange={(e) =>
		// 												setCoverImageFile(
		// 													e.target.files[0]
		// 												)
		// 											}
		// 										/>
		// 									</label>
		// 									<p className="pl-1">
		// 										or drag and drop
		// 									</p>
		// 								</div>
		// 								<p className="text-xs text-gray-500">
		// 									PNG, JPG, GIF up to 10MB
		// 								</p>
		// 							</div>
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</form>
		// </Modal>
	);
};

export default ProfileModal;
