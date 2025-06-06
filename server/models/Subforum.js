// server/models/Subforum.js
import mongoose from 'mongoose';

const subforumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
});

const Subforum = mongoose.model('Subforum', subforumSchema);

export default Subforum;
