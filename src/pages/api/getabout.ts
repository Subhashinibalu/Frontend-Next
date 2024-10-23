import type { NextApiRequest, NextApiResponse } from 'next'

import getaboutformdata from '../../server/server/getabout';
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
    const token =  await req.headers.authorization;
    console.log("token",token);
  
  const response = await  getaboutformdata(token);
 
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to get about data' })
  }
  return res.status(200).json({ response })
  
  
}