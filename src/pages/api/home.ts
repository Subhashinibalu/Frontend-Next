import type { NextApiRequest, NextApiResponse } from 'next'
import posthomedata from '../../server/server/home';

 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const data = await req.body;
    const token =  await req.headers.authorization;
    
  const response = await posthomedata(data,token)
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to create about data' })
  }
  return res.status(200).json({ response })
  
  
}