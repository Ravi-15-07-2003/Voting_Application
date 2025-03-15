const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./db');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Serve static files from the "public" folder
app.use(express.static('public'));

// Import API routes
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/api/user', userRoutes);
app.use('/api/candidate', candidateRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
