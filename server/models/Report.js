import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
    {
        thread: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread',
            required: [true, 'Report must be associated with a thread'],
        },
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Report must be associated with a reporter'],
        },
        reason: {
            type: String,
            required: [true, 'A reason for reporting is required'],
            maxlength: [500, 'Report reason cannot exceed 500 characters'],
        },
        status: {
            type: String,
            enum: ['pending', 'resolved'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
