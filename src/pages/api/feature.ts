import type { NextApiRequest, NextApiResponse } from 'next'
import postfeaturedata from '../../server/server/feature';


 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    console.log("<------------------------------------------");
    const { id, index, ...data } = req.body;
    const token =  await req.headers.authorization;
    
  const response = await postfeaturedata(id, index, data, token);
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to create about data' })
  }
  return res.status(200).json({ response })
  
  
}