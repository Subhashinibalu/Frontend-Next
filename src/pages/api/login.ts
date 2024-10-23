import type { NextApiRequest, NextApiResponse } from 'next';
import postlogindata from '../../server/server/login';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body;

  try {
    const response = await postlogindata(data); ;

    // Check if the response contains a token
    const token = response.data.token;
    const user =response.data.user

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed, no token received' });
    }

    // Send back the token in the response
    return res.status(200).json({ token , user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
