// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ENSResponse, validateAndResolveAddress } from '../../utils/crypto';

type Data = ENSResponse & {
  error?: string | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // get wallet name from query
    const name = req.query.name as string
    const URL = "https://speedy-nodes-nyc.moralis.io/d35afcfb3d409232f26629cd/eth/mainnet"

    const provider = new ethers.providers.JsonRpcProvider(URL);

    const ensResponse = await validateAndResolveAddress(name, provider)
    res.status(200).json(ensResponse)
  } catch (error) {
    res.status(404).json({ error: (error as any).message })
  }
}
