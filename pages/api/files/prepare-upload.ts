// pages/api/files/prepare-upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { s3 } from '../../../lib/awsClient';
import { verifyCognitoToken } from '../../../lib/cognito';
import { log } from '../../../lib/logger';
import { nanoid } from 'nanoid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    // TEMPORARY: Skip real Cognito token verification for local testing
    const decoded = { sub: 'local-test-user' };


    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({ error: 'filename and contentType are required' });
    }

    const bucket = process.env.S3_BUCKET_NAME!;
    const userId = (decoded as any).sub;
    const key = `uploads/${userId}/${nanoid()}_${filename}`;

    const params = {
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      Expires: 60 * 5,
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

    return res.status(200).json({
      uploadUrl,
      bucket,
      key,
      expiresIn: params.Expires,
    });
  } catch (err: any) {
    log('prepare-upload error:', err.message || err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
