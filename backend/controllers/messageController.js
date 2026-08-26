const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, jobId, content, type } = req.body;
    
    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = new Message({
      senderId: req.user.id,
      receiverId,
      jobId,
      content,
      type: type || 'chat'
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages for current user
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    // Get messages where user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: req.user.id }, { receiverId: req.user.id }]
    })
    .populate('senderId', 'name avatar role')
    .populate('receiverId', 'name avatar role')
    .populate('jobId', 'title company')
    .sort('-createdAt');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only receiver can mark as read
    if (message.receiverId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    message.read = true;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead
};
