const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB URI
const uri = "mongodb+srv://pedrobarongoe:pe061007@baron.vinoqtq.mongodb.net/?retryWrites=true&w=majority&appName=Baron";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(error => console.error('Failed to connect to MongoDB Atlas', error));

app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies

// Define a schema and model for messages
const messageSchema = new mongoose.Schema({
    text: String,
    role: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Route to get messages
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Route to post a message
app.post('/messages', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
