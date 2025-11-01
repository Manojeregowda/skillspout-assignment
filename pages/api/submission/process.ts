// pages/api/submission/process.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { sqs } from '../../../lib/awsClient';
import { log } from '../../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // Read submission payload from request body
    const { fileKey, userId, metadata } = req.body;

    if (!fileKey || !userId) {
      return res.status(400).json({ error: 'fileKey and userId are required' });
    }

    // Prepare SQS message payload
    const messageBody = JSON.stringify({
      fileKey,
      userId,
      metadata: metadata || {},
      receivedAt: new Date().toISOString(),
    });

    // Send message to SQS
    const queueUrl = process.env.SQS_QUEUE_URL!;
    const params = {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
    };

    // TEMPORARY MOCK: Skip actual SQS call for local testing
    const fakeMessageId = `local-${Math.random().toString(36).substring(2, 10)}`;
    log('submission enqueued (mock):', fakeMessageId);

    return res.status(202).json({
      accepted: true,
      messageId: fakeMessageId,
      queue: queueUrl || 'local-demo-queue',
    });

  } catch (err: any) {
    log('submission error:', err.message || err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
