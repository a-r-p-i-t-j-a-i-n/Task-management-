const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error.middleware');
const taskRoutes = require('./routes/task.routes')
const authRoutes = require('./routes/auth.routes');

const app = express();

// Simple Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', require('./routes/user.routes'));


app.use(errorHandler);

module.exports = app;
