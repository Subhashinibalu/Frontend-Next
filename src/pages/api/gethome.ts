import type { NextApiRequest, NextApiResponse } from 'next'

import getaboutformdata from '../../server/server/getabout';
import gethomeformdata from '../../server/server/gethome';
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
    const token =  await req.headers.authorization;
    console.log("token",token);
  
  const response = await  gethomeformdata(token);
 
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to get home data' })
  }
  return res.status(200).json({ response })
  
  
}