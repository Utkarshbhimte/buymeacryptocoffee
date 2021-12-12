import { NextApiRequest, NextApiResponse } from "next";
import { Transaction } from "../../contracts";
import { db, firestoreCollections } from "../../utils/firebaseClient";
import Cors from 'cors'

const cors = Cors({
	methods: ['GET', 'HEAD'],
})

function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
	  fn(req, res, (result) => {
		if (result instanceof Error) {
		  return reject(result)
		}
  
		return resolve(result)
	  })
	})
  }

const initialData = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		// fetch all transaction from firebase with cronStatus of pending
		await runMiddleware(req, res, cors)

		const response = await db
			.collection(firestoreCollections.TRANSACTIONS)
			.where("cronStatus", "==", "pending")
			.get();

		const transactions = response.docs.map(
			(doc) => doc.data() as Transaction
		);

		const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
		if (!etherscanApiKey) {
			throw new Error("Etherscan API key not found");
		}

		const promises = transactions.map(async (transaction) => {
			const { id } = transaction;

			const etherscanApiUrl = `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${id}&apikey=${etherscanApiKey}`;

			const etherscanResponse = await fetch(etherscanApiUrl);
			const etherscanData = await etherscanResponse.json();

			console.log(etherscanData);

			await db.doc(`${firestoreCollections.TRANSACTIONS}/${id}`).update({
				cronStatus: "success",
				status: etherscanData.status == 1 ? "success" : "failure",
			});
		});

		Promise.all(promises);

		res.status(200).json({
			success: true
		});
	} catch (error) {
		return res.status(error.status || 500).json({
			message: error.message,
			errorCode: 500,
			error,
		});
	}
};

export default initialData;
