import Message from '../models/Message.js';

import User from '../models/User.js';

// Fetch all messages for a specific conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const auth0Id = req.auth.payload.sub;
    const currentUser = await User.findOne({ auth0Id });

    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const messages = await Message.find({ 
      conversationId,
      deletedFor: { $ne: currentUser._id } 
    })
      .populate('sender', 'displayName avatarUrl')
      .populate({
        path: 'replyTo',
        select: 'content sender isCodeSnippet caption',
        populate: { path: 'sender', select: 'displayName' }
      })
      .sort({ sequence: 1, createdAt: 1, _id: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};