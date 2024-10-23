import type { NextApiRequest, NextApiResponse } from 'next'
import postsupportdata from '../../server/server/support';

 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const data = await req.body;
    const token =  await req.headers.authorization;
    
  const response = await postsupportdata(data,token)
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to create about data' })
  }
  return res.status(200).json({ response })
  
  
}