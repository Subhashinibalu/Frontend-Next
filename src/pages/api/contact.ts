import type { NextApiRequest, NextApiResponse } from 'next'
import postcontactdata from '../../server/server/contact';

 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const data = await req.body;
    const token =  await req.headers.authorization;
    
  
    
  const response = await postcontactdata(data, token);
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to create contact data' })
  }
  return res.status(200).json({ response })
  
  
}