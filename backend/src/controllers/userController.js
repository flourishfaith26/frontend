import User from '../models/User.js';
import { normalizeUsername, validateUsernameFormat } from '../utils/username.js';

export const syncUser = async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub; 
    
    const { email, displayName, avatarUrl, techDiscipline } = req.body;

    let user = await User.findOne({ auth0Id });
    
    if (!user) {
      user = await User.create({ auth0Id, email, displayName, avatarUrl, techDiscipline });
    } else {
      // Only update email unconditionally
      user.email = email;
      // Do not overwrite user's custom avatar or display name if they already exist
      if (!user.avatarUrl) user.avatarUrl = avatarUrl;
      if (!user.displayName) user.displayName = displayName;
      if (techDiscipline && !user.techDiscipline) user.techDiscipline = techDiscipline;
      if (user.username && !user.hasCompletedProfile) user.hasCompletedProfile = true;
      await user.save();
    }

    await user.populate('blockedUsers', '_id displayName username avatarUrl techDiscipline about');

    res.status(200).json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ message: 'Internal server error during user sync' });
  }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const auth0Id = req.auth.payload.sub;
        const { displayName, avatarUrl, about, techDiscipline, githubProfile, linkedinProfile, portfolioUrl, verificationProof, hasCompletedProfile, readReceipts, username } = req.body;

        const updateData = {};
        if (displayName !== undefined) updateData.displayName = displayName;
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
        if (about !== undefined) updateData.about = about;
        if (techDiscipline !== undefined) updateData.techDiscipline = techDiscipline;
        if (githubProfile !== undefined) updateData.githubProfile = githubProfile;
        if (linkedinProfile !== undefined) updateData.linkedinProfile = linkedinProfile;
        if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;
        if (verificationProof !== undefined) updateData.verificationProof = verificationProof;
        if (hasCompletedProfile !== undefined) updateData.hasCompletedProfile = hasCompletedProfile;
        if (readReceipts !== undefined) updateData.readReceipts = readReceipts;
        
        if (username !== undefined) {
            const cleanUsername = normalizeUsername(username);
            const validation = validateUsernameFormat(cleanUsername);
            if (!validation.isValid) {
                return res.status(400).json({ message: validation.error });
            }

            // Check if username is already taken by another user
            const existing = await User.findOne({
                username: cleanUsername,
                auth0Id: { $ne: auth0Id }
            });
            if (existing) {
                return res.status(409).json({ message: `@${cleanUsername} is already taken. Please choose another.` });
            }

            updateData.username = cleanUsername;
            updateData.hasCompletedProfile = true;
        }

        const user = await User.findOneAndUpdate(
            { auth0Id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Username is already taken. Please choose another.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error updating profile' });
    }
};

export const checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ available: false, message: 'Username is required.' });
        }

        const cleanUsername = normalizeUsername(username);
        const validation = validateUsernameFormat(cleanUsername);
        if (!validation.isValid) {
            return res.status(200).json({ 
                available: false, 
                normalized: cleanUsername,
                message: validation.error 
            });
        }

        const auth0Id = req.auth.payload.sub;
        const existing = await User.findOne({ 
            username: cleanUsername, 
            auth0Id: { $ne: auth0Id } 
        });

        if (existing) {
            return res.status(200).json({ 
                available: false, 
                normalized: cleanUsername,
                message: `@${cleanUsername} is already taken.` 
            });
        }

        return res.status(200).json({ 
            available: true, 
            normalized: cleanUsername,
            message: `@${cleanUsername} is available!` 
        });
    } catch (error) {
        console.error('Error checking username availability:', error);
        res.status(500).json({ available: false, message: 'Server error checking username.' });
    }
};

