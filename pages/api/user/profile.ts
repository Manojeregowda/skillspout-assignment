// pages/api/user/profile.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyCognitoToken } from '../../../lib/cognito';
import { dynamo } from '../../../lib/awsClient';
import { log } from '../../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const auth = req.headers.authorization;

    // Check for Bearer token
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const token = auth.split(' ')[1];
    const decoded = await verifyCognitoToken(token);
    const userId = (decoded as any).sub || (decoded as any).username;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token: no user ID' });
    }

    // Fetch user profile from DynamoDB
    const tableName = process.env.DDB_TABLE_USERS!;
    const params = {
      TableName: tableName,
      Key: { userId },
    };

    const result = await dynamo.get(params).promise();

    if (!result.Item) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user profile
    return res.status(200).json({ profile: result.Item });
  } catch (err: any) {
    log('Error fetching profile:', err.message);
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
