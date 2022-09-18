import { NextApiResponse, NextApiRequest } from "next";
import { getWeatherData } from "../../lib/weather";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await getWeatherData();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    // Sends error to the client side
    res.status(500).send({ error: "Internal Server Error" });
  }
}
