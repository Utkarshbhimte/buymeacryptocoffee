import { NextApiRequest, NextApiResponse } from "next";
import { getOrCreateUser } from "../../utils";

const init = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method !== "GET") {
			return res
				.status(401)
				.json({ ok: false, error: "Method not allowed" });
		}

		const { address: userAddress } = req.query;

		const user = await getOrCreateUser(
			userAddress.toString().toLowerCase()
		);

		res.status(200).json(user);
	} catch (error) {
		return res.status(error.status || 500).json({
			message: error.message,
			errorCode: 500,
			error,
		});
	}
};

export default init;
