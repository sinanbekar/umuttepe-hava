import { NextApiResponse, NextApiRequest } from "next";
import { getKocaeliyiSeyretData } from "../../lib/kocaeliyiseyret";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await getKocaeliyiSeyretData();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    // Sends error to the client side
    res.status(500).send({ error: "Internal Server Error" });
  }
}
