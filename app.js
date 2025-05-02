const express = require('express');
const app = express();
const { port } = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const subscriptionRouter = require('./routes/subscription.routes');
const connectDb = require('./databases/db');
const errorMiddleware = require('./middlewares/error.middleware');
const cookieParser = require('cookie-parser');
// const arcjetMiddleware = require('./middlewares/arcjet.middleware');
const workflowClient = require('./routes/workflow.routes');

// const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(arcjetMiddleware);

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowClient);

// middlewares
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to subscription tracker API');
});

// connectDb();

app.listen(port, async () => {
  try {
    await connectDb();
    console.log(`Server API is runing on http://localhost:${port}`);
  } catch (err) {
    console.log('error', err.message);
    process.exit(1);
  }
});
