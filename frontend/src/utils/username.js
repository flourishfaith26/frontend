export const normalizeUsername = (raw) => {
    if (!raw || typeof raw !== 'string') return '';
    return raw.trim().replace(/^@+\s*/, '').replace(/\s+/g, '').toLowerCase();
};

export const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/;

export const validateUsernameFormat = (raw) => {
    const normalized = normalizeUsername(raw);
    if (!normalized) {
        return { isValid: false, error: 'Username is required.', normalized: '' };
    }
    if (normalized.length < 3) {
        return { isValid: false, error: 'Username must be at least 3 characters long.', normalized };
    }
    if (normalized.length > 30) {
        return { isValid: false, error: 'Username must be at most 30 characters long.', normalized };
    }
    if (!/^[a-z0-9._]+$/.test(normalized)) {
        return { 
            isValid: false, 
            error: 'Username can only contain letters, numbers, underscores (_), and periods (.).', 
            normalized 
        };
    }
    return { isValid: true, error: null, normalized };
};

export const formatUsername = (username) => {
    if (!username) return '';
    const clean = normalizeUsername(username);
    return clean ? `@${clean}` : '';
};
