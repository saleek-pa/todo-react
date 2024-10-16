const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const todoRoutes = require('./routes/todoRoutes');
const subTaskRoutes = require('./routes/subTaskRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const checkAuth = require('./middlewares/checkAuth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const router = express.Router();

mongoose
.connect(process.env.MONGODB_URL)
.then(() => console.log('Connected to MongoDB!'))
.catch(() => console.error('Failed to connect!'));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

router.use(checkAuth);
router.use('/todos', todoRoutes);
router.use('/todos', subTaskRoutes);

app.use('/api/users', userRoutes);
app.use('/api', router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
