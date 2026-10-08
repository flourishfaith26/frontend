import { createHmac } from 'crypto';
import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
    const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
    ];
    const turnUrls = (process.env.TURN_URLS || '')
        .split(',')
        .map(url => url.trim())
        .filter(Boolean);
    const sharedSecret = process.env.TURN_SHARED_SECRET;

    if (turnUrls.length > 0 && sharedSecret) {
        const ttlSeconds = Math.max(60, Number(process.env.TURN_CREDENTIAL_TTL_SECONDS) || 3600);
        const username = `${Math.floor(Date.now() / 1000) + ttlSeconds}:${req.auth.payload.sub}`;
        const credential = createHmac('sha1', sharedSecret)
            .update(username)
            .digest('base64');

        iceServers.push({ urls: turnUrls, username, credential });
    }

    res.json({ iceServers, turnConfigured: iceServers.length > 3 });
});

export default router;
