import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getRegistrationOptions,
  verifyRegistration,
  getAuthenticationOptions,
  verifyAuthentication,
  listCredentials,
  deleteCredential,
} from '../controllers/webAuthnController';

const router = Router();

// Public — no auth needed (user is logging in)
router.get('/login/options',    getAuthenticationOptions);
router.post('/login/verify',    verifyAuthentication);

// Protected — must already be logged in to register a passkey
router.get('/register/options', requireAuth, getRegistrationOptions);
router.post('/register/verify', requireAuth, verifyRegistration);
router.get('/credentials',      requireAuth, listCredentials);
router.delete('/credentials/:id', requireAuth, deleteCredential);

export default router;
