const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables from .env
dotenv.config();

// Add CORS middleware
app.use(cors());

// Connect to MongoDB using the MONGODB_URI from .env
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a Mongoose schema for the "chatbot" collection
const chatbotSchema = new mongoose.Schema({
  name: String,
  url: String,
  data: String,
});

const Chatbot = mongoose.model('Chatbot', chatbotSchema);

app.use(bodyParser.json());

// Create a new chatbot entry
app.post('/api/chatbot', async (req, res) => {
  const { name, url, data } = req.body;

  const newChatbotData = new Chatbot({ name, url, data });

  try {
    await newChatbotData.save();
    res.json({ message: 'Data saved to chatbot collection successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Unable to save data to chatbot collection' });
  }
});

// Retrieve all chatbot entries
app.get('/api/chatbot', async (req, res) => {
  try {
    const chatbotData = await Chatbot.find({}).exec();
    res.json(chatbotData);
  } catch (err) {
    res.status(500).json({ error: 'Unable to retrieve data from chatbot collection' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
