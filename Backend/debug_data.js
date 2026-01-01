const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const run = async () => {
    try {
        // 1. Register a temp admin (or login if exists)
        // Actually, let's try to login with a known user or just create a new on
        // I'll assume there is an admin user from previous setup or I can create one.
        // Let's create a fresh admin to be sure.
        const adminUser = {
            name: 'Debug Admin',
            email: `debug_admin_${Date.now()}@test.com`,
            password: 'password123',
            role: 'admin'
        };

        console.log('Registering temporary admin...');
        try {
            await axios.post(`${API_URL}/auth/register`, adminUser);
        } catch (e) {
            console.log('Registration failed (maybe exists), trying login...');
        }

        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: adminUser.email,
            password: adminUser.password
        });

        const token = loginRes.data.token;
        console.log('Got token:', token ? 'Yes' : 'No');

        // 2. Fetch Tasks
        console.log('Fetching tasks...');
        const tasksRes = await axios.get(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const tasks = tasksRes.data.tasks;
        console.log(`Found ${tasks.length} tasks.`);

        if (tasks.length > 0) {
            console.log('First Task Structure:');
            console.log(JSON.stringify(tasks[0], null, 2));
        } else {
            console.log('No tasks found. Creating one...');
            const newTask = await axios.post(`${API_URL}/tasks`, {
                title: 'Debug Task',
                description: 'Testing data integrity',
                priority: 'high',
                status: 'todo'
            }, { headers: { Authorization: `Bearer ${token}` } });
            console.log('Created Task:', JSON.stringify(newTask.data, null, 2));
        }

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
};

run();
