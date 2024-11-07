require('dotenv').config({ path: './config/.env' });

console.log(process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/user'); // Import the User model

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Use .find() to get all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new user
app.post('/users', async (req, res) => {
  console.log(req.body);
  try {
    const newUser = new User(req.body); // Create a new User instance
    const savedUser = await newUser.save(); // Save to the database
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Return the updated document
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id); // Use .findByIdAndDelete()
    if (deletedUser) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
