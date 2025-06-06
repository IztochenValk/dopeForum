import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Thread from './models/Thread.js';
import Subforum from './models/Subforum.js'; // Import Subforum model

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected for seeding"))
    .catch(error => console.error("Error connecting to MongoDB:", error));

const seedThreads = async () => {
    try {
        // Optional: Clear existing threads if desired
        await Thread.deleteMany();

        // Fetch all subforums or create sample ones if none exist
        let subforums = await Subforum.find();

        if (subforums.length === 0) {
            // If no subforums, create a few sample ones
            const sampleSubforums = [
                { name: 'General Discussion' },
                { name: 'Announcements' },
                { name: 'Feedback' },
                { name: 'Support' }
            ];
            subforums = await Subforum.insertMany(sampleSubforums);
            console.log("Sample subforums created");
        }

        // Mock user ID to use as the creator for all threads
        const mockUserId = "64b3e82e6e4b3b1f847e6b0a"; // Replace with an actual ObjectId from your User collection if available

        // Create sample threads with assigned subforums
        const threads = Array.from({ length: 20 }, (_, i) => {
            const randomSubforum = subforums[Math.floor(Math.random() * subforums.length)];
            return {
                title: `Sample Thread ${i + 1}`,
                content: `This is sample content for thread number ${i + 1}.`,
                creator: mockUserId,  // Assign a creator ID
                tags: ['sample', 'test'],
                subforum: randomSubforum._id  // Assign a random subforum ID
            };
        });

        // Insert threads into the database
        await Thread.insertMany(threads);
        console.log("20 sample threads with assigned subforums have been added to the database");

        process.exit(); // Exit after completion
    } catch (error) {
        console.error("Error seeding threads:", error);
        process.exit(1); // Exit with error
    }
};

seedThreads();
