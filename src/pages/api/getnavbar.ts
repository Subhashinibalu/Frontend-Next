import type { NextApiRequest, NextApiResponse } from 'next'
import getnavbarformdata from '../../server/server/getnavbar';
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
    const token =  await req.headers.authorization;
    console.log("token",token);
  
  const response = await  getnavbarformdata(token);
 
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to get navbar data' })
  }
  return res.status(200).json({ response })
  
  
}