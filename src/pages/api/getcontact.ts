import type { NextApiRequest, NextApiResponse } from 'next'
import getcontactformdata from '../../server/server/getcontact';
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
    const token =  await req.headers.authorization;
    console.log("token",token);
  
  const response = await  getcontactformdata(token);
 
  
  if (!response) {
    return res.status(400).json({ message: 'Failed to get contact data' })
  }
  return res.status(200).json({ response })
   
}