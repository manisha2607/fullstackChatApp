const Message = require('../model/userMessage')

module.exports.createMessage = async (req, res) => {
    try {
      const { sender, content } = req.body;
  
      // Check if the sender already exists
      const existingMessage = await Message.findOne({ sender });
      if (existingMessage) {
        return res.status(400).json({ error: 'Sender already exists. Choose a different sender.' });
      }
        // Creating a new message instance
      const newMessage = new Message({ sender, content });
  
      // Saving the message to the database
      await newMessage.save();
  
      res.status(201).json({ 
        message: 'Message created successfully', 
        data: newMessage 
        });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ 
        error: 'Internal server error'
      });
    }
  };


// Add a new controller function to get all messages
module.exports.getMessages = async (req, res) => {
  try {
    // Retrieve all messages from the database
    const messages = await Message.find();
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
