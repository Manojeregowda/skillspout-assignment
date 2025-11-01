// lib/cognito.ts
import jwksClient from 'jwks-rsa';
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Configuration for AWS Cognito
 */
const poolId = process.env.COGNITO_USERPOOL_ID!;
const region = process.env.AWS_REGION || 'ap-south-1';
const jwksUri = `https://cognito-idp.${region}.amazonaws.com/${poolId}/.well-known/jwks.json`;

// Create JWKS client (used to get public keys for verifying JWTs)
const client = jwksClient({ jwksUri });

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

/**
 * Verifies a Cognito JWT token and returns the decoded payload.
 * Throws an error if invalid or expired.
 */
export async function verifyCognitoToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ['RS256'],
        issuer: `https://cognito-idp.${region}.amazonaws.com/${poolId}`,
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded as JwtPayload);
      }
    );
  });
}
