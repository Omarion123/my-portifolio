import { Request, Response } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  AuthenticatorTransportFuture,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/types';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { User } from '../models/User';
import { Credential } from '../models/Credential';
import jwt from 'jsonwebtoken';

// RP (Relying Party) config — must match your domain in production
const RP_NAME = 'Portfolio Admin';
const RP_ID = process.env.WEBAUTHN_RP_ID ?? 'localhost';
const ORIGIN = process.env.WEBAUTHN_ORIGIN ?? 'http://localhost:4200';

// Temporary in-memory challenge store keyed by userId
const challengeStore = new Map<string, string>();

function signToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  } as import('jsonwebtoken').SignOptions);
}

// ── Registration ──────────────────────────────────────────────────────────────

export async function getRegistrationOptions(
  req: Request & { userId?: string },
  res: Response
): Promise<void> {
  const user = await User.findById(req.userId);
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }

  const existingCredentials = await Credential.find({ userId: req.userId });

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: Buffer.from(user.id),
    userName: user.email,
    userDisplayName: user.email,
    attestationType: 'none',
    excludeCredentials: existingCredentials.map(c => ({
      id: c.credentialId,
      transports: ['internal'] as AuthenticatorTransportFuture[],
    })),
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      residentKey: 'preferred',
    },
  });

  challengeStore.set(req.userId!, options.challenge);
  res.json(options);
}

export async function verifyRegistration(
  req: Request & { userId?: string },
  res: Response
): Promise<void> {
  const user = await User.findById(req.userId);
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }

  const expectedChallenge = challengeStore.get(req.userId!);
  if (!expectedChallenge) {
    res.status(400).json({ message: 'No challenge found — request options first' });
    return;
  }

  const { response, deviceName } = req.body as {
    response: RegistrationResponseJSON;
    deviceName?: string;
  };

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.registrationInfo) {
    res.status(400).json({ message: 'Verification failed' });
    return;
  }

  const { credential } = verification.registrationInfo;

  await Credential.create({
    userId: req.userId,
    credentialId: credential.id,
    publicKey: isoBase64URL.fromBuffer(credential.publicKey),
    counter: credential.counter,
    deviceName: deviceName ?? 'My device',
  });

  challengeStore.delete(req.userId!);
  res.json({ verified: true });
}

// ── Authentication ────────────────────────────────────────────────────────────

export async function getAuthenticationOptions(req: Request, res: Response): Promise<void> {
  const user = await User.findOne({ email: req.query['email'] as string });
  if (!user) {
    // Return generic options so we don't leak whether the email exists
    const options = await generateAuthenticationOptions({ rpID: RP_ID, userVerification: 'required' });
    res.json(options);
    return;
  }

  const credentials = await Credential.find({ userId: user.id });
  if (credentials.length === 0) {
    res.status(404).json({ message: 'No passkey registered for this account' });
    return;
  }

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials: credentials.map(c => ({
      id: c.credentialId,
      transports: ['internal'] as AuthenticatorTransportFuture[],
    })),
    userVerification: 'required',
  });

  challengeStore.set(user.id, options.challenge);
  res.json({ ...options, userId: user.id });
}

export async function verifyAuthentication(req: Request, res: Response): Promise<void> {
  const { response, userId } = req.body as {
    response: AuthenticationResponseJSON;
    userId: string;
  };

  const expectedChallenge = challengeStore.get(userId);
  if (!expectedChallenge) {
    res.status(400).json({ message: 'No challenge found — request options first' });
    return;
  }

  const credential = await Credential.findOne({ credentialId: response.id, userId });
  if (!credential) {
    res.status(404).json({ message: 'Passkey not recognised' });
    return;
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
    requireUserVerification: true,
    credential: {
      id: credential.credentialId,
      publicKey: isoBase64URL.toBuffer(credential.publicKey),
      counter: credential.counter,
    },
  });

  if (!verification.verified) {
    res.status(401).json({ message: 'Verification failed' });
    return;
  }

  // Update counter to guard against replay attacks
  credential.counter = verification.authenticationInfo.newCounter;
  await credential.save();

  challengeStore.delete(userId);

  const user = await User.findById(userId).select('-password');
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }

  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email } });
}

// ── List / Delete credentials ─────────────────────────────────────────────────

export async function listCredentials(
  req: Request & { userId?: string },
  res: Response
): Promise<void> {
  const credentials = await Credential.find({ userId: req.userId }).select('-publicKey');
  res.json(credentials);
}

export async function deleteCredential(
  req: Request & { userId?: string },
  res: Response
): Promise<void> {
  const deleted = await Credential.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });
  if (!deleted) { res.status(404).json({ message: 'Credential not found' }); return; }
  res.status(204).end();
}
