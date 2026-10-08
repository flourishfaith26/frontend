import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema({
    caller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Make optional for group calls
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }, // Link to the group conversation
    type: { type: String, enum: ['video', 'audio'], required: true },
    status: { type: String, enum: ['completed', 'missed', 'rejected'], required: true },
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('CallLog', callLogSchema);
