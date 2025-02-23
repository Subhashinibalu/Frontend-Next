import type { NextApiRequest, NextApiResponse } from 'next'
import getsupportformdata from '../../server/server/getsupport';
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
    const token =  await req.headers.authorization;
    console.log("token",token);
  
  const response = await  getsupportformdata(token);
 
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to get support data' })
  }
  return res.status(200).json({ response })
  
  
}