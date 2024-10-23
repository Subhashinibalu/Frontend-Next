import type { NextApiRequest, NextApiResponse } from 'next'
import getfooterformdata from '../../server/server/getfooter';
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const token =  await req.headers.authorization;
    console.log("token",token);
  const response = await  getfooterformdata(token);
  if (!response) {
    return res.status(400).json({ message: 'Failed to get footer data' })
  }
  return res.status(200).json({ response }) 
}