// lib/awsClient.ts
import AWS from 'aws-sdk';

// Set the AWS region (default ap-south-1, but can be changed via .env)
const region = process.env.AWS_REGION || 'ap-south-1';
AWS.config.update({ region });

// Export reusable AWS clients
export const s3 = new AWS.S3();
export const dynamo = new AWS.DynamoDB.DocumentClient();
export const sqs = new AWS.SQS();
