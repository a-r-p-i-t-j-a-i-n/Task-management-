const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/user.model');
const Task = require('./src/models/task.model');

dotenv.config();

const repair = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Get a valid admin
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('No admin found, creating one...');
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            admin = await User.create({
                name: 'System Admin',
                email: 'admin@system.com',
                password: hashedPassword,
                role: 'admin'
            });
        }
        console.log(`Using Admin: ${admin.name} (${admin._id})`);

        // 2. Fix Tasks
        console.log('Fixing tasks...');

        // Fix createdBy
        const updateResult = await Task.updateMany(
            { createdBy: { $eq: null } },
            { $set: { createdBy: admin._id } }
        );
        // Also update any that might point to non-existent users if possible, 
        // but simple null check is safer for now. 
        // Actually, let's just force update ALL tasks to this admin for createdBy 
        // if they are "broken" (we can't easily detect broken refs without loop).
        // Let's loop.

        const tasks = await Task.find({});
        for (const task of tasks) {
            // Check if createdBy user exists
            const creator = await User.findById(task.createdBy);
            if (!creator) {
                console.log(`Task ${task.title} has invalid creator. Reassigning...`);
                task.createdBy = admin._id;
            }

            // Check if assignedTo user exists (if set)
            if (task.assignedTo) {
                const assignee = await User.findById(task.assignedTo);
                if (!assignee) {
                    console.log(`Task ${task.title} has invalid assignee. Reassigning...`);
                    task.assignedTo = admin._id;
                }
            } else {
                // Optional: Assign unassigned tasks to admin for demo purposes
                // task.assignedTo = admin._id; 
            }

            // Ensure dates
            if (!task.dueDate) {
                // Set due date to tomorrow for demo
                const tmr = new Date();
                tmr.setDate(tmr.getDate() + 1);
                task.dueDate = tmr;
            }

            await task.save();
        }

        console.log('Repair complete.');
        process.exit();

    } catch (error) {
        console.error('Repair failed:', error);
        process.exit(1);
    }
};

repair();