export const searchByUsername = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ message: 'Username query must be at least 2 characters.' });
        }
        const cleanQuery = normalizeUsername(username);
        if (cleanQuery.length < 2) {
            return res.status(400).json({ message: 'Username query must be at least 2 characters.' });
        }
        const auth0Id = req.auth.payload.sub;
        const currentUser = await User.findOne({ auth0Id }).select('_id');

        // Escape regex special chars so queries like "john.doe" match literal "."
        const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Find users whose username or displayName matches query
        const results = await User.find({
            _id: { $ne: currentUser?._id },
            $or: [
                { username: { $regex: escaped, $options: 'i' } },
                { displayName: { $regex: escaped, $options: 'i' } }
            ]
        }).select('_id displayName username avatarUrl techDiscipline onlineStatus').limit(20);

        // Sort results: exact username match first, then prefix username match, then others
        const sorted = [...results].sort((a, b) => {
            const aName = (a.username || '').toLowerCase();
            const bName = (b.username || '').toLowerCase();
            const q = cleanQuery.toLowerCase();
            if (aName === q) return -1;
            if (bName === q) return 1;
            const aStarts = aName.startsWith(q);
            const bStarts = bName.startsWith(q);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return 0;
        });

        res.status(200).json(sorted);
    } catch (error) {
        console.error('Error searching users by username:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const blockUser = async (req, res) => {
    try {
        const auth0Id = req.auth.payload.sub;
        const { targetUserId } = req.params;

        const currentUser = await User.findOne({ auth0Id });
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        if (currentUser._id.toString() === targetUserId) {
            return res.status(400).json({ message: 'You cannot block yourself' });
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ message: 'Target user not found' });

        if (!currentUser.blockedUsers) {
            currentUser.blockedUsers = [];
        }

        const alreadyBlocked = currentUser.blockedUsers.some(id => id.toString() === targetUserId);
        if (!alreadyBlocked) {
            currentUser.blockedUsers.push(targetUserId);
            await currentUser.save();
        }

        await currentUser.populate('blockedUsers', '_id displayName username avatarUrl techDiscipline about');

        res.status(200).json({ 
            success: true, 
            message: `User ${targetUser.displayName || targetUser.username} blocked`, 
            blockedUsers: currentUser.blockedUsers 
        });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ message: 'Internal server error while blocking user' });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const auth0Id = req.auth.payload.sub;
        const { targetUserId } = req.params;

        const currentUser = await User.findOne({ auth0Id });
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        if (!currentUser.blockedUsers) {
            currentUser.blockedUsers = [];
        }

        currentUser.blockedUsers = currentUser.blockedUsers.filter(id => id.toString() !== targetUserId);
        await currentUser.save();

        await currentUser.populate('blockedUsers', '_id displayName username avatarUrl techDiscipline about');

        res.status(200).json({ 
            success: true, 
            message: 'User unblocked successfully', 
            blockedUsers: currentUser.blockedUsers 
        });
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({ message: 'Internal server error while unblocking user' });
    }
};

export const getBlockedUsers = async (req, res) => {
    try {
        const auth0Id = req.auth.payload.sub;
        const currentUser = await User.findOne({ auth0Id }).populate('blockedUsers', '_id displayName username avatarUrl techDiscipline about');
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(currentUser.blockedUsers || []);
    } catch (error) {
        console.error('Error fetching blocked users:', error);
        res.status(500).json({ message: 'Internal server error fetching blocked users' });
    }
};

export const lookupUser = async (req, res) => {
    try {
        const { identifier } = req.query;
        if (!identifier || typeof identifier !== 'string') {
            return res.status(400).json({ message: 'Username or email identifier is required.' });
        }
        const cleanIdentifier = identifier.trim().toLowerCase();
        const cleanUsername = normalizeUsername(identifier);

        const user = await User.findOne({
            $or: [
                { email: cleanIdentifier },
                { username: cleanUsername }
            ]
        }).select('email username displayName avatarUrl');

        if (!user) {
            return res.status(404).json({ message: 'No account found with that username or email.' });
        }

        res.status(200).json({
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl
        });
    } catch (error) {
        console.error('Error in lookupUser:', error);
        res.status(500).json({ message: 'Internal server error during user lookup' });
    }
};