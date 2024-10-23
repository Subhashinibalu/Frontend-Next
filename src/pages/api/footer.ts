import type { NextApiRequest, NextApiResponse } from 'next'
import postFooterData from '../../server/server/footer';

 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const data = await req.body;
    const token =  await req.headers.authorization;
    
  
    console.log(data,token);
  const response = await postFooterData(data, token);
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to create contact data' })
  }
  return res.status(200).json({ response })
  
  
}