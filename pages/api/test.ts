import { NextApiRequest, NextApiResponse } from "next";
import { db, firestoreCollections } from "../../utils/firebaseClient";

const init = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const response = await db.collection(firestoreCollections.USERS).get();

		const users = response.docs.map((doc) => doc.data());
		return res.json(users);
	} catch (error) {
		return res.status(error.status || 500).json({
			message: error.message,
			errorCode: 500,
			error,
		});
	}
};

export default init;
