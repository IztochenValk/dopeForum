// server/models/Thread.js
import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true, trim: true },
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        subforum: { type: mongoose.Schema.Types.ObjectId, ref: 'Subforum', required: false }, // Make optional
        tags: [{ type: String, trim: true }], // Array of tag names
        locked: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
        replies: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Thread = mongoose.model('Thread', threadSchema);
export default Thread;
