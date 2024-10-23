import type { NextApiRequest, NextApiResponse } from 'next'
import postaboutdata from '../../server/server/about'
import postregisterdata from '../../server/server/register';
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const data = await req.body;
    
  const response = await postregisterdata(data)
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to create about data' })
  }
  return res.status(200).json({ response })
  
  
}